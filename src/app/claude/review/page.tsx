import type { Metadata } from "next";
import Link from "next/link";
import { DISCLAIMER, DOMAINS } from "@/lib/ccarf/blueprint";
import { QUESTIONS, questionsForDomain } from "@/lib/ccarf/bank";
import { LETTERS } from "@/lib/ccarf/types";
import { ReviewShell } from "@/components/ccarf/review-shell";
import { RichText } from "@/components/ccarf/rich-text";

export const metadata: Metadata = {
  title: "CCAR-F Question Bank — Learn & Review with Documentation Links",
  description:
    "Every IntelliForge CCAR-F practice question in one page, grouped by domain, with the correct answer, why each wrong option is wrong, and a link to the Claude documentation page that teaches the concept.",
  alternates: { canonical: "/claude/review" },
  openGraph: {
    title: "CCAR-F Question Bank — Learn & Review",
    description:
      "The full Claude Certified Architect, Foundations practice bank with explanations and documentation links.",
    url: "/claude/review",
  },
};

export default function ReviewPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium uppercase tracking-wider text-accent">Learn &amp; Review</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        The full {QUESTIONS.length}-question bank
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        Every question in one scrollable page, grouped by domain, with the correct answer, why
        each wrong option is wrong, and a link to the exact Claude documentation page for the
        concept. Read it end to end, or use test mode to hide the answers and self-check.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Jump to domain">
        {DOMAINS.map((domain) => (
          <a
            key={domain.id}
            href={`#domain-${domain.id}`}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary-light/60 hover:text-foreground"
          >
            D{domain.id} · {domain.title} ({questionsForDomain(domain.id).length})
          </a>
        ))}
      </nav>

      <div className="mt-8">
        <ReviewShell>
          {DOMAINS.map((domain) => {
            const items = questionsForDomain(domain.id);
            if (items.length === 0) return null;

            return (
              <section key={domain.id} id={`domain-${domain.id}`} className="scroll-mt-32 pt-8">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Domain {domain.id} · {domain.title}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {domain.weight}% of the exam · {items.length}{" "}
                  {items.length === 1 ? "question" : "questions"}
                </p>

                <div className="mt-5 space-y-5">
                  {items.map((question) => (
                    <article
                      key={question.id}
                      id={question.id}
                      className="scroll-mt-32 rounded-xl border border-border bg-surface p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                        <span className="font-mono">{question.id}</span>
                        <span aria-hidden>·</span>
                        <span>Task {question.task}</span>
                      </div>

                      <p className="mt-3 leading-relaxed text-foreground">
                        <RichText>{question.stem}</RichText>
                      </p>

                      <ol className="mt-4 space-y-2 text-sm">
                        {LETTERS.map((letter) => (
                          <li key={letter} className="flex gap-3">
                            <span className="font-mono text-xs text-muted">{letter}</span>
                            <span className="text-foreground/90">
                              <RichText>{question.options[letter]}</RichText>
                            </span>
                          </li>
                        ))}
                      </ol>

                      <div
                        data-ccarf-answer
                        className="mt-4 space-y-2.5 rounded-lg border border-border bg-surface-light/40 p-4 text-sm"
                      >
                        <p className="text-muted">
                          <span className="font-semibold text-accent">
                            Correct answer: {question.answer}.
                          </span>{" "}
                          <RichText>{question.explanation}</RichText>
                        </p>
                        {LETTERS.filter((letter) => question.distractors[letter]).map((letter) => (
                          <p key={letter} className="text-muted">
                            <span className="font-semibold text-foreground">
                              Why not {letter}:
                            </span>{" "}
                            <RichText>{question.distractors[letter] as string}</RichText>
                          </p>
                        ))}
                        <p className="pt-1">
                          <a
                            href={question.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-light underline underline-offset-4 hover:text-accent"
                          >
                            Documentation for this topic →
                          </a>
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </ReviewShell>
      </div>

      <div className="mt-12 rounded-xl border border-border bg-surface-light/30 p-5 text-sm text-muted">
        <p>
          <strong className="text-foreground">Ready to sit it under time?</strong> The mock exam
          shuffles questions and options, runs a 120-minute clock, and scores you by domain.
        </p>
        <Link
          href="/claude/quiz"
          className="mt-3 inline-block rounded-lg bg-cta px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-cta-hover"
        >
          Take the mock exam →
        </Link>
      </div>

      <p className="mt-10 text-xs leading-relaxed text-muted">{DISCLAIMER}</p>
    </main>
  );
}
