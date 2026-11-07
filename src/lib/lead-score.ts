/**
 * Scores a waitlist lead 0–100 against the Cohort 2 ICP: working tech
 * professionals in India, roughly 5–15 years in, paying for themselves to use
 * AI in their current job (secondary: the same people preparing a job move).
 *
 * Weights: role 35, experience 30, motivation 20, payer 15.
 * Tiers: A ≥ 75 (personal follow-up), B 50–74 (nurture), C < 50 (setup course).
 * Students are capped in C and non-engineering roles in B, whatever else they
 * answer, because neither has bought so far.
 */

export type LeadTier = "A" | "B" | "C";

export type LeadAnswers = {
  role?: string | null;
  experience?: string | null;
  payer?: string | null;
  motivation?: string | null;
};

export type LeadScore = { score: number; tier: LeadTier; reasons: string[] };

const ENGINEERING_ROLES = new Set([
  "software",
  "data-ml",
  "cloud-devops",
  "qa-security-infra",
  "eng-lead",
]);

const ROLE_POINTS = (role: string) =>
  ENGINEERING_ROLES.has(role) ? 35 : role === "non-engineering" ? 15 : 0;

const EXPERIENCE_POINTS: Record<string, number> = {
  "0-2": 5,
  "3-5": 20,
  "6-10": 30,
  "11-15": 30,
  "15+": 20,
};

const MOTIVATION_POINTS: Record<string, number> = {
  "ship-at-work": 20,
  "job-move": 14,
  "own-product": 10,
  other: 5,
};

const PAYER_POINTS: Record<string, number> = {
  self: 15,
  undecided: 8,
  employer: 5,
};

export function tierFor(score: number): LeadTier {
  return score >= 75 ? "A" : score >= 50 ? "B" : "C";
}

/** Returns null when the qualifying questions weren't answered (older signups). */
export function scoreLead(a: LeadAnswers): LeadScore | null {
  if (!a.role || !a.experience) return null;

  const role = ROLE_POINTS(a.role);
  const experience = EXPERIENCE_POINTS[a.experience] ?? 0;
  const motivation = MOTIVATION_POINTS[a.motivation ?? ""] ?? 0;
  const payer = PAYER_POINTS[a.payer ?? ""] ?? 0;

  let score = role + experience + motivation + payer;
  const reasons = [
    `role ${role}/35`,
    `experience ${experience}/30`,
    `motivation ${motivation}/20`,
    `payer ${payer}/15`,
  ];

  if (a.role === "student" && score > 49) {
    score = 49;
    reasons.push("capped at C: student");
  } else if (a.role === "non-engineering" && score > 74) {
    score = 74;
    reasons.push("capped at B: non-engineering role");
  }

  return { score, tier: tierFor(score), reasons };
}
