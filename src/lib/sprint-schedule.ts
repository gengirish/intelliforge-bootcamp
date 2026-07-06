export const SPRINT_SCHEDULE_DAYS = ["Saturday", "Sunday"] as const;

export const SPRINT_LIVE_SESSIONS = [
  {
    id: "morning",
    label: "Morning live class",
    istRange: "9:00 AM – 11:00 AM",
    /** Minutes from cohort kickoff (9:00 AM IST on Day 1). */
    startOffsetMinutes: 0,
    endOffsetMinutes: 120,
  },
  {
    id: "evening",
    label: "Evening live class",
    istRange: "8:00 PM – 10:00 PM",
    startOffsetMinutes: 11 * 60,
    endOffsetMinutes: 11 * 60 + 120,
  },
] as const;

export type SprintTimeZoneOption = {
  label: string;
  timeZone: string;
};

export const SPRINT_TIME_ZONES: readonly SprintTimeZoneOption[] = [
  { label: "IST", timeZone: "Asia/Kolkata" },
  { label: "PST", timeZone: "America/Los_Angeles" },
  { label: "EST", timeZone: "America/New_York" },
  { label: "CET", timeZone: "Europe/Paris" },
  { label: "GMT", timeZone: "Europe/London" },
  { label: "SGT", timeZone: "Asia/Singapore" },
  { label: "GST", timeZone: "Asia/Dubai" },
] as const;

/** First live session: Saturday 9:00 AM IST */
export const DEFAULT_SPRINT_START_ISO = "2026-08-01T03:30:00.000Z";

export function resolveSprintStartIso(startDate?: string): string {
  return startDate?.trim() ? startDate : DEFAULT_SPRINT_START_ISO;
}

export function findTimeZoneOption(
  timeZone: string,
  options: readonly SprintTimeZoneOption[] = SPRINT_TIME_ZONES
): SprintTimeZoneOption | undefined {
  return options.find((zone) => zone.timeZone === timeZone);
}

/** Pick a default zone from the browser IANA id, falling back to IST. */
export function resolveDefaultTimeZone(
  browserTimeZone?: string,
  options: readonly SprintTimeZoneOption[] = SPRINT_TIME_ZONES
): string {
  if (!browserTimeZone) return "Asia/Kolkata";
  return findTimeZoneOption(browserTimeZone, options)?.timeZone ?? "Asia/Kolkata";
}

/** Build select options, adding a Local entry when the browser zone is not listed. */
export function buildTimeZoneOptions(
  browserTimeZone?: string
): SprintTimeZoneOption[] {
  if (
    !browserTimeZone ||
    findTimeZoneOption(browserTimeZone, SPRINT_TIME_ZONES)
  ) {
    return [...SPRINT_TIME_ZONES];
  }

  return [{ label: "Local", timeZone: browserTimeZone }, ...SPRINT_TIME_ZONES];
}

export function getSessionTimeRange(
  cohortStartIso: string,
  startOffsetMinutes: number,
  endOffsetMinutes: number,
  timeZone: string
): string {
  const base = new Date(cohortStartIso);
  const start = new Date(base.getTime() + startOffsetMinutes * 60_000);
  const end = new Date(base.getTime() + endOffsetMinutes * 60_000);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

export function getTimeZoneLabel(
  timeZone: string,
  options: readonly SprintTimeZoneOption[]
): string {
  return findTimeZoneOption(timeZone, options)?.label ?? timeZone;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function getCountdownParts(
  targetIso: string,
  now = Date.now()
): CountdownParts {
  const target = new Date(targetIso).getTime();
  const isPast = now >= target;
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    isPast,
  };
}

export function padCountdownUnit(value: number): string {
  return String(value).padStart(2, "0");
}
