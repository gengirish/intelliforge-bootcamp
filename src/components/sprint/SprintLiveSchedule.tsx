"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  SPRINT_LIVE_SESSIONS,
  SPRINT_SCHEDULE_DAYS,
  buildTimeZoneOptions,
  getSessionTimeRange,
  getTimeZoneLabel,
  resolveDefaultTimeZone,
  resolveSprintStartIso,
} from "@/lib/sprint-schedule";
import { formatISTDate } from "@/lib/sprint-format";
import { SPRINT_CONFIG } from "@/lib/constants";
import { Calendar, Globe } from "lucide-react";
import { SprintSeatMap } from "@/components/sprint/SprintSeatMap";
import { cn } from "@/lib/utils";

interface SprintLiveScheduleProps {
  startDate?: string;
  className?: string;
}

export function SprintLiveSchedule({
  startDate,
  className,
}: SprintLiveScheduleProps) {
  const selectId = useId();
  const cohortStartIso = resolveSprintStartIso(startDate);
  const startLabel = formatISTDate(cohortStartIso);
  const daysLabel = SPRINT_SCHEDULE_DAYS.join(" & ");

  const [browserTimeZone, setBrowserTimeZone] = useState<string | undefined>();
  const [selectedTimeZone, setSelectedTimeZone] = useState("Asia/Kolkata");

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setBrowserTimeZone(tz);
    setSelectedTimeZone(resolveDefaultTimeZone(tz));
  }, []);

  const timeZoneOptions = useMemo(
    () => buildTimeZoneOptions(browserTimeZone),
    [browserTimeZone]
  );

  const selectedLabel = getTimeZoneLabel(selectedTimeZone, timeZoneOptions);

  return (
    <section
      id="live-schedule"
      className={cn(
        "scroll-mt-20 px-6 py-14 border-y border-border/50 bg-surface/20",
        className
      )}
      aria-labelledby="live-schedule-heading"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-3">
            <Calendar className="w-4 h-4" aria-hidden />
            Live class schedule
          </div>
          <h2
            id="live-schedule-heading"
            className="text-2xl md:text-3xl font-bold text-foreground mb-2"
          >
            Every {daysLabel} — two live sessions
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto">
            Cohort 1 kicks off {startLabel}. Classes run live on Zoom every
            weekend — morning and evening slots in IST. Pick your timezone to
            see local times.
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-foreground"
          >
            Show times in
          </label>
          <div className="relative sm:min-w-[220px]">
            <Globe
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <select
              id={selectId}
              value={selectedTimeZone}
              onChange={(event) => setSelectedTimeZone(event.target.value)}
              className={cn(
                "w-full appearance-none rounded-lg border border-border bg-surface py-2.5 pl-10 pr-10 text-sm text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              )}
            >
              {timeZoneOptions.map((zone) => (
                <option key={zone.timeZone} value={zone.timeZone}>
                  {zone.label}
                  {zone.label === "Local" ? ` (${zone.timeZone})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-foreground"
                >
                  Session
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-accent" aria-hidden />
                    {selectedLabel}
                  </span>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-muted whitespace-nowrap"
                >
                  IST (anchor)
                </th>
              </tr>
            </thead>
            <tbody>
              {SPRINT_LIVE_SESSIONS.map((session, index) => (
                <tr
                  key={session.id}
                  className={
                    index < SPRINT_LIVE_SESSIONS.length - 1
                      ? "border-b border-border/70"
                      : undefined
                  }
                >
                  <td className="px-4 py-4 align-top">
                    <div className="font-medium text-foreground">
                      {session.label}
                    </div>
                    <div className="mt-1 text-xs text-muted">{daysLabel}</div>
                  </td>
                  <td className="px-4 py-4 align-top text-foreground whitespace-nowrap font-medium">
                    {getSessionTimeRange(
                      cohortStartIso,
                      session.startOffsetMinutes,
                      session.endOffsetMinutes,
                      selectedTimeZone
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-muted whitespace-nowrap">
                    {session.istRange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SprintSeatMap
          filled={SPRINT_CONFIG.bookedSeatNames.length}
          total={SPRINT_CONFIG.seatsTotal}
          bookedNames={SPRINT_CONFIG.bookedSeatNames}
          className="mt-8"
        />

        <p className="mt-4 text-center text-xs text-muted">
          PST / EST / CET reflect daylight saving for August 2026. Zoom links are
          shared in the UpSkill-Cohort-01 WhatsApp group after enrollment.
        </p>
      </div>
    </section>
  );
}
