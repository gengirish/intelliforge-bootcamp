import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { normalizeProvider, type TestimonialProvider } from "@/lib/testimonials";

/** Media needs a Vercel Blob store connected to the project. */
export function isTestimonialMediaConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export interface VerifiedAccount {
  provider: TestimonialProvider;
  name: string;
  avatarUrl: string | null;
  email: string | null;
}

export interface SubmitterIdentity {
  userId: string;
  /** Google and LinkedIn accounts on this Clerk user whose OAuth verification passed. */
  accounts: VerifiedAccount[];
  verifiedEmails: string[];
}

/**
 * Reads identity from Clerk on the server. Names and photos come only from a
 * verified Google or LinkedIn account, never from what the browser sends.
 */
export async function getSubmitterIdentity(): Promise<SubmitterIdentity | null> {
  const user = await currentUser();
  if (!user) return null;

  const accounts: VerifiedAccount[] = [];
  for (const account of user.externalAccounts ?? []) {
    const provider = normalizeProvider(account.provider);
    if (!provider || account.verification?.status !== "verified") continue;
    const name =
      [account.firstName, account.lastName].filter(Boolean).join(" ").trim() ||
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    if (!name) continue;
    accounts.push({
      provider,
      name,
      avatarUrl: account.imageUrl || user.imageUrl || null,
      email: account.emailAddress || null,
    });
  }
  // LinkedIn first: it is the professional identity readers will look for.
  accounts.sort((a, b) => (a.provider === "linkedin" ? -1 : 0) - (b.provider === "linkedin" ? -1 : 0));

  const verifiedEmails = (user.emailAddresses ?? [])
    .filter((e) => e.verification?.status === "verified")
    .map((e) => e.emailAddress);

  return { userId: user.id, accounts, verifiedEmails };
}

/** Which paid sprints back this learner, matched on Clerk id or verified email. */
export async function findPaidPrograms(userId: string, emails: string[]): Promise<string[]> {
  const where = {
    status: "PAID" as const,
    OR: [
      { userId },
      ...emails.map((email) => ({ email: { equals: email, mode: "insensitive" as const } })),
    ],
  };
  const [sprints, bootcamp] = await Promise.all([
    prisma.sprintEnrollment.findMany({
      where,
      select: { sprint: { select: { title: true, startDate: true } } },
    }),
    prisma.bootcampEnrollment.count({ where }),
  ]);

  const titles = [...new Map(
    sprints
      .sort((a, b) => a.sprint.startDate.getTime() - b.sprint.startDate.getTime())
      .map((s) => [s.sprint.title, s.sprint.title])
  ).values()];
  if (bootcamp > 0) titles.unshift("12-week Bootcamp");
  return titles;
}

export type PublicTestimonial = Awaited<ReturnType<typeof getApprovedTestimonials>>[number];

/**
 * Approved testimonials for public pages. Selects only public fields (no email),
 * and returns [] if the database is unreachable so a page never fails on it.
 */
export async function getApprovedTestimonials(opts: { limit?: number; featuredFirst?: boolean } = {}) {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await prisma.testimonial.findMany({
      where: { status: "APPROVED" },
      orderBy: [
        ...(opts.featuredFirst ? [{ featured: "desc" as const }] : []),
        { reviewedAt: "desc" as const },
      ],
      take: opts.limit,
      select: {
        id: true,
        provider: true,
        name: true,
        avatarUrl: true,
        headline: true,
        linkedinUrl: true,
        quote: true,
        mediaKind: true,
        mediaUrl: true,
        mediaContentType: true,
        transcript: true,
        verifiedLearner: true,
        learnerSprints: true,
        featured: true,
      },
    });
  } catch (err) {
    console.error("[Testimonials] Failed to load approved testimonials:", err);
    return [];
  }
}
