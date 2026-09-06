import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CheckCircle2, ClipboardList, Timer } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { SPRINT_CONFIG, WHATSAPP_DEMO_URL } from "@/lib/constants";
import {
  BOOKING_URL,
  CREDENTIALS,
  DISCLAIMER,
  DOMAINS,
  EXAM,
} from "@/lib/ccarf/blueprint";
import { QUESTIONS } from "@/lib/ccarf/bank";

export const metadata: Metadata = {
  title: "Claude Certified Architect Prep — Free CCAR-F Mock Exam & Study Guide",
  description:
    "Everything IntelliForge has built for the Claude Certified Architect exams: a free timed CCAR-F mock exam, the full question bank with documentation links, and the exam blueprint in one page.",
  alternates: { canonical: "/claude" },
  openGraph: {
    title: "Claude Certified Architect Prep — Free CCAR-F Mock Exam",
    description:
      "A free timed mock exam, a full practice bank with explanations, and the CCAR-F blueprint. No signup.",
    url: "/claude",
  },
};

export default function ClaudeHubPage() {
  const hasBooking = BOOKING_URL !== null;
  // An attempt is capped by the bank, so the page never advertises more than it has.
  const examCount = Math.min(EXAM.examQuestions, QUESTIONS.length);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <FadeIn className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">
          Claude Certified Architect
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Everything we build and write about{" "}
          <span className="gradient-text">Claude certification</span>, in one place.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Free practice for the {EXAM.name} exam, written from the published blueprint and the
          Claude documentation — with a link to the exact docs page behind every answer.
        </p>
      </FadeIn>

      {/* Practice */}
      <FadeIn className="mt-12">
        <div className="rounded-2xl border border-primary/40 bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              Free · no signup
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Free {EXAM.abbr} mock exam
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            A full mock for the {EXAM.name} exam: {examCount} questions in {EXAM.examMinutes}{" "}
            minutes, weighted to the real domain mix, scored by domain so you know where the
            hours should go.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Timer, text: `${examCount} timed questions mirroring the exam format` },
              { icon: ClipboardList, text: "Per-domain scoring against the pass analogue" },
              { icon: BookOpen, text: "Untimed practice with full explanations" },
              { icon: CheckCircle2, text: `${QUESTIONS.length} practice questions with documentation links` },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5 text-sm text-muted">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" aria-hidden />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/claude/quiz"
              className="rounded-lg bg-cta px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-cta-hover"
            >
              Start the free mock exam →
            </Link>
            <Link
              href="/claude/review"
              className="rounded-lg border border-border px-5 py-3 text-sm text-muted transition-colors hover:border-primary-light/60 hover:text-foreground"
            >
              Browse the question bank
            </Link>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-muted">{DISCLAIMER}</p>
        </div>
      </FadeIn>

      {/* Credentials */}
      <FadeIn className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Credentials</h2>
        <p className="mt-2 text-sm text-muted">
          The certifications behind this material.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {CREDENTIALS.map((credential) => {
            const body = (
              <>
                <h3 className="font-semibold text-foreground">{credential.title}</h3>
                <p className="mt-1 text-xs text-muted">
                  {credential.issued
                    ? `Issued ${credential.issued}`
                    : "Verification link coming soon"}
                </p>
              </>
            );

            return credential.url ? (
              <a
                key={credential.title}
                href={credential.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary-light/60"
              >
                {body}
                <p className="mt-2 text-xs text-primary-light">Verify on Credly ↗</p>
              </a>
            ) : (
              <div
                key={credential.title}
                className="rounded-xl border border-border bg-surface p-5 opacity-80"
              >
                {body}
              </div>
            );
          })}
        </div>
      </FadeIn>

      {/* Services */}
      <FadeIn className="mt-16">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Want a second pair of eyes?
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            One-to-one sessions on exam preparation, or an architecture review of the agent
            system you are actually building — the kind of tradeoff conversation the exam is
            testing you on.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={hasBooking ? (BOOKING_URL as string) : WHATSAPP_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              {hasBooking ? "Book a 1:1 session →" : "Message us on WhatsApp →"}
            </a>
          </div>
        </div>
      </FadeIn>

      {/* Resources */}
      <FadeIn className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Exam prep resources</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link
            href="/claude/foundations"
            className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary-light/60"
          >
            <h3 className="font-semibold text-foreground">CCAR-F exam guide</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              The blueprint in one page: format, the {DOMAINS.length} domains and their weights,
              all eight scenarios, the mental model, and the documentation to read.
            </p>
            <p className="mt-3 text-xs text-primary-light">Read the guide →</p>
          </Link>

          <Link
            href="/claude/review"
            className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary-light/60"
          >
            <h3 className="font-semibold text-foreground">Learn &amp; Review library</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              All {QUESTIONS.length} questions grouped by domain, with explanations, per-option
              reasoning, and a documentation link for every concept.
            </p>
            <p className="mt-3 text-xs text-primary-light">Open the library →</p>
          </Link>
        </div>
      </FadeIn>

      {/* Funnel */}
      <FadeIn className="mt-16">
        <div className="rounded-2xl border border-cta/40 bg-surface p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Certification proves you know it. Shipping proves you can do it.
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            The {SPRINT_CONFIG.name} is our build-alongside cohort: two live AI products in 14
            days, plus a recruiter-checkable credential. {SPRINT_CONFIG.liveScheduleSummary}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={SPRINT_CONFIG.href}
              className="rounded-lg bg-cta px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-cta-hover"
            >
              {SPRINT_CONFIG.ctaLabelShort}
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-border px-5 py-3 text-sm text-muted transition-colors hover:border-primary-light/60 hover:text-foreground"
            >
              See the 12-week bootcamp
            </Link>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}
