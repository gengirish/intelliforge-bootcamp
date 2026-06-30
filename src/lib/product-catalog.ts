export const PRODUCTS = {
  bootcamp: {
    slug: "bootcamp-2026-q3",
    lmsCourseSlugs: [
      "ai-product-engineering-intensive",
      "fresher-prerequisite-setup",
    ],
    plans: { earlyBird: 4999900, regular: 7499900 },
  },
  sprint: {
    slug: "ai-sprint-jun-2026",
    lmsCourseSlugs: ["ai-for-beginners"],
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
