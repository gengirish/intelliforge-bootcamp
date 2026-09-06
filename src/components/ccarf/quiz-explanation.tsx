import { LETTERS, type Letter, type Question, type SessionItem } from "@/lib/ccarf/types";
import { displayLetter } from "@/lib/ccarf/scoring";
import { RichText } from "./rich-text";

/**
 * The post-answer breakdown: why the correct option is correct, then why each
 * distractor is not. Letters are the ones this attempt displayed, not the bank's.
 */
export function QuizExplanation({
  item,
  question,
}: {
  item: SessionItem;
  question: Question;
}) {
  const wrong = LETTERS.filter((letter): letter is Letter => letter !== question.answer)
    .map((letter) => ({ shown: displayLetter(item, letter), text: question.distractors[letter] }))
    .filter((row): row is { shown: Letter; text: string } => Boolean(row.text))
    .sort((a, b) => a.shown.localeCompare(b.shown));

  return (
    <div className="mt-5 space-y-3 rounded-lg border border-border bg-surface-light/40 p-4 text-sm">
      <p className="text-muted">
        <span className="font-semibold text-accent">
          Correct answer: {displayLetter(item, question.answer)}.
        </span>{" "}
        <RichText>{question.explanation}</RichText>
      </p>

      {wrong.map((row) => (
        <p key={row.shown} className="text-muted">
          <span className="font-semibold text-foreground">Why not {row.shown}:</span>{" "}
          <RichText>{row.text}</RichText>
        </p>
      ))}

      <p className="pt-1">
        <a
          href={question.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-light underline underline-offset-4 hover:text-accent"
        >
          Read the documentation for this topic →
        </a>
      </p>
    </div>
  );
}
