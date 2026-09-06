/**
 * Types for the CCAR-F practice bank and mock-exam engine.
 *
 * Every question published through these types is IntelliForge-authored from the
 * exam blueprint and the public Claude documentation. Nothing here is copied from
 * Anthropic's exam guide or from any third-party practice bank.
 */

/** The five exam domains, numbered as the official blueprint numbers them. */
export type DomainId = 1 | 2 | 3 | 4 | 5;

/** The eight recurring exam scenarios. */
export type ScenarioId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Option labels. The exam is single-answer, one correct of four. */
export type Letter = "A" | "B" | "C" | "D";

export const LETTERS: readonly Letter[] = ["A", "B", "C", "D"] as const;

export interface Question {
  /** Stable, unique. Convention: `D<domain>-Q<nn>`, e.g. `D1-Q07`. */
  id: string;
  domain: DomainId;
  /** Blueprint task statement this item tests, e.g. `"1.2"`. */
  task: string;
  scenario: ScenarioId;
  /** The question text. Supports `code`, **bold** and *italic* inline markup. */
  stem: string;
  options: Record<Letter, string>;
  answer: Letter;
  /** Why the correct answer is correct. */
  explanation: string;
  /** Why each wrong option is wrong, keyed by its original letter. */
  distractors: Partial<Record<Letter, string>>;
  /** The Claude documentation page that teaches this concept. */
  docUrl: string;
}

export interface Domain {
  id: DomainId;
  title: string;
  /** Percentage of the exam, per the official blueprint. */
  weight: number;
  summary: string;
}

export interface Scenario {
  id: ScenarioId;
  title: string;
  summary: string;
}

export type QuizMode = "exam" | "practice";

/**
 * One question as it appears in a running attempt. `order` is this attempt's
 * shuffled option order: position i renders as letter LETTERS[i] but carries the
 * question's original letter `order[i]`, so answers stay comparable to `answer`.
 */
export interface SessionItem {
  id: string;
  order: Letter[];
}

export interface QuizSession {
  mode: QuizMode;
  /** Human label for the attempt, e.g. `"Practice · Tool Design & MCP Integration"`. */
  label: string;
  items: SessionItem[];
  /** Index into `items` of the question on screen. */
  idx: number;
  /** questionId -> the original letter the candidate chose. */
  answers: Record<string, Letter | undefined>;
  /** questionId -> flagged for review. Exam mode only. */
  flags: Record<string, boolean | undefined>;
  /** Epoch ms when a timed attempt expires. `null` in practice mode. */
  endsAt: number | null;
  submitted: boolean;
}

export interface DomainScore {
  domain: DomainId;
  correct: number;
  total: number;
  percent: number;
}

export interface Result {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  byDomain: DomainScore[];
}
