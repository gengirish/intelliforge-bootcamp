"use client";

import { cn } from "@/lib/utils";
import { DOMAINS, SCENARIOS } from "@/lib/ccarf/blueprint";
import { LETTERS, type Letter, type Question, type SessionItem } from "@/lib/ccarf/types";
import { QuizExplanation } from "./quiz-explanation";
import { RichText } from "./rich-text";

/**
 * One question. `revealed` is true in practice mode once an option is chosen, and
 * in the post-exam review; it switches the options from selectable to graded.
 */
export function QuizQuestion({
  item,
  question,
  chosen,
  revealed,
  onChoose,
}: {
  item: SessionItem;
  question: Question;
  chosen: Letter | undefined;
  revealed: boolean;
  onChoose?: (original: Letter) => void;
}) {
  const domain = DOMAINS.find((d) => d.id === question.domain);
  const scenario = SCENARIOS.find((s) => s.id === question.scenario);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
          Domain {question.domain} · {domain?.title}
        </span>
        {scenario && (
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
            Scenario: {scenario.title}
          </span>
        )}
      </div>

      <p className="mt-4 text-base leading-relaxed text-foreground sm:text-lg">
        <RichText>{question.stem}</RichText>
      </p>

      <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Answer options">
        {item.order.map((original, i) => {
          const shown = LETTERS[i];
          const isChosen = chosen === original;
          const isCorrect = original === question.answer;

          return (
            <button
              key={original}
              type="button"
              role="radio"
              aria-checked={isChosen}
              disabled={revealed}
              onClick={() => onChoose?.(original)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border p-3.5 text-left text-sm transition-colors sm:text-base",
                "border-border bg-surface-light/30",
                !revealed && "hover:border-primary-light/60 hover:bg-surface-light",
                !revealed && isChosen && "border-primary bg-primary/10",
                revealed && isCorrect && "border-accent bg-accent/10",
                revealed && isChosen && !isCorrect && "border-red-500/70 bg-red-500/10",
                revealed && "cursor-default"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border font-mono text-xs font-semibold",
                  !revealed && isChosen && "border-primary text-primary-light",
                  revealed && isCorrect && "border-accent text-accent",
                  revealed && isChosen && !isCorrect && "border-red-500/70 text-red-400"
                )}
              >
                {shown}
              </span>
              <span className="text-foreground/90">
                <RichText>{question.options[original]}</RichText>
              </span>
            </button>
          );
        })}
      </div>

      {revealed && <QuizExplanation item={item} question={question} />}
    </div>
  );
}
