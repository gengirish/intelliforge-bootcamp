import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Defaults to Cohort 2 Sprint 1. Set SPRINT_SLUG to check another run. */
const SPRINT_SLUG = process.env.SPRINT_SLUG ?? "ai-sprint-c2-s1";

async function main() {
  const enrollments = await prisma.sprintEnrollment.findMany({
    where: { sprint: { slug: SPRINT_SLUG } },
    select: {
      status: true,
      email: true,
      name: true,
      enrolledAt: true,
      paidAt: true,
    },
    orderBy: { enrolledAt: "asc" },
  });

  const paid = enrollments.filter((e) => e.status === "PAID");
  const pending = enrollments.filter((e) => e.status === "PENDING");

  const sprint = await prisma.sprint.findUnique({
    where: { slug: SPRINT_SLUG },
    select: { seatsTotal: true, seatsFilled: true },
  });

  console.log(
    JSON.stringify(
      {
        seatsTotal: sprint?.seatsTotal,
        seatsFilledInDb: sprint?.seatsFilled,
        paidCount: paid.length,
        pendingCount: pending.length,
        paid,
        pending: pending.map((p) => ({
          email: p.email,
          name: p.name,
          enrolledAt: p.enrolledAt,
        })),
      },
      null,
      2
    )
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
