import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, Handshake, PenLine, ShieldCheck } from "lucide-react";
import { TestimonialAvatar, TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { COHORT_2, CTA_MICRO_TRUST, FOUNDER, SPRINT_CONFIG } from "@/lib/constants";
import { getApprovedTestimonials } from "@/lib/testimonials-server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Learner testimonials · IntelliForge AI Bootcamp",
  description:
    "What working professionals say about the IntelliForge AI Bootcamp, in their own words, verified through Google or LinkedIn sign-in.",
  alternates: { canonical: "/testimonials" },
};

/** Only claims that hold for every card on the page: see TestimonialCard and the admin review flow. */
const VERIFICATION = [
  {
    icon: ShieldCheck,
    title: "Real, signed-in people",
    body: "Name and photo come from the learner's own Google or LinkedIn account, confirmed when they signed in.",
  },
  {
    icon: PenLine,
    title: "Their words, unedited",
    body: "Each quote is published exactly as the learner wrote it. We never write or rewrite one.",
  },
  {
    icon: Handshake,
    title: "Published with consent",
    body: "Every learner agreed to publication and can have theirs taken down at any time.",
  },
] as const;

const AVATAR_STACK = 5;

export default async function TestimonialsPage() {
  const testimonials = await getApprovedTestimonials({ featuredFirst: true });
  const [lead, ...rest] = testimonials;
  const anyVerifiedLearner = testimonials.some((t) => t.verifiedLearner);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-foreground">
          IntelliForge AI
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {/* Hero */}
        <section className="relative pt-16 sm:pt-24">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-0 h-72 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary-light">
              Learner testimonials
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              What learners say
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
              Working engineers and architects on what they learned and built with {FOUNDER.name},
              in their own words.
            </p>

            {testimonials.length > 0 && (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <div className="flex -space-x-3">
                  {testimonials.slice(0, AVATAR_STACK).map((t) => (
                    <TestimonialAvatar
                      key={t.id}
                      testimonial={t}
                      size="sm"
                      className="ring-background"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted">
                  {testimonials.length} {testimonials.length === 1 ? "learner" : "learners"} ·
                  every identity verified at sign-in
                </p>
              </div>
            )}
          </div>
        </section>

        {/* How these are verified */}
        <section aria-labelledby="verification-heading" className="mt-14 sm:mt-16">
          <h2 id="verification-heading" className="sr-only">
            How these testimonials are verified
          </h2>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {VERIFICATION.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4 bg-surface p-5 sm:p-6">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary-light" aria-hidden />
                <div>
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ul>
          {anyVerifiedLearner && (
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted">
              <GraduationCap className="h-4 w-4 text-green-300" aria-hidden />
              &ldquo;Verified learner&rdquo; means we matched them to a paid enrolment, or checked their
              UPI or bank payment against our records.
            </p>
          )}
        </section>

        {/* Testimonials */}
        {lead ? (
          <section aria-label="Testimonials" className="mt-12 sm:mt-16">
            <TestimonialCard testimonial={lead} featured />
            {rest.length > 0 && (
              <div
                className={
                  rest.length === 1
                    ? "mt-6"
                    : "mt-6 columns-1 gap-6 md:columns-2 [&>*]:mb-6 [&>*]:break-inside-avoid"
                }
              >
                {rest.map((t) => (
                  <TestimonialCard key={t.id} testimonial={t} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <p className="mt-16 text-center text-muted">
            The first testimonials are being reviewed. Check back soon.
          </p>
        )}

        {/* Next step */}
        <section
          aria-labelledby="next-cohort-heading"
          className="relative mt-16 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-surface to-surface p-8 text-center sm:p-12"
        >
          <h2
            id="next-cohort-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {COHORT_2.name} starts {COHORT_2.firstClassShort}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">{COHORT_2.format}</p>
          <Link
            href={SPRINT_CONFIG.ctaHref}
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-cta px-6 py-3 font-semibold text-background transition-colors hover:bg-cta-hover"
          >
            {SPRINT_CONFIG.ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <p className="mt-4 text-xs text-muted">{CTA_MICRO_TRUST.sprint}</p>
        </section>

        <p className="mt-10 text-center text-sm text-muted">
          Learned with us?{" "}
          <Link href="/testimonials/submit" className="text-primary-light hover:underline">
            Share your testimonial
          </Link>
        </p>
      </main>
    </div>
  );
}
