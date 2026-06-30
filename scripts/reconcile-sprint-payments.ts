import Razorpay from "razorpay";
import { PrismaClient } from "@prisma/client";
import { markSprintEnrollmentPaid } from "../src/lib/sprint-payment";

const prisma = new PrismaClient();

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay credentials missing");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

async function main() {
  const pending = await prisma.sprintEnrollment.findMany({
    where: { sprint: { slug: "ai-sprint-jun-2026" }, status: "PENDING" },
    select: { razorpayOrderId: true, email: true },
  });

  const rzp = getRazorpay();
  const results = [];

  for (const enrollment of pending) {
    try {
      const orderPayments = await rzp.orders.fetchPayments(
        enrollment.razorpayOrderId
      );
      const captured = orderPayments.items.find((p) => p.status === "captured");

      if (captured) {
        const result = await markSprintEnrollmentPaid(
          enrollment.razorpayOrderId,
          captured.id
        );
        results.push({
          orderId: enrollment.razorpayOrderId,
          email: enrollment.email,
          paymentId: captured.id,
          result,
        });
      } else {
        results.push({
          orderId: enrollment.razorpayOrderId,
          email: enrollment.email,
          skipped: "no captured payment",
        });
      }
    } catch (err) {
      results.push({
        orderId: enrollment.razorpayOrderId,
        email: enrollment.email,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const paid = await prisma.sprintEnrollment.count({
    where: { sprint: { slug: "ai-sprint-jun-2026" }, status: "PAID" },
  });

  const sprint = await prisma.sprint.findUnique({
    where: { slug: "ai-sprint-jun-2026" },
    select: { seatsFilled: true, seatsTotal: true },
  });

  console.log(
    JSON.stringify({ results, paid, seatsFilled: sprint?.seatsFilled }, null, 2)
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
