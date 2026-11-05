import { test, expect } from "@playwright/test";

test.describe("Retired bootcamp checkout", () => {
  // The upfront ₹49,999 and ₹74,999 plans are gone: nothing may create those orders.
  for (const path of ["/api/razorpay", "/bootcamp/enroll"]) {
    test(`POST ${path} no longer exists`, async ({ request }) => {
      const response = await request.post(path, {
        data: { plan: "earlyBird" },
      });
      expect(response.status()).toBe(404);
    });
  }
});

test.describe("Sprint payment confirmation", () => {
  // The client-side fallback path to markSprintEnrollmentPaid(); the webhook is
  // the other. Both must refuse to mark an enrollment paid on an unverified
  // signature, so these assert the rejection, not the fulfilment.
  test("rejects a malformed body with a 400, not a 500", async ({ baseURL }) => {
    const response = await fetch(`${baseURL}/api/sprint/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid input");
  });

  test("rejects a body with no paymentId", async ({ request }) => {
    const response = await request.post("/api/sprint/confirm-payment", {
      data: { orderId: "order_e2e_test" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid input");
  });

  test("rejects empty identifiers", async ({ request }) => {
    const response = await request.post("/api/sprint/confirm-payment", {
      data: { orderId: "", paymentId: "" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe("Invalid input");
  });

  test("rejects a forged signature", async ({ request }) => {
    const response = await request.post("/api/sprint/confirm-payment", {
      data: {
        orderId: "order_e2e_test",
        paymentId: "pay_e2e_test",
        signature: "0".repeat(64),
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid payment signature");
  });

  test("refuses an unsigned confirmation it cannot verify with Razorpay", async ({
    request,
  }) => {
    // With no signature the route must fall back to fetching the payment from
    // Razorpay; an unknown payment id can never come back captured.
    const response = await request.post("/api/sprint/confirm-payment", {
      data: { orderId: "order_e2e_test", paymentId: "pay_e2e_test" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toMatch(
      /Payment provider not configured|Could not verify payment|Payment does not match order|Payment not captured/
    );
  });
});
