import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const enrollments = await prisma.sprintEnrollment.findMany({
    where: { sprint: { slug: "ai-sprint-jun-2026" } },
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
    where: { slug: "ai-sprint-jun-2026" },
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
