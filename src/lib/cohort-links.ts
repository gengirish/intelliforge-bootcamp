import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Class access links live in env vars, not source: this repo is public, so a
 * link committed here is a link anyone can join with.
 */
export type CohortLinkEnvVar =
  | "ZOOM_JOIN_URL"
  | "WHATSAPP_GROUP_INVITE_URL"
  | "SPRINT_WHATSAPP_INVITE_URL";

const ACCESS_DENIED_PATH = "/cohort-access";

function redirectTo(location: string | URL) {
  const response = NextResponse.redirect(location, 302);
  // The destination depends on who is asking, so it must never be shared.
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

/** Matches on either id because manually recorded payments may predate a Clerk account. */
async function hasPaidEnrollment(userId: string, verifiedEmails: string[]) {
  const where = {
    status: "PAID" as const,
    OR: [
      { userId },
      ...verifiedEmails.map((email) => ({
        email: { equals: email, mode: "insensitive" as const },
      })),
    ],
  };

  const [sprint, bootcamp] = await Promise.all([
    prisma.sprintEnrollment.count({ where }),
    prisma.bootcampEnrollment.count({ where }),
  ]);

  return sprint + bootcamp > 0;
}

/**
 * Sends a paid learner to a class link. Everyone else goes to sign-in or the
 * access page, and any failure denies access rather than revealing the link.
 */
export async function redirectToCohortLink(
  req: Request,
  envVar: CohortLinkEnvVar
) {
  const { pathname } = new URL(req.url);
  const signIn = new URL(
    `/sign-in?redirect_url=${encodeURIComponent(pathname)}`,
    req.url
  );
  const denied = new URL(ACCESS_DENIED_PATH, req.url);

  // Clerk isn't running under the E2E bypass, so tests see the signed-out path.
  if (process.env.E2E_BYPASS_CLERK === "1") return redirectTo(signIn);

  const { userId } = await auth();
  if (!userId) return redirectTo(signIn);

  try {
    const user = await currentUser();
    const verifiedEmails = (user?.emailAddresses ?? [])
      .filter((address) => address.verification?.status === "verified")
      .map((address) => address.emailAddress);

    if (!(await hasPaidEnrollment(userId, verifiedEmails))) {
      return redirectTo(denied);
    }
  } catch (err) {
    console.error("[Cohort links] Enrolment check failed:", err);
    return redirectTo(denied);
  }

  const link = process.env[envVar];
  if (!link?.startsWith("https://")) {
    console.error(`[Cohort links] ${envVar} is not set to an https URL`);
    return redirectTo(denied);
  }

  return redirectTo(link);
}
