import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

type PlanType = "earlyBird" | "regular";

interface CreateOrderBody {
  plan: PlanType;
  receipt?: string;
}

const PLAN_AMOUNTS: Record<PlanType, number> = {
  earlyBird: 4999900, // ₹49,999 in paise
  regular: 7499900, // ₹74,999 in paise
};

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error: "Razorpay credentials not configured",
          code: "CONFIG_ERROR",
        },
        { status: 500 }
      );
    }

    let body: CreateOrderBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON body",
          code: "INVALID_BODY",
        },
        { status: 400 }
      );
    }

    const { plan, receipt } = body;

    if (!plan || !["earlyBird", "regular"].includes(plan)) {
      return NextResponse.json(
        {
          error: "Invalid or missing plan. Must be 'earlyBird' or 'regular'.",
          code: "INVALID_PLAN",
        },
        { status: 400 }
      );
    }

    const amount = PLAN_AMOUNTS[plan];

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await instance.orders.create({
      amount,
      currency: "INR",
      receipt: receipt ?? `bootcamp_${plan}_${Date.now()}`,
      notes: {
        plan,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (err) {
    console.error("[Razorpay] Order creation failed:", err);

    const message = err instanceof Error ? err.message : "Unknown error";
    const isRazorpayError = err && typeof err === "object" && "statusCode" in err;

    return NextResponse.json(
      {
        error: isRazorpayError ? "Payment provider error" : "Failed to create order",
        code: "ORDER_CREATE_FAILED",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 }
    );
  }
}
