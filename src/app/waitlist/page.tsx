import type { Metadata } from "next";
import Link from "next/link";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { COHORT_2, COHORT_2_SPRINTS, FOUNDER, SPRINT_CONFIG } from "@/lib/constants";
import { getApprovedTestimonials } from "@/lib/testimonials-server";

/** Approved testimonials come from the database; admin actions also revalidate on change. */
export const revalidate = 300;

const SOCIAL_PROOF_LIMIT = 3;

export const metadata: Metadata = {
  title: "Join the Cohort 2 Waitlist · IntelliForge AI",
  description: `${COHORT_2.name} of the IntelliForge AI Bootcamp opens ${COHORT_2.launchWeekend}. First class ${COHORT_2.firstClass}.`,
};

export default async function WaitlistPage() {
  const testimonials = await getApprovedTestimonials({
    featuredFirst: true,
    limit: SOCIAL_PROOF_LIMIT,
  });

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

          <p className="mt-4 text-lg">
            <span className="font-semibold">{SPRINT_CONFIG.priceDisplay} per 2-week sprint.</span>{" "}
            <span className="text-muted">
              You pay one sprint at a time, with no upfront fee for all{" "}
              {COHORT_2_SPRINTS.length}. Joining the waitlist is free.
            </span>
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
          <p className="mt-3 text-sm text-muted">
            Employer paying?{" "}
            <Link href={COHORT_2.sponsorHref} className="text-accent hover:underline">
              Send them the one-page summary
            </Link>
            .
          </p>
        </div>

        <div className="min-w-0">
          <WaitlistForm />
        </div>
      </main>

      {testimonials.length > 0 && (
        <section
          aria-labelledby="waitlist-proof-heading"
          className="border-t border-border/50 bg-surface py-12 sm:py-16"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 id="waitlist-proof-heading" className="text-2xl font-bold sm:text-3xl">
              From learners in earlier sprints
            </h2>
            <p className="mt-2 text-muted">
              In their own words, verified through Google or LinkedIn sign-in.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
            <p className="mt-6">
              <Link href="/testimonials" className="font-medium text-primary-light hover:underline">
                Read all testimonials →
              </Link>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
