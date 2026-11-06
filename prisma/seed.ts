import { PrismaClient } from "@prisma/client";
import {
  COHORT_1_SPRINT_SLUG,
  COHORT_2_SPRINTS,
  SPRINT_CONFIG,
  SPRINT_PRICE_IN_PAISE,
} from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  // Close Cohort 1 to new orders. Its row stays so past enrolments keep their sprint.
  await prisma.sprint.updateMany({
    where: { slug: COHORT_1_SPRINT_SLUG },
    data: { isActive: false },
  });

  for (const sprint of COHORT_2_SPRINTS) {
    const details = {
      title: `Sprint ${sprint.number} of 6: ${sprint.title} — Cohort 2`,
      description: sprint.ships,
      priceInPaise: SPRINT_PRICE_IN_PAISE,
      originalPriceInPaise: SPRINT_PRICE_IN_PAISE,
      startDate: new Date(sprint.startIso),
      endDate: new Date(sprint.endIso),
    };

    // isActive puts a sprint on sale and is set by hand as each one opens, so
    // re-seeding must not change it on a row that already exists.
    await prisma.sprint.upsert({
      where: { slug: sprint.slug },
      create: {
        ...details,
        slug: sprint.slug,
        seatsTotal: SPRINT_CONFIG.seatsTotal,
        isActive: sprint.slug === SPRINT_CONFIG.slug,
      },
      update: details,
    });
  }
  console.log(`Seeded ${COHORT_2_SPRINTS.length} Cohort 2 sprints.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
