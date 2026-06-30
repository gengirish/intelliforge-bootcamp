import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { enrollLearnerOnAllCourses } from "@/lib/lms-client";
import {
  getLmsCourseSlugsForBootcamp,
  getLmsCourseSlugsForSprint,
} from "@/lib/product-catalog";
import { sendBootcampEnrollmentConfirmation } from "@/lib/email";
import { markSprintEnrollmentPaid } from "@/lib/sprint-payment";

export function verifyRazorpaySignature(
  body: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return signature === expectedSig;
}

interface RazorpayPayment {
  id: string;
  order_id: string;
  error_description?: string;
}

export async function handleRazorpayWebhookEvent(event: {
  event: string;
  payload: { payment: { entity: RazorpayPayment } };
}): Promise<void> {
  if (event.event === "payment.captured") {
    await handlePaymentCaptured(event.payload.payment.entity);
    return;
  }

  if (event.event === "payment.failed") {
    await handlePaymentFailed(event.payload.payment.entity);
  }
}

async function handlePaymentCaptured(payment: RazorpayPayment) {
  const orderId = payment.order_id;

  const sprintEnrollment = await prisma.sprintEnrollment.findUnique({
    where: { razorpayOrderId: orderId },
  });

  if (sprintEnrollment && sprintEnrollment.status !== "PAID") {
    await markSprintEnrollmentPaid(orderId, payment.id);
    return;
  }

  const bootcampEnrollment = await prisma.bootcampEnrollment.findUnique({
    where: { razorpayOrderId: orderId },
  });

  if (!bootcampEnrollment || bootcampEnrollment.status === "PAID") {
    return;
  }

  await prisma.bootcampEnrollment.update({
    where: { razorpayOrderId: orderId },
    data: {
      status: "PAID",
      razorpayPaymentId: payment.id,
      paidAt: new Date(),
    },
  });

  await fulfillLmsAndNotify({
    email: bootcampEnrollment.email,
    name: bootcampEnrollment.name,
    paymentId: payment.id,
    slugs: getLmsCourseSlugsForBootcamp(),
    updateLms: (data) =>
      prisma.bootcampEnrollment.update({
        where: { id: bootcampEnrollment.id },
        data,
      }),
    sendEmail: () =>
      sendBootcampEnrollmentConfirmation({
        name: bootcampEnrollment.name,
        email: bootcampEnrollment.email,
        paymentId: payment.id,
        plan: bootcampEnrollment.plan,
      }),
  });
}

async function handlePaymentFailed(payment: RazorpayPayment) {
  const orderId = payment.order_id;
  const notes = `Payment failed: ${payment.error_description ?? "unknown error"}`;

  await prisma.sprintEnrollment.updateMany({
    where: { razorpayOrderId: orderId, status: "PENDING" },
    data: { status: "CANCELLED", notes },
  });

  await prisma.bootcampEnrollment.updateMany({
    where: { razorpayOrderId: orderId, status: "PENDING" },
    data: { status: "CANCELLED", notes },
  });
}

async function fulfillLmsAndNotify({
  email,
  name,
  paymentId,
  slugs,
  updateLms,
  sendEmail,
}: {
  email: string;
  name: string;
  paymentId: string;
  slugs: string[];
  updateLms: (data: {
    lmsEnrolledAt?: Date;
    lmsEnrollmentError?: string | null;
  }) => Promise<unknown>;
  sendEmail: () => Promise<unknown>;
}) {
  if (email && slugs.length > 0) {
    const lmsResult = await enrollLearnerOnAllCourses(email, slugs);
    await updateLms(
      lmsResult.ok
        ? { lmsEnrolledAt: new Date(), lmsEnrollmentError: null }
        : { lmsEnrollmentError: lmsResult.errors.join("; ") }
    );
  }

  if (email) {
    try {
      await sendEmail();
    } catch (err) {
      console.error(
        `[Razorpay webhook] Confirmation email failed for ${name} (${paymentId}):`,
        err
      );
    }
  }
}

export async function retryLmsEnrollmentForSprint(enrollment: {
  id: string;
  email: string;
  sprint: { slug: string };
}) {
  const slugs = getLmsCourseSlugsForSprint(enrollment.sprint.slug);
  if (!enrollment.email || slugs.length === 0) return false;

  const lmsResult = await enrollLearnerOnAllCourses(enrollment.email, slugs);
  await prisma.sprintEnrollment.update({
    where: { id: enrollment.id },
    data: lmsResult.ok
      ? { lmsEnrolledAt: new Date(), lmsEnrollmentError: null }
      : { lmsEnrollmentError: lmsResult.errors.join("; ") },
  });
  return lmsResult.ok;
}

export async function retryLmsEnrollmentForBootcamp(enrollment: {
  id: string;
  email: string;
}) {
  const slugs = getLmsCourseSlugsForBootcamp();
  if (!enrollment.email || slugs.length === 0) return false;

  const lmsResult = await enrollLearnerOnAllCourses(enrollment.email, slugs);
  await prisma.bootcampEnrollment.update({
    where: { id: enrollment.id },
    data: lmsResult.ok
      ? { lmsEnrolledAt: new Date(), lmsEnrollmentError: null }
      : { lmsEnrollmentError: lmsResult.errors.join("; ") },
  });
  return lmsResult.ok;
}
