import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/api-response";

const schema = z.object({
  sprintSlug: z.string().default("ai-sprint-jun-2026"),
});

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return null;
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/** Razorpay receipt max length is 40; Clerk user IDs make longer strings fail validation. */
function createSprintReceipt() {
  return `spr_${Date.now().toString(36)}`;
}

export async function POST(req: Request) {
  const userId =
    process.env.E2E_BYPASS_CLERK === "1"
      ? null
      : (await auth()).userId;

  if (!userId) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Invalid input" },
      { status: 400 }
    );
  }

  const { sprintSlug } = parsed.data;
  const user =
    process.env.E2E_BYPASS_CLERK === "1" ? null : await currentUser();

  const sprint = await prisma.sprint.findFirst({
    where: { slug: sprintSlug, isActive: true },
  });
  if (!sprint) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Sprint not found or inactive" },
      { status: 404 }
    );
  }

  if (sprint.seatsFilled >= sprint.seatsTotal) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "No seats remaining" },
      { status: 400 }
    );
  }

  const existing = await prisma.sprintEnrollment.findFirst({
    where: { userId, sprintId: sprint.id, status: "PAID" },
  });
  if (existing) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Already enrolled in this sprint" },
      { status: 400 }
    );
  }

  const rzp = getRazorpay();
  if (!rzp) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Payment provider not configured" },
      { status: 500 }
    );
  }

  try {
    const order = await rzp.orders.create({
      amount: sprint.priceInPaise,
      currency: "INR",
      receipt: createSprintReceipt(),
      notes: { sprintId: sprint.id, userId, sprintSlug },
    });

    await prisma.sprintEnrollment.create({
      data: {
        sprintId: sprint.id,
        userId,
        email: user?.emailAddresses[0]?.emailAddress ?? "",
        name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
        phone: user?.phoneNumbers[0]?.phoneNumber ?? null,
        razorpayOrderId: order.id,
        amountInPaise: sprint.priceInPaise,
        status: "PENDING",
      },
    });

    return NextResponse.json<
      ApiResponse<{ orderId: string; amount: number; currency: string }>
    >({
      success: true,
      data: {
        orderId: order.id,
        amount: sprint.priceInPaise,
        currency: "INR",
      },
    });
  } catch (err) {
    console.error("[Sprint enroll] Order creation failed:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
