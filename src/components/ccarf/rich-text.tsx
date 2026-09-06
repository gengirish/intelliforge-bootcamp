import { Fragment } from "react";

/**
 * Renders the small inline subset the question bank uses: `code`, **bold** and
 * *italic*. Returns React nodes rather than HTML, so question text can never
 * inject markup.
 */

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;

export function RichText({ children }: { children: string }) {
  const parts = children.split(TOKEN).filter((part) => part !== "");

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={i}
              className="rounded bg-surface-light px-1.5 py-0.5 font-mono text-[0.9em] text-primary-light"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

