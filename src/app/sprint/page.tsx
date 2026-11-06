import { prisma } from "@/lib/prisma";
import { SPRINT_CONFIG, SPRINT_PRICE_IN_PAISE } from "@/lib/constants";
import { getSprintSeatCounts } from "@/lib/sprint-seats";
import { SprintLandingClient } from "@/components/sprint/SprintLandingClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2-Week AI Sprint — Ship Live in 14 Days · IntelliForge AI",
  description:
    "Your team shipped an AI demo. You didn't. Fix that in 14 days — Claude chatbot + RAG system deployed to Vercel. ₹4,999 · Sprint 1 of 6, Cohort 2.",
  openGraph: {
    title: "Your Team Shipped an AI Demo. You Didn't.",
    description:
      "Two live AI products in 14 days. Not courses — deployed code you can show in your next interview.",
    images: ["/og-sprint.png"],
  },
};

export const revalidate = 30;

export default async function SprintPage() {
  let sprint = null;
  let seatCounts = null;

  try {
    [sprint, seatCounts] = await Promise.all([
      prisma.sprint.findUnique({
        where: { slug: SPRINT_CONFIG.slug },
        select: {
          priceInPaise: true,
          startDate: true,
          isActive: true,
        },
      }),
      getSprintSeatCounts(SPRINT_CONFIG.slug),
    ]);
  } catch {
    // DB unavailable at build time — use defaults
  }

  const rawSeats = seatCounts ?? {
    total: 30,
    filled: 0,
    remaining: 30,
    isActive: sprint?.isActive ?? false,
  };

  return (
    <SprintLandingClient
      remaining={rawSeats.remaining}
      seatsFilled={rawSeats.filled}
      seatsTotal={rawSeats.total}
      priceInPaise={sprint?.priceInPaise ?? SPRINT_PRICE_IN_PAISE}
      startDate={sprint?.startDate?.toISOString() ?? ""}
      isActive={seatCounts?.isActive ?? sprint?.isActive ?? false}
    />
  );
}
