import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { COHORT_2, FOUNDER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Join the Cohort 2 Waitlist · IntelliForge AI",
  description: `${COHORT_2.name} of the IntelliForge AI Bootcamp opens ${COHORT_2.launchWeekend}. First class ${COHORT_2.firstClass}.`,
};

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-bold text-foreground">
            IntelliForge AI
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Join the {COHORT_2.name} waitlist
          </h1>
          <p className="mt-5 text-lg text-muted">
            {COHORT_2.format} Taught live by {FOUNDER.name}.
          </p>

          <dl className="mt-8 grid gap-5 border-t border-border pt-6">
            <div>
              <dt className="text-sm text-muted">Enrolment opens</dt>
              <dd className="text-lg font-semibold">{COHORT_2.launchWeekend}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">First class</dt>
              <dd className="text-lg font-semibold">{COHORT_2.firstClass}</dd>
            </div>
          </dl>

          <p className="mt-8 text-muted">
            The waitlist hears first when enrolment opens. Joining is free and
            you don&apos;t have to enrol.
          </p>
        </div>

        <div className="min-w-0">
          <WaitlistForm />
        </div>
      </main>
    </div>
  );
}
