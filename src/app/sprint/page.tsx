import { prisma } from "@/lib/prisma";
import { SprintLandingClient } from "@/components/sprint/SprintLandingClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2-Week AI Sprint — ₹4,999 · IntelliForge AI",
  description:
    "Ship your first AI product in 14 days. Claude API + RAG system deployed. ₹4,999 · Zero-risk guarantee.",
  openGraph: {
    title: "2-Week AI Sprint — ₹4,999",
    description: "Ship real AI projects in 14 days. Not notes. Deployed code.",
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
