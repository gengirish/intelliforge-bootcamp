import { SPRINT_CONFIG } from "../src/lib/constants";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Defaults to the sprint on sale. Set SPRINT_SLUG to work on another run. */
const SPRINT_SLUG = process.env.SPRINT_SLUG ?? SPRINT_CONFIG.slug;

async function main() {
  const rows = await prisma.sprintEnrollment.findMany({
    where: { sprint: { slug: SPRINT_SLUG } },
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
