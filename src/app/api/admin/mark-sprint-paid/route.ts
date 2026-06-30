import { NextResponse } from "next/server";
import { z } from "zod";
import { markSprintEnrollmentPaidManually } from "@/lib/sprint-payment";
import { getSprintSeatCounts } from "@/lib/sprint-seats";

function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  const adminSecret = process.env.ADMIN_SECRET;
  if (adminSecret && token === adminSecret) return true;
  return false;
}

const schema = z.object({
  enrollmentId: z.string().min(1),
  note: z.string().optional(),
});

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const result = await markSprintEnrollmentPaidManually(
    parsed.data.enrollmentId,
    parsed.data.note ?? "Manual payment"
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const seats = await getSprintSeatCounts("ai-sprint-jun-2026");

  return NextResponse.json({
    ok: true,
    alreadyPaid: result.alreadyPaid ?? false,
    seats,
  });
}
