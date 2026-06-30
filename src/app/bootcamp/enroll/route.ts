import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/api-response";
import { PRODUCTS } from "@/lib/product-catalog";

const schema = z.object({
  plan: z.enum(["earlyBird", "regular"]),
});

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return null;
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/** Razorpay receipt max length is 40. */
function createBootcampReceipt() {
  return `bc_${Date.now().toString(36)}`;
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

  const { plan } = parsed.data;
  const user =
    process.env.E2E_BYPASS_CLERK === "1" ? null : await currentUser();

  const existing = await prisma.bootcampEnrollment.findFirst({
    where: { userId, status: "PAID" },
  });
  if (existing) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Already enrolled in the bootcamp" },
      { status: 400 }
    );
  }

  const amountInPaise = PRODUCTS.bootcamp.plans[plan];
  const rzp = getRazorpay();
  if (!rzp) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Payment provider not configured" },
      { status: 500 }
    );
  }

  try {
    const order = await rzp.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: createBootcampReceipt(),
      notes: {
        plan,
        userId,
        bootcampSlug: PRODUCTS.bootcamp.slug,
      },
    });

    await prisma.bootcampEnrollment.create({
      data: {
        userId,
        email: user?.emailAddresses[0]?.emailAddress ?? "",
        name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
        phone: user?.phoneNumbers[0]?.phoneNumber ?? null,
        plan,
        razorpayOrderId: order.id,
        amountInPaise,
        status: "PENDING",
      },
    });

    return NextResponse.json<
      ApiResponse<{ orderId: string; amount: number; currency: string }>
    >({
      success: true,
      data: {
        orderId: order.id,
        amount: amountInPaise,
        currency: "INR",
      },
    });
  } catch (err) {
    console.error("[Bootcamp enroll] Order creation failed:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
