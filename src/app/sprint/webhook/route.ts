import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendSprintEnrollmentConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSig) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id as string;

    const enrollment = await prisma.sprintEnrollment.findUnique({
      where: { razorpayOrderId: orderId },
    });

    if (!enrollment || enrollment.status === "PAID") {
      return NextResponse.json({ ok: true });
    }

    await prisma.$transaction([
      prisma.sprintEnrollment.update({
        where: { razorpayOrderId: orderId },
        data: {
          status: "PAID",
          razorpayPaymentId: payment.id,
          paidAt: new Date(),
        },
      }),
      prisma.sprint.update({
        where: { id: enrollment.sprintId },
        data: { seatsFilled: { increment: 1 } },
      }),
    ]);

    if (enrollment.email) {
      try {
        await sendSprintEnrollmentConfirmation({
          name: enrollment.name,
          email: enrollment.email,
          paymentId: payment.id,
        });
      } catch (err) {
        console.error("[Sprint webhook] Enrollment email failed:", err);
      }
    }
  }

  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity;
    await prisma.sprintEnrollment.updateMany({
      where: { razorpayOrderId: payment.order_id },
      data: {
        status: "CANCELLED",
        notes: `Payment failed: ${payment.error_description}`,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
