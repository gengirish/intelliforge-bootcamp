"use client";

import { cn } from "@/lib/utils";

interface SprintSeatMapProps {
  filled: number;
  total: number;
  className?: string;
}

/** 3 rows × (5 seats + aisle + 5 seats) = 30 cohort seats */
const ROWS = ["A", "B", "C"] as const;
const SEATS_PER_SIDE = 5;

function seatIndex(row: number, side: "left" | "right", col: number) {
  const base = row * (SEATS_PER_SIDE * 2);
  return side === "left" ? base + col : base + SEATS_PER_SIDE + col;
}

export function SprintSeatMap({ filled, total, className }: SprintSeatMapProps) {
  const available = Math.max(0, total - filled);
  const soldOut = available <= 0;

  return (
    <div
      className={cn("w-full max-w-md mx-auto", className)}
      role="img"
      aria-label={`Cohort seat map: ${filled} of ${total} seats booked, ${available} available`}
    >
      <div className="mb-3 flex items-center justify-between text-xs text-muted">
        <span>
          <span className="font-semibold text-foreground">{filled}</span> booked
        </span>
        <span>
          <span
            className={cn(
              "font-semibold",
              soldOut ? "text-red-400" : "text-green-400"
            )}
          >
            {available}
          </span>{" "}
          {soldOut ? "sold out" : "available"}
        </span>
      </div>

      <div className="rounded-xl border border-border bg-surface/80 p-5">
        {/* Screen */}
        <div className="mb-6 flex flex-col items-center">
          <div
            className="h-2 w-3/4 rounded-t-full bg-gradient-to-b from-primary/60 to-primary/20 shadow-[0_0_24px_rgba(124,58,237,0.35)]"
            aria-hidden
          />
          <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted">
            Live Zoom
          </span>
        </div>

        {/* Rows */}
        <div className="space-y-3" aria-hidden>
          {ROWS.map((rowLabel, row) => (
            <div key={rowLabel} className="flex items-center gap-2">
              <span className="w-4 shrink-0 text-[10px] font-medium text-muted">
                {rowLabel}
              </span>
              <div className="flex flex-1 items-center justify-center gap-1.5">
                {Array.from({ length: SEATS_PER_SIDE }, (_, col) => {
                  const index = seatIndex(row, "left", col);
                  if (index >= total) return null;
                  const isFilled = index < filled;
                  return (
                    <Seat key={`${rowLabel}-L-${col}`} filled={isFilled} />
                  );
                })}
                <div className="w-4 shrink-0" />
                {Array.from({ length: SEATS_PER_SIDE }, (_, col) => {
                  const index = seatIndex(row, "right", col);
                  if (index >= total) return null;
                  const isFilled = index < filled;
                  return (
                    <Seat key={`${rowLabel}-R-${col}`} filled={isFilled} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-5 flex items-center justify-center gap-5 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <Seat filled={false} size="sm" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <Seat filled size="sm" />
            Booked
          </span>
        </div>
      </div>
    </div>
  );
}

function Seat({
  filled,
  size = "md",
}: {
  filled: boolean;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "rounded-t-md rounded-b-sm border transition-colors",
        size === "sm" ? "h-3 w-3" : "h-5 w-5",
        filled
          ? "border-cta/50 bg-cta/80 shadow-[0_0_8px_rgba(245,158,11,0.25)]"
          : "border-green-500/30 bg-green-500/15",
        "duration-300"
      )}
    />
  );
}
