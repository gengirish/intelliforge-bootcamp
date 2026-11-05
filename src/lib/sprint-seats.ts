import { prisma } from "@/lib/prisma";

export interface SprintSeatCounts {
  total: number;
  filled: number;
  remaining: number;
  isActive: boolean;
}

export async function getSprintSeatCounts(
  slug: string
): Promise<SprintSeatCounts | null> {
  const sprint = await prisma.sprint.findUnique({
    where: { slug },
    select: { id: true, seatsTotal: true, seatsFilled: true, isActive: true },
  });

  if (!sprint) return null;

  const filled = await prisma.sprintEnrollment.count({
    where: { sprintId: sprint.id, status: "PAID" },
  });

  if (filled !== sprint.seatsFilled) {
    await prisma.sprint.update({
      where: { id: sprint.id },
      data: { seatsFilled: filled },
    });
  }

  return {
    total: sprint.seatsTotal,
    filled,
    remaining: Math.max(0, sprint.seatsTotal - filled),
    isActive: sprint.isActive,
  };
}
