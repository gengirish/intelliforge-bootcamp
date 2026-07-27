import { NextResponse } from "next/server";
import { z } from "zod";
import type { ApiResponse } from "@/lib/api-response";
import { confirmSprintPayment } from "@/lib/sprint-payment";

const schema = z.object({
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  signature: z.string().optional(),
});

export async function POST(req: Request) {
  // A malformed body is the caller's mistake, not a 500 on our side.
  const raw = await req.json().catch(() => null);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Invalid input" },
      { status: 400 }
    );
  }

  const { orderId, paymentId, signature } = parsed.data;
  const result = await confirmSprintPayment(orderId, paymentId, signature);

  if (!result.ok) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: result.error },
      { status: 400 }
    );
  }

  return NextResponse.json<ApiResponse<{ confirmed: boolean }>>({
    success: true,
    data: { confirmed: !result.alreadyPaid },
  });
}
