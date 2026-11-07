/**
 * One-off: send the waitlist welcome email (setup course + WhatsApp) to people
 * who joined before signups started getting it automatically.
 *
 *   npx dotenv -e .env.local -- tsx scripts/send-waitlist-welcome.ts --before 2026-11-07T12:00:00Z
 *   npx dotenv -e .env.local -- tsx scripts/send-waitlist-welcome.ts --before 2026-11-07T12:00:00Z --send
 *
 * Without --send it only lists who would be emailed. --before is the time the
 * automatic email went live, so later signups (who already got it) are skipped.
 * Every address sent to is appended to scripts/.waitlist-welcome-sent.log, and
 * re-runs skip those, so an interrupted run can simply be started again.
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { COHORT_2 } from "../src/lib/constants";
import { sendWaitlistConfirmation } from "../src/lib/email";

const prisma = new PrismaClient();
const LOG = join(__dirname, ".waitlist-welcome-sent.log");

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
}

async function main() {
  const send = process.argv.includes("--send");
  const beforeRaw = arg("--before");
  const before = beforeRaw ? new Date(beforeRaw) : undefined;
  if (!before || Number.isNaN(before.getTime())) {
    throw new Error("Pass --before <ISO time the automatic email went live>.");
  }
  if (send && !process.env.AGENTMAIL_API_KEY) {
    throw new Error("AGENTMAIL_API_KEY is not set.");
  }

  const alreadySent = new Set(
    existsSync(LOG)
      ? readFileSync(LOG, "utf8").split(/\r?\n/).filter(Boolean)
      : []
  );

  const entries = await prisma.waitlistEntry.findMany({
    where: { cohort: COHORT_2.slug, createdAt: { lt: before } },
    orderBy: { createdAt: "asc" },
    select: { name: true, email: true, createdAt: true },
  });
  const pending = entries.filter((e) => !alreadySent.has(e.email));

  console.log(
    `${entries.length} joined before ${before.toISOString()}; ` +
      `${entries.length - pending.length} already emailed; ${pending.length} to send.`
  );
  for (const e of pending) {
    console.log(`  ${e.createdAt.toISOString()}  ${e.email}  (${e.name})`);
  }
  if (!send) {
    console.log("\nDry run. Re-run with --send to email them.");
    return;
  }

  let ok = 0;
  for (const e of pending) {
    try {
      await sendWaitlistConfirmation({
        name: e.name,
        email: e.email,
        cohortName: COHORT_2.name,
        launchWeekend: COHORT_2.launchWeekend,
        firstClass: COHORT_2.firstClass,
        prepCourseName: COHORT_2.prepCourse.name,
        prepCourseUrl: COHORT_2.prepCourse.url,
        whatsappUrl: COHORT_2.whatsappUrl,
      });
      appendFileSync(LOG, `${e.email}\n`);
      ok++;
      console.log(`sent  ${e.email}`);
    } catch (err) {
      console.error(`FAIL  ${e.email}:`, err instanceof Error ? err.message : err);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log(`\nSent ${ok}/${pending.length}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
