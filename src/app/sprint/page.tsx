import { prisma } from "@/lib/prisma";
import { SprintLandingClient } from "@/components/sprint/SprintLandingClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2-Week AI Sprint — Ship Live in 14 Days · IntelliForge AI",
  description:
    "Your team shipped an AI demo. You didn't. Fix that in 14 days — Claude chatbot + RAG system deployed to Vercel. ₹4,999 · Cohort 1.",
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
  try {
    sprint = await prisma.sprint.findUnique({
      where: { slug: "ai-sprint-jun-2026" },
      select: {
        seatsTotal: true,
        seatsFilled: true,
        priceInPaise: true,
        originalPriceInPaise: true,
        startDate: true,
        isActive: true,
      },
    });
  } catch {
    // DB unavailable at build time — use defaults
  }

  const remaining = sprint ? sprint.seatsTotal - sprint.seatsFilled : 30;

  return (
    <SprintLandingClient
      remaining={remaining}
      priceInPaise={sprint?.priceInPaise ?? 499900}
      originalPriceInPaise={sprint?.originalPriceInPaise ?? 1299900}
      startDate={sprint?.startDate?.toISOString() ?? ""}
      isActive={sprint?.isActive ?? false}
    />
  );
}
