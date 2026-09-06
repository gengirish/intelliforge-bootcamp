"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps the server-rendered question library and toggles "test mode", which hides
 * every answer block via CSS so the page can be read as a quiz.
 *
 * The questions themselves stay server components — they arrive as `children` and
 * ship no JavaScript.
 */
export function ReviewShell({ children }: { children: ReactNode }) {
  const [testMode, setTestMode] = useState(false);

  return (
    <div className={cn(testMode && "ccarf-test-mode")}>
      <div className="sticky top-14 z-40 -mx-4 mb-8 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
          <input
            type="checkbox"
            checked={testMode}
            onChange={(event) => setTestMode(event.target.checked)}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          Test mode — hide answers and explanations
        </label>
      </div>
      {children}
    </div>
  );
}
