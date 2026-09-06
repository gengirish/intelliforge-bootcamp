/**
 * The published CCAR-F practice bank.
 *
 * Every item is IntelliForge-authored from the public exam blueprint and the Claude
 * documentation. Nothing here is transcribed or paraphrased from Anthropic's exam
 * guide or from any third-party practice bank.
 *
 * The invariants below run at module load. A malformed bank fails the build rather
 * than shipping an exam that cannot be scored.
 */

import { LETTERS, type DomainId, type Question } from "../types";
import { DOMAIN_1 } from "./domain-1";
import { DOMAIN_2 } from "./domain-2";
import { DOMAIN_3 } from "./domain-3";
import { DOMAIN_4 } from "./domain-4";
import { DOMAIN_5 } from "./domain-5";

export const QUESTIONS: Question[] = [
  ...DOMAIN_1,
  ...DOMAIN_2,
  ...DOMAIN_3,
  ...DOMAIN_4,
  ...DOMAIN_5,
];

function assertBankIsValid(questions: readonly Question[]): void {
  const seen = new Set<string>();

  for (const q of questions) {
    if (seen.has(q.id)) throw new Error(`CCAR-F bank: duplicate question id ${q.id}`);
    seen.add(q.id);

    const optionLetters = Object.keys(q.options);
    if (optionLetters.length !== LETTERS.length) {
      throw new Error(`CCAR-F bank: ${q.id} has ${optionLetters.length} options, expected 4`);
    }
    for (const letter of LETTERS) {
      if (!q.options[letter]?.trim()) {
        throw new Error(`CCAR-F bank: ${q.id} is missing option ${letter}`);
      }
    }
    if (!LETTERS.includes(q.answer)) {
      throw new Error(`CCAR-F bank: ${q.id} has answer ${q.answer}, which is not A-D`);
    }
    if (!q.explanation.trim()) {
      throw new Error(`CCAR-F bank: ${q.id} has no explanation`);
    }
    if (q.answer in q.distractors) {
      throw new Error(`CCAR-F bank: ${q.id} lists its correct answer ${q.answer} as a distractor`);
    }
    if (!/^https:\/\//.test(q.docUrl)) {
      throw new Error(`CCAR-F bank: ${q.id} has no documentation link`);
    }
  }
}

assertBankIsValid(QUESTIONS);

export const QUESTIONS_BY_ID: Readonly<Record<string, Question>> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q])
);

export function questionsForDomain(domain: DomainId): Question[] {
  return QUESTIONS.filter((q) => q.domain === domain);
}

/** How many questions each domain currently contributes. Used by the review page. */
export function bankCounts(): Record<DomainId, number> {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<DomainId, number>;
  for (const q of QUESTIONS) counts[q.domain] += 1;
  return counts;
}
