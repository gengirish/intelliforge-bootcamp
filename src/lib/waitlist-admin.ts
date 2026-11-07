import "server-only";
import type { Prisma } from "@prisma/client";
import { COHORT_2 } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

/** "unscored" = joined before the qualifying questions existed. */
export const TIER_FILTERS = ["A", "B", "C", "unscored"] as const;
/** "direct" = no UTM tag and no external referrer. */
export const DIRECT_SOURCE = "direct";

export type WaitlistFilters = {
  cohort: string;
  q: string;
  motivation: string;
  tier: string;
  source: string;
  sort: "newest" | "score";
};

export function parseWaitlistFilters(
  get: (key: string) => string | null | undefined
): WaitlistFilters {
  return {
    cohort: get("cohort") || COHORT_2.slug,
    q: get("q")?.trim() ?? "",
    motivation: get("motivation") ?? "",
    tier: get("tier") ?? "",
    source: get("source") ?? "",
    sort: get("sort") === "score" ? "score" : "newest",
  };
}

/** A lead's source: its UTM source, else the site that referred it, else direct. */
export function leadSource(e: {
  utmSource: string | null;
  referrer: string | null;
}): string {
  return e.utmSource || e.referrer || DIRECT_SOURCE;
}

export function waitlistWhere({
  cohort,
  q,
  motivation,
  tier,
  source,
}: WaitlistFilters): Prisma.WaitlistEntryWhereInput {
  const and: Prisma.WaitlistEntryWhereInput[] = [];
  if (q) {
    and.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
      ],
    });
  }
  if (source === DIRECT_SOURCE) {
    and.push({ utmSource: null, referrer: null });
  } else if (source) {
    and.push({
      OR: [{ utmSource: source }, { utmSource: null, referrer: source }],
    });
  }
  return {
    cohort,
    ...(motivation ? { motivation } : {}),
    ...(tier === "unscored" ? { tier: null } : tier ? { tier } : {}),
    ...(and.length ? { AND: and } : {}),
  };
}

export async function findWaitlistEntries(filters: WaitlistFilters, take?: number) {
  return prisma.waitlistEntry.findMany({
    where: waitlistWhere(filters),
    orderBy:
      filters.sort === "score"
        ? [{ score: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }]
        : { createdAt: "desc" },
    ...(take ? { take } : {}),
  });
}

export async function getWaitlistStats(cohort: string) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [total, last7Days, byTierRows, sourceRows] = await Promise.all([
    prisma.waitlistEntry.count({ where: { cohort } }),
    prisma.waitlistEntry.count({ where: { cohort, createdAt: { gte: weekAgo } } }),
    prisma.waitlistEntry.groupBy({
      by: ["tier"],
      where: { cohort },
      _count: { _all: true },
    }),
    prisma.waitlistEntry.groupBy({
      by: ["utmSource", "referrer"],
      where: { cohort },
      _count: { _all: true },
    }),
  ]);

  const byTier: Record<string, number> = {};
  for (const r of byTierRows) byTier[r.tier ?? "unscored"] = r._count._all;

  const sourceCounts = new Map<string, number>();
  for (const r of sourceRows) {
    const s = leadSource(r);
    sourceCounts.set(s, (sourceCounts.get(s) ?? 0) + r._count._all);
  }
  const bySource = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1]);

  return { total, last7Days, byTier, bySource };
}
