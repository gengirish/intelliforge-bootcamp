import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  retryLmsEnrollmentForBootcamp,
  retryLmsEnrollmentForSprint,
} from "@/lib/razorpay-webhook";

function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  const adminSecret = process.env.ADMIN_SECRET;
  const cronSecret = process.env.CRON_SECRET;

  if (adminSecret && token === adminSecret) return true;
  if (cronSecret && token === cronSecret) return true;
  return false;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [sprintEnrollments, bootcampEnrollments] = await Promise.all([
    prisma.sprintEnrollment.findMany({
      where: { status: "PAID", lmsEnrolledAt: null },
      include: { sprint: true },
    }),
    prisma.bootcampEnrollment.findMany({
      where: { status: "PAID", lmsEnrolledAt: null },
    }),
  ]);

  let retried = 0;

  for (const enrollment of sprintEnrollments) {
    await retryLmsEnrollmentForSprint(enrollment);
    retried++;
  }

  for (const enrollment of bootcampEnrollments) {
    await retryLmsEnrollmentForBootcamp(enrollment);
    retried++;
  }

  return NextResponse.json({ ok: true, retried });
}
