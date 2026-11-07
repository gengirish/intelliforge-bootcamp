import "server-only";
import type { Prisma } from "@prisma/client";
import { COHORT_2 } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export type WaitlistFilters = { cohort: string; q: string; motivation: string };

export function parseWaitlistFilters(
  get: (key: string) => string | null | undefined
): WaitlistFilters {
  return {
    cohort: get("cohort") || COHORT_2.slug,
    q: get("q")?.trim() ?? "",
    motivation: get("motivation") ?? "",
  };
}

export function waitlistWhere({
  cohort,
  q,
  motivation,
}: WaitlistFilters): Prisma.WaitlistEntryWhereInput {
  return {
    cohort,
    ...(motivation ? { motivation } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
          ],
        }
      : {}),
  };
}

export async function findWaitlistEntries(filters: WaitlistFilters, take?: number) {
  return prisma.waitlistEntry.findMany({
    where: waitlistWhere(filters),
    orderBy: { createdAt: "desc" },
    ...(take ? { take } : {}),
  });
}

export async function getWaitlistStats(cohort: string) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [total, last7Days, grouped] = await Promise.all([
    prisma.waitlistEntry.count({ where: { cohort } }),
    prisma.waitlistEntry.count({ where: { cohort, createdAt: { gte: weekAgo } } }),
    prisma.waitlistEntry.groupBy({
      by: ["motivation"],
      where: { cohort },
      _count: { _all: true },
    }),
  ]);
  const byMotivation = Object.fromEntries(
    grouped.map((g) => [g.motivation, g._count._all])
  ) as Record<string, number>;
  return { total, last7Days, byMotivation };
}
