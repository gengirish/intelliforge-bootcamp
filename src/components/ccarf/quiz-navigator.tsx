"use client";

import { cn } from "@/lib/utils";
import type { QuizSession } from "@/lib/ccarf/types";

/** The exam-mode question grid: answered, flagged, and current at a glance. */
export function QuizNavigator({
  session,
  onJump,
}: {
  session: QuizSession;
  onJump: (index: number) => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-1.5" aria-label="Question navigator">
      {session.items.map((item, i) => {
        const answered = session.answers[item.id] != null;
        const flagged = Boolean(session.flags[item.id]);
        const current = i === session.idx;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onJump(i)}
            aria-label={`Question ${i + 1}${answered ? ", answered" : ""}${flagged ? ", flagged" : ""}`}
            aria-current={current}
            className={cn(
              "h-8 w-8 rounded-md border text-xs font-medium transition-colors",
              "border-border bg-surface text-muted hover:border-primary-light/60",
              answered && "border-primary/60 bg-primary/15 text-foreground",
              flagged && "border-cta text-cta",
              current && "ring-2 ring-primary-light ring-offset-2 ring-offset-background"
            )}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
