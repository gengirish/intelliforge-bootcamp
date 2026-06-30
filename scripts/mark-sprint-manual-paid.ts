import { PrismaClient } from "@prisma/client";
import { markSprintEnrollmentPaidManually } from "../src/lib/sprint-payment";
import { getSprintSeatCounts } from "../src/lib/sprint-seats";

const prisma = new PrismaClient();

const email = process.argv[2];
const note = process.argv[3] ?? "Manual payment";

if (!email) {
  console.error("Usage: npx tsx scripts/mark-sprint-manual-paid.ts <email> [note]");
  process.exit(1);
}

async function main() {
  const enrollment = await prisma.sprintEnrollment.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
      sprint: { slug: "ai-sprint-jun-2026" },
      status: { not: "PAID" },
    },
    orderBy: { enrolledAt: "asc" },
    select: { id: true, email: true, name: true, status: true },
  });

  if (!enrollment) {
    const paid = await prisma.sprintEnrollment.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        sprint: { slug: "ai-sprint-jun-2026" },
        status: "PAID",
      },
      select: { id: true, email: true, name: true },
    });

    if (paid) {
      console.log(JSON.stringify({ message: "Already paid", enrollment: paid }, null, 2));
      return;
    }

    throw new Error(`No pending enrollment found for ${email}`);
  }

  const result = await markSprintEnrollmentPaidManually(enrollment.id, note);
  const seats = await getSprintSeatCounts("ai-sprint-jun-2026");

  console.log(
    JSON.stringify(
      {
        enrollment,
        result,
        seats,
      },
      null,
      2
    )
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
