"use client";

import { useEffect, useState } from "react";
import {
  getCountdownParts,
  padCountdownUnit,
  resolveSprintStartIso,
} from "@/lib/sprint-schedule";
import { formatISTDate } from "@/lib/sprint-format";
import { cn } from "@/lib/utils";

interface SprintCountdownProps {
  startDate?: string;
  className?: string;
  compact?: boolean;
}

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
] as const;

export function SprintCountdown({
  startDate,
  className,
  compact = false,
}: SprintCountdownProps) {
  const targetIso = resolveSprintStartIso(startDate);
  const startLabel = formatISTDate(targetIso);
  const [parts, setParts] = useState(() => getCountdownParts(targetIso));

  useEffect(() => {
    const tick = () => setParts(getCountdownParts(targetIso));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  if (parts.isPast) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-green-500/30 bg-green-500/10 px-6 py-5 text-center",
          className
        )}
      >
        <p className="text-sm font-medium uppercase tracking-wider text-green-400">
          Cohort 1 is underway
        </p>
        <p className="mt-1 text-muted text-sm">
          Live classes run every Saturday &amp; Sunday — join via WhatsApp for Zoom links.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface/80 px-6 py-6 backdrop-blur",
        className
      )}
      aria-live="polite"
    >
      <p
        className={cn(
          "font-semibold text-foreground",
          compact ? "text-sm" : "text-base"
        )}
      >
        Countdown to Cohort 1 kickoff
      </p>
      <p className="mt-1 text-sm text-muted">
        First live class · {startLabel} · 9:00 AM IST
      </p>

      <div
        className={cn(
          "mt-5 grid grid-cols-4 gap-2 sm:gap-3",
          compact && "mt-4"
        )}
      >
        {UNITS.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-xl border border-border bg-background/60 px-2 py-3 sm:px-3 sm:py-4"
          >
            <div
              className={cn(
                "font-bold tabular-nums text-foreground",
                compact ? "text-2xl" : "text-3xl sm:text-4xl"
              )}
            >
              {padCountdownUnit(parts[key])}
            </div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted sm:text-xs">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
