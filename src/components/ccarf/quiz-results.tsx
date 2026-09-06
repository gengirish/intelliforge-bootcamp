"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DOMAINS, EXAM } from "@/lib/ccarf/blueprint";
import { grade } from "@/lib/ccarf/scoring";
import type { Question, QuizSession } from "@/lib/ccarf/types";
import { QuizQuestion } from "./quiz-question";

export function QuizResults({
  session,
  byId,
  onRestart,
}: {
  session: QuizSession;
  byId: Readonly<Record<string, Question>>;
  onRestart: () => void;
}) {
  const [showReview, setShowReview] = useState(false);
  const result = grade(session, byId);
  const isExam = session.mode === "exam";

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-6 text-center sm:p-8">
        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
          {session.label} · results
        </span>

        <p className="mt-4 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          {result.percent}%
        </p>
        <p className="mt-1 text-sm text-muted">
          {result.correct} of {result.total} correct
        </p>

        {isExam && (
          <>
            <p
              className={cn(
                "mt-4 text-sm font-semibold",
                result.passed ? "text-accent" : "text-cta"
              )}
            >
              {result.passed
                ? `Above the ~${EXAM.passPercent}% passing analogue`
                : `Below the ~${EXAM.passPercent}% passing analogue`}
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
              Indicative only. The real {EXAM.abbr} reports a scaled score (
              {EXAM.scaledScoreRange}, cut score {EXAM.scaledPassMark}); this is an unofficial
              percentage estimate over an unofficial question bank.
            </p>
          </>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-foreground">Score by domain</h2>
        <div className="mt-5 space-y-4">
          {result.byDomain.map((row) => {
            const domain = DOMAINS.find((d) => d.id === row.domain);
            return (
              <div key={row.domain}>
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="text-foreground">
                    D{row.domain} · {domain?.title}
                  </span>
                  <span className="text-muted">
                    {row.correct}/{row.total} · {row.percent}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-light">
                  <span
                    className={cn(
                      "block h-full rounded-full",
                      row.percent >= EXAM.passPercent ? "bg-accent" : "bg-cta"
                    )}
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-primary-light/60 hover:text-foreground"
        >
          ← Back to menu
        </button>
        <span className="flex-1" />
        <button
          type="button"
          onClick={() => setShowReview((v) => !v)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
        >
          {showReview ? "Hide review" : "Review all answers ↓"}
        </button>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface-light/30 p-5 text-sm text-muted">
        <p>
          <strong className="text-foreground">Work through what you missed.</strong> The Learn
          &amp; Review library has every question with its full explanation and a link to the
          exact Claude documentation page for the concept.
        </p>
        <Link
          href="/claude/review"
          className="mt-3 inline-block rounded-lg bg-cta px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-cta-hover"
        >
          Open Learn &amp; Review →
        </Link>
      </div>

      {showReview && (
        <div className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Full review</h2>
          {session.items.map((item, i) => {
            const question = byId[item.id];
            if (!question) return null;
            const chosen = session.answers[item.id];
            const verdict =
              chosen == null ? "unanswered" : chosen === question.answer ? "correct" : "incorrect";

            return (
              <div key={item.id}>
                <div className="mb-1.5 flex flex-wrap justify-between gap-2 text-xs">
                  <span className="text-muted">
                    Q{i + 1} · D{question.domain}
                  </span>
                  <span
                    className={cn(
                      verdict === "correct" && "text-accent",
                      verdict === "incorrect" && "text-red-400",
                      verdict === "unanswered" && "text-muted"
                    )}
                  >
                    {verdict}
                  </span>
                </div>
                <QuizQuestion item={item} question={question} chosen={chosen} revealed />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
