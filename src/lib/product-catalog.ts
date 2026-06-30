/** LMS course slugs on learning.intelliforge.tech — must match training-feedback content/*.ts */
export const LMS_COURSE = {
  /** IF-RES-2026-012 · https://learning.intelliforge.tech/courses/ai-upskill-12-week-roadmap */
  upskillRoadmap: "ai-upskill-12-week-roadmap",
} as const;

export const PRODUCTS = {
  bootcamp: {
    slug: "bootcamp-2026-q3",
    lmsCourseSlugs: [LMS_COURSE.upskillRoadmap],
    plans: { earlyBird: 4999900, regular: 7499900 },
  },
  sprint: {
    slug: "ai-sprint-jun-2026",
    lmsCourseSlugs: [LMS_COURSE.upskillRoadmap],
  },
} as const;

export function getLmsCourseSlugsForBootcamp(): string[] {
  return [...PRODUCTS.bootcamp.lmsCourseSlugs];
}

export function getLmsCourseSlugsForSprint(slug: string): string[] {
  if (slug === PRODUCTS.sprint.slug) {
    return [...PRODUCTS.sprint.lmsCourseSlugs];
  }
  return [];
}
