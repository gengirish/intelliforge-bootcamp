import Link from "next/link";
import type { Metadata } from "next";
import { SprintCheckoutButton } from "@/components/sprint/SprintCheckoutButton";
import {
  COHORT_2,
  COHORT_2_SPRINTS,
  PRICING,
  SPRINT_CONFIG,
  SPRINT_PRICE_IN_PAISE,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "All 6 Sprints — 12-Week AI Bootcamp · IntelliForge AI",
  description: `Six 2-week sprints at ${PRICING.perSprint.price} each, ${PRICING.fullProgramme.price} in all. ${COHORT_2.name} starts ${COHORT_2.firstClass}.`,
};

export const revalidate = 30;

export default async function AllSprintsPage() {
  let onSale = new Set<string>();
  try {
    const rows = await prisma.sprint.findMany({
      where: {
        slug: { in: COHORT_2_SPRINTS.map((sprint) => sprint.slug) },
        isActive: true,
      },
      select: { slug: true },
    });
    onSale = new Set(rows.map((row) => row.slug));
  } catch {
    // DB unavailable: list the sprints without buy buttons.
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← IntelliForge AI
        </Link>
        <h1 className="mt-6 text-4xl font-bold">All 6 sprints</h1>
        <p className="mt-4 text-lg text-muted">
          {COHORT_2.format} {PRICING.perSprint.price} per sprint,{" "}
          {PRICING.fullProgramme.price} in all. Buy one at a time. Each is
          refundable in full until its first class.
        </p>

        <ol className="mt-10 space-y-4">
          {COHORT_2_SPRINTS.map((sprint) => (
            <li
              key={sprint.slug}
              className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-accent">
                  Sprint {sprint.number} · {sprint.dates} · {sprint.weeks}
                </p>
                <h2 className="mt-1 text-xl font-semibold">{sprint.title}</h2>
                <p className="mt-2 text-sm text-muted">{sprint.ships}</p>
              </div>
              <div className="shrink-0">
                {SPRINT_CONFIG.enrollmentOpen && onSale.has(sprint.slug) ? (
                  <SprintCheckoutButton
                    sprintSlug={sprint.slug}
                    priceInPaise={SPRINT_PRICE_IN_PAISE}
                    label={`Enroll — ${PRICING.perSprint.price}`}
                  />
                ) : (
                  <span className="text-sm text-muted">Not on sale yet</span>
                )}
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-sm text-muted">
          Finish all six to earn the verifiable credential, mentor score, lifetime
          LMS access, and build-alongside eligibility.
        </p>

        {!SPRINT_CONFIG.enrollmentOpen && (
          <Link
            href={COHORT_2.waitlistHref}
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-cta px-8 py-3 font-semibold text-background transition-colors hover:bg-cta-hover focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Join the {COHORT_2.name} waitlist
          </Link>
        )}
      </div>
    </main>
  );
}
