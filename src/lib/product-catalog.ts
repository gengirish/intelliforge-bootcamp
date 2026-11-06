import { COHORT_1_SPRINT_SLUG, COHORT_2_SPRINTS } from "@/lib/constants";

/** LMS course slugs on learning.intelliforge.tech — must match training-feedback content/*.ts */
export const LMS_COURSE = {
  /** IF-RES-2026-012 · https://learning.intelliforge.tech/courses/ai-upskill-12-week-roadmap */
  upskillRoadmap: "ai-upskill-12-week-roadmap",
} as const;

export const PRODUCTS = {
  bootcamp: {
    slug: "bootcamp-2026-q3",
    lmsCourseSlugs: [LMS_COURSE.upskillRoadmap],
  },
  sprint: {
    slugs: [COHORT_1_SPRINT_SLUG, ...COHORT_2_SPRINTS.map((s) => s.slug)] as string[],
    /** One course: every sprint unlocks it. A sprint buys its live sessions and mentorship. */
    lmsCourseSlugs: [LMS_COURSE.upskillRoadmap],
  },
} as const;

export function getLmsCourseSlugsForBootcamp(): string[] {
  return [...PRODUCTS.bootcamp.lmsCourseSlugs];
}

export function getLmsCourseSlugsForSprint(slug: string): string[] {
  if (PRODUCTS.sprint.slugs.includes(slug)) {
    return [...PRODUCTS.sprint.lmsCourseSlugs];
  }
  return [];
}
