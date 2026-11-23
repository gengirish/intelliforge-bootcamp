import type { Metadata } from "next";
import Link from "next/link";
import {
  COHORT_2,
  COHORT_2_SPRINTS,
  FOUNDER,
  SITE_CONFIG,
  SPRINT_CONFIG,
  SPRINT_PRICE_IN_PAISE,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Employer sponsorship · IntelliForge AI Bootcamp",
  description: `A one-page summary of ${COHORT_2.name} of the IntelliForge AI Bootcamp for managers and L&D teams: what it covers, what your engineer ships, and what it costs.`,
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const fullProgramme = inr.format((SPRINT_PRICE_IN_PAISE * COHORT_2_SPRINTS.length) / 100);

/**
 * One-pager a waitlister forwards to the employer who would pay. Every fact
 * here comes from constants.ts, so it can't drift from the rest of the site.
 */
export default function SponsorPage() {
  const email = SITE_CONFIG.contact.email;
  const mailSubject = encodeURIComponent(`Employer sponsorship: ${COHORT_2.name}`);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-bold text-foreground">
            IntelliForge AI
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-primary-light">
          For managers and L&amp;D teams
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          Sponsor an engineer for {COHORT_2.name} of the IntelliForge AI Bootcamp
        </h1>
        <p className="mt-4 text-lg text-muted">
          A live, build-first programme where working engineers ship AI features to production
          rather than watching lectures. {COHORT_2.format}
        </p>

        <dl className="mt-8 grid gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted">Price</dt>
            <dd className="font-semibold">{SPRINT_CONFIG.priceDisplay} per sprint</dd>
            <dd className="text-sm text-muted">
              {fullProgramme} for all {COHORT_2_SPRINTS.length}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">First class</dt>
            <dd className="font-semibold">{COHORT_2.firstClass}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Time commitment</dt>
            <dd className="font-semibold">Weekends, 7–10 PM IST</dd>
            <dd className="text-sm text-muted">Outside working hours</dd>
          </div>
        </dl>

        <h2 className="mt-12 text-2xl font-bold">What your engineer ships</h2>
        <p className="mt-2 text-muted">
          Each 2-week sprint ends in working software, not a certificate of attendance.
        </p>
        <ol className="mt-6 space-y-4">
          {COHORT_2_SPRINTS.map((s) => (
            <li key={s.slug} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">
                  Sprint {s.number}: {s.title}
                </h3>
                <span className="text-sm text-muted">
                  {s.weeks} · {s.dates}
                </span>
              </div>
              <p className="mt-1 text-muted">{s.ships}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 text-2xl font-bold">Who teaches it</h2>
        <p className="mt-2 text-muted">
          {FOUNDER.fullName}, {FOUNDER.title} at {FOUNDER.company}. {FOUNDER.bio}
        </p>

        <h2 className="mt-12 text-2xl font-bold">How payment works</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
          <li>
            Sprints are bought one at a time, so you can sponsor the first and decide on the rest
            once you&apos;ve seen what it produces.
          </li>
          <li>
            Enrolment opens on {COHORT_2.launchWeekend}. Your engineer joins the waitlist now to
            hear first.
          </li>
          <li>
            If your company needs to pay another way than online checkout, or wants to sponsor
            several engineers, email{" "}
            <a
              href={`mailto:${email}?subject=${mailSubject}`}
              className="text-accent hover:underline"
            >
              {email}
            </a>{" "}
            with your company name and how many seats.
          </li>
        </ul>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href={COHORT_2.waitlistHref}
            className="flex items-center justify-center rounded-lg bg-cta px-6 py-3.5 font-semibold text-background transition-colors hover:bg-cta-hover"
          >
            Join the {COHORT_2.name} waitlist
          </Link>
          <Link
            href="/sprint/all"
            className="flex items-center justify-center rounded-lg border border-border bg-surface px-6 py-3.5 font-semibold text-foreground transition-colors hover:border-primary/40"
          >
            See all six sprints
          </Link>
        </div>
      </main>
    </div>
  );
}
