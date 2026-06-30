import crypto from "crypto";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { getLmsCourseSlugsForSprint } from "@/lib/product-catalog";
import { enrollLearnerOnAllCourses } from "@/lib/lms-client";
import { sendSprintEnrollmentConfirmation } from "@/lib/email";

type ConfirmResult =
  | { ok: true; alreadyPaid?: boolean }
  | { ok: false; error: string };

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function verifyRazorpayPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expected === signature;
}

async function fulfillSprintEnrollment(enrollment: {
  id: string;
  email: string;
  name: string;
  sprint: { slug: string };
  razorpayPaymentId: string | null;
}) {
  const paymentId = enrollment.razorpayPaymentId;
  if (!paymentId) return;

  const slugs = getLmsCourseSlugsForSprint(enrollment.sprint.slug);
  if (enrollment.email && slugs.length > 0) {
    const lmsResult = await enrollLearnerOnAllCourses(enrollment.email, slugs);
    await prisma.sprintEnrollment.update({
      where: { id: enrollment.id },
      data: lmsResult.ok
        ? { lmsEnrolledAt: new Date(), lmsEnrollmentError: null }
        : { lmsEnrollmentError: lmsResult.errors.join("; ") },
    });
  }

  if (enrollment.email) {
    try {
      await sendSprintEnrollmentConfirmation({
        name: enrollment.name,
        email: enrollment.email,
        paymentId,
      });
    } catch (err) {
      console.error(
        `[Sprint payment] Confirmation email failed for ${enrollment.name} (${paymentId}):`,
        err
      );
    }
  }
}

export async function markSprintEnrollmentPaid(
  orderId: string,
  paymentId: string
): Promise<ConfirmResult> {
  const enrollment = await prisma.sprintEnrollment.findUnique({
    where: { razorpayOrderId: orderId },
    include: { sprint: true },
  });

  if (!enrollment) {
    return { ok: false, error: "Enrollment not found" };
  }

  if (enrollment.status === "PAID") {
    return { ok: true, alreadyPaid: true };
  }

  await prisma.$transaction([
    prisma.sprintEnrollment.update({
      where: { razorpayOrderId: orderId },
      data: {
        status: "PAID",
        razorpayPaymentId: paymentId,
        paidAt: new Date(),
      },
    }),
    prisma.sprint.update({
      where: { id: enrollment.sprintId },
      data: { seatsFilled: { increment: 1 } },
    }),
  ]);

  const updated = await prisma.sprintEnrollment.findUnique({
    where: { razorpayOrderId: orderId },
    include: { sprint: true },
  });

  if (updated) {
    await fulfillSprintEnrollment(updated);
  }

  return { ok: true };
}

export async function markSprintEnrollmentPaidManually(
  enrollmentId: string,
  note = "Manual payment"
): Promise<ConfirmResult> {
  const enrollment = await prisma.sprintEnrollment.findUnique({
    where: { id: enrollmentId },
    include: { sprint: true },
  });

  if (!enrollment) {
    return { ok: false, error: "Enrollment not found" };
  }

  if (enrollment.status === "PAID") {
    return { ok: true, alreadyPaid: true };
  }

  const manualPaymentId = `manual_${Date.now().toString(36)}`;

  await prisma.$transaction([
    prisma.sprintEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: "PAID",
        razorpayPaymentId: manualPaymentId,
        paidAt: new Date(),
        notes: note,
      },
    }),
    prisma.sprint.update({
      where: { id: enrollment.sprintId },
      data: { seatsFilled: { increment: 1 } },
    }),
  ]);

  const updated = await prisma.sprintEnrollment.findUnique({
    where: { id: enrollmentId },
    include: { sprint: true },
  });

  if (updated) {
    await fulfillSprintEnrollment(updated);
  }

  return { ok: true };
}

export async function confirmSprintPayment(
  orderId: string,
  paymentId: string,
  signature?: string
): Promise<ConfirmResult> {
  if (signature) {
    if (!verifyRazorpayPaymentSignature(orderId, paymentId, signature)) {
      return { ok: false, error: "Invalid payment signature" };
    }
    return markSprintEnrollmentPaid(orderId, paymentId);
  }

  const rzp = getRazorpay();
  if (!rzp) {
    return { ok: false, error: "Payment provider not configured" };
  }

  try {
    const payment = await rzp.payments.fetch(paymentId);
    if (payment.order_id !== orderId) {
      return { ok: false, error: "Payment does not match order" };
    }
    if (payment.status !== "captured") {
      return { ok: false, error: "Payment not captured" };
    }
  } catch (err) {
    console.error("[Sprint payment] Razorpay verify failed:", err);
    return { ok: false, error: "Could not verify payment" };
  }

  return markSprintEnrollmentPaid(orderId, paymentId);
}
