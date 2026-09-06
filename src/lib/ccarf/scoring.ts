/**
 * Pure helpers for the mock-exam engine: shuffling, session construction, and
 * grading. Kept free of React and of `window` so they can be exercised directly.
 */

import { DOMAINS, EXAM } from "./blueprint";
import {
  LETTERS,
  type DomainId,
  type DomainScore,
  type Letter,
  type Question,
  type QuizMode,
  type QuizSession,
  type Result,
  type SessionItem,
} from "./types";

/** Fisher–Yates. Returns a new array; the input is untouched. */
export function shuffle<T>(input: readonly T[]): T[] {
  const out = input.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Give each question its own shuffled option order for this attempt. */
export function toSessionItems(questions: readonly Question[]): SessionItem[] {
  return questions.map((q) => ({ id: q.id, order: shuffle(LETTERS) }));
}

/**
 * The letter a given original option is displayed as in this attempt.
 * `order[i] === original` means it is rendered in position i, i.e. as LETTERS[i].
 */
export function displayLetter(item: SessionItem, original: Letter): Letter {
  const i = item.order.indexOf(original);
  return i >= 0 ? LETTERS[i] : original;
}

/**
 * Pick one attempt's worth of questions, weighted like the blueprint so a mock
 * mirrors the real domain mix rather than the bank's current shape.
 *
 * Domains short of their quota contribute what they have; the shortfall is
 * redistributed across the rest so an attempt is always `count` long when the bank
 * is big enough overall.
 */
export function pickExamSet(questions: readonly Question[], count: number): Question[] {
  const pools = new Map<DomainId, Question[]>(
    DOMAINS.map((d) => [d.id, shuffle(questions.filter((q) => q.domain === d.id))])
  );

  const picked: Question[] = [];
  for (const domain of DOMAINS) {
    const pool = pools.get(domain.id) ?? [];
    const quota = Math.min(pool.length, Math.round((domain.weight / 100) * count));
    picked.push(...pool.splice(0, quota));
  }

  // Top up from whatever is left over, in case of rounding or a thin domain.
  const leftovers = shuffle([...pools.values()].flat());
  picked.push(...leftovers.slice(0, Math.max(0, count - picked.length)));

  return shuffle(picked).slice(0, count);
}

export function createSession(
  mode: QuizMode,
  label: string,
  questions: readonly Question[]
): QuizSession {
  return {
    mode,
    label,
    items: toSessionItems(shuffle(questions)),
    idx: 0,
    answers: {},
    flags: {},
    endsAt: mode === "exam" ? Date.now() + EXAM.examMinutes * 60_000 : null,
    submitted: false,
  };
}

export function grade(
  session: QuizSession,
  byId: Readonly<Record<string, Question>>
): Result {
  const tally = new Map<DomainId, { correct: number; total: number }>();
  let correct = 0;

  for (const item of session.items) {
    const q = byId[item.id];
    if (!q) continue;
    const row = tally.get(q.domain) ?? { correct: 0, total: 0 };
    row.total += 1;
    if (session.answers[item.id] === q.answer) {
      row.correct += 1;
      correct += 1;
    }
    tally.set(q.domain, row);
  }

  const total = session.items.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);

  const byDomain: DomainScore[] = [...tally.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([domain, { correct: c, total: t }]) => ({
      domain,
      correct: c,
      total: t,
      percent: t === 0 ? 0 : Math.round((c / t) * 100),
    }));

  return { correct, total, percent, passed: percent >= EXAM.passPercent, byDomain };
}

/** `mm:ss`, or `h:mm:ss` past an hour. Never negative. */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}
