import type { Metadata } from "next";
import Link from "next/link";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { COHORT_2, FOUNDER, SPRINT_CONFIG } from "@/lib/constants";
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

  const facts = [
    `Opens ${COHORT_2.launchWeekendShort}`,
    `Starts ${COHORT_2.firstClassShort}`,
    `${SPRINT_CONFIG.priceDisplay} per sprint`,
    "Free to join",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-xl px-4 pt-8 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-foreground">
          IntelliForge AI
        </Link>
      </header>

      <main className="mx-auto max-w-xl px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Join the {COHORT_2.name} waitlist
        </h1>
        <p className="mt-4 text-muted">
          {COHORT_2.format} Taught live by {FOUNDER.name}.
        </p>

        {/* A 2×2 grid on phones, so a wrap never strands a separator; one dotted line above. */}
        <ul className="mt-6 grid grid-cols-2 gap-y-1 text-sm text-foreground sm:flex sm:flex-wrap sm:gap-x-3">
          {facts.map((f, i) => (
            <li key={f} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="hidden text-muted/50 sm:inline">
                  ·
                </span>
              )}
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-muted">
          You pay one sprint at a time, with no upfront fee.
        </p>

        <div className="mt-12">
          <WaitlistForm />
        </div>
      </main>

      {testimonials.length > 0 && (
        <section
          aria-labelledby="waitlist-proof-heading"
          className="mx-auto max-w-5xl border-t border-border px-4 py-16 sm:px-6"
        >
          <h2 id="waitlist-proof-heading" className="text-xl font-semibold tracking-tight">
            From learners in earlier sprints
          </h2>
          <p className="mt-1 text-sm text-muted">
            In their own words, verified through Google or LinkedIn sign-in.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
          <p className="mt-6">
            <Link
              href="/testimonials"
              className="text-sm text-muted underline underline-offset-4 hover:text-foreground"
            >
              Read all testimonials
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}
