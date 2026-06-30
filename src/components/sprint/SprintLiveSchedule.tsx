import {
  SPRINT_LIVE_SESSIONS,
  SPRINT_SCHEDULE_DAYS,
  SPRINT_TIME_ZONES,
  getSessionTimeRange,
  resolveSprintStartIso,
} from "@/lib/sprint-schedule";
import { formatISTDate } from "@/lib/sprint-format";
import { Calendar, Globe } from "lucide-react";

interface SprintLiveScheduleProps {
  startDate?: string;
}

export function SprintLiveSchedule({ startDate }: SprintLiveScheduleProps) {
  const cohortStartIso = resolveSprintStartIso(startDate);
  const startLabel = formatISTDate(cohortStartIso);
  const daysLabel = SPRINT_SCHEDULE_DAYS.join(" & ");

  return (
    <section className="px-6 py-14 border-y border-border/50 bg-surface/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-3">
            <Calendar className="w-4 h-4" />
            Live class schedule
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Every {daysLabel} — two live sessions
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto">
            Cohort 1 kicks off {startLabel}. Classes run live on Zoom every weekend
            — morning and evening slots in IST, with PST, EST, and CET shown below.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Session
                </th>
                {SPRINT_TIME_ZONES.map((zone) => (
                  <th
                    key={zone.label}
                    className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {zone.label === "IST" ? (
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-muted" />
                      )}
                      {zone.label}
                    </span>
                  </th>
                ))}
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
                  {SPRINT_TIME_ZONES.map((zone) => (
                    <td
                      key={zone.label}
                      className="px-4 py-4 align-top text-foreground whitespace-nowrap"
                    >
                      {getSessionTimeRange(
                        cohortStartIso,
                        session.startOffsetMinutes,
                        session.endOffsetMinutes,
                        zone.timeZone
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          PST / EST / CET reflect daylight saving for August 2026. Zoom links are
          shared in the UpSkill-Cohort-01 WhatsApp group after enrollment.
        </p>
      </div>
    </section>
  );
}
