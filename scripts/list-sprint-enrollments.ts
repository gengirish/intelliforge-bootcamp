import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.sprintEnrollment.findMany({
    where: { sprint: { slug: "ai-sprint-jun-2026" } },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      razorpayOrderId: true,
      razorpayPaymentId: true,
      paidAt: true,
      notes: true,
      enrolledAt: true,
    },
    orderBy: { enrolledAt: "asc" },
  });

  const paid = rows.filter((r) => r.status === "PAID").length;

  console.log(JSON.stringify({ paid, enrollments: rows }, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
