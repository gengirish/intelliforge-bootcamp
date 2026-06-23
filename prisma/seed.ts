import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.sprint.upsert({
    where: { slug: "ai-sprint-jun-2026" },
    create: {
      slug: "ai-sprint-jun-2026",
      title: "2-Week AI Sprint — Cohort 1",
      description:
        "Ship your first AI product in 14 days. Claude API chatbot + RAG system deployed to Vercel.",
      priceInPaise: 499900,
      originalPriceInPaise: 1299900,
      startDate: new Date("2026-08-01T03:30:00.000Z"),
      endDate: new Date("2026-08-15T03:30:00.000Z"),
      seatsTotal: 30,
      seatsFilled: 0,
      isActive: true,
    },
    update: {
      isActive: true,
      startDate: new Date("2026-08-01T03:30:00.000Z"),
      endDate: new Date("2026-08-15T03:30:00.000Z"),
    },
  });
  console.log("Sprint seeded.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
