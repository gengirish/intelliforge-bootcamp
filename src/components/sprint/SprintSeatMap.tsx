"use client";

import { cn } from "@/lib/utils";

interface SprintSeatMapProps {
  filled: number;
  total: number;
  /** Names for booked seats, in seat index order (left-to-right, row A→C). */
  bookedNames?: readonly string[];
  className?: string;
}

/** 3 rows × (5 seats + aisle + 5 seats) = 30 cohort seats */
const ROWS = ["A", "B", "C"] as const;
const SEATS_PER_SIDE = 5;

function seatIndex(row: number, side: "left" | "right", col: number) {
  const base = row * (SEATS_PER_SIDE * 2);
  return side === "left" ? base + col : base + SEATS_PER_SIDE + col;
}

function seatLabel(row: number, side: "left" | "right", col: number) {
  const rowLabel = ROWS[row];
  const seatNum = side === "left" ? col + 1 : col + 6;
  return `${rowLabel}${seatNum}`;
}

export function SprintSeatMap({
  filled,
  total,
  bookedNames = [],
  className,
}: SprintSeatMapProps) {
  const effectiveFilled = Math.max(filled, bookedNames.length);
  const available = Math.max(0, total - effectiveFilled);
  const soldOut = available <= 0;

  return (
    <div
      className={cn("w-full max-w-md mx-auto", className)}
      role="img"
      aria-label={`Cohort seat map: ${effectiveFilled} of ${total} seats booked, ${available} available`}
    >
      <div className="mb-3 flex items-center justify-between text-xs text-muted">
        <span>
          <span className="font-semibold text-foreground">{effectiveFilled}</span> booked
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
        <div className="space-y-3">
          {ROWS.map((rowLabel, row) => (
            <div key={rowLabel} className="flex items-center gap-2">
              <span className="w-4 shrink-0 text-[10px] font-medium text-muted">
                {rowLabel}
              </span>
              <div className="flex flex-1 items-center justify-center gap-1.5">
                {Array.from({ length: SEATS_PER_SIDE }, (_, col) => {
                  const index = seatIndex(row, "left", col);
                  if (index >= total) return null;
                  const isFilled = index < effectiveFilled;
                  return (
                    <Seat
                      key={`${rowLabel}-L-${col}`}
                      filled={isFilled}
                      code={seatLabel(row, "left", col)}
                      occupantName={
                        isFilled ? bookedNames[index] : undefined
                      }
                    />
                  );
                })}
                <div className="w-4 shrink-0" aria-hidden />
                {Array.from({ length: SEATS_PER_SIDE }, (_, col) => {
                  const index = seatIndex(row, "right", col);
                  if (index >= total) return null;
                  const isFilled = index < effectiveFilled;
                  return (
                    <Seat
                      key={`${rowLabel}-R-${col}`}
                      filled={isFilled}
                      code={seatLabel(row, "right", col)}
                      occupantName={
                        isFilled ? bookedNames[index] : undefined
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <Seat filled={false} code="—" size="sm" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <Seat filled code="—" size="sm" />
            Booked
          </span>
          {bookedNames.length > 0 && (
            <span className="text-muted/80">Hover a booked seat for name</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Seat({
  filled,
  code,
  occupantName,
  size = "md",
}: {
  filled: boolean;
  code: string;
  occupantName?: string;
  size?: "sm" | "md";
}) {
  const ariaLabel = filled
    ? occupantName
      ? `Seat ${code}, booked by ${occupantName}`
      : `Seat ${code}, booked`
    : `Seat ${code}, available`;

  return (
    <div className="group relative flex items-center justify-center">
      <div
        role="img"
        aria-label={size === "md" ? ariaLabel : undefined}
        title={
          size === "md" && filled && occupantName
            ? occupantName
            : undefined
        }
        className={cn(
          "rounded-t-md rounded-b-sm border transition-colors",
          size === "sm" ? "h-3 w-3" : "h-5 w-5",
          filled
            ? "cursor-default border-cta/50 bg-cta/80 shadow-[0_0_8px_rgba(245,158,11,0.25)] group-hover:border-cta group-hover:bg-cta"
            : "border-green-500/30 bg-green-500/15",
          "duration-300"
        )}
      />
      {size === "md" && filled && occupantName && (
        <span
          className={cn(
            "pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2",
            "whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1",
            "text-[10px] font-medium text-foreground shadow-lg",
            "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
            "before:absolute before:left-1/2 before:top-full before:-translate-x-1/2",
            "before:border-4 before:border-transparent before:border-t-border"
          )}
          role="tooltip"
        >
          {occupantName}
        </span>
      )}
    </div>
  );
}
