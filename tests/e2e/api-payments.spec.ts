import { test, expect } from "@playwright/test";

test.describe("Bootcamp Razorpay API", () => {
  test("POST /api/razorpay rejects invalid plan", async ({ request }) => {
    const response = await request.post("/api/razorpay", {
      data: { plan: "invalid" },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/Invalid or missing plan/);
    expect(body.code).toBe("INVALID_PLAN");
  });

  test("POST /api/razorpay rejects missing plan", async ({ request }) => {
    const response = await request.post("/api/razorpay", {
      data: {},
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.code).toBe("INVALID_PLAN");
  });

  test("POST /api/razorpay rejects malformed JSON", async ({ baseURL }) => {
    const response = await fetch(`${baseURL}/api/razorpay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.code).toBe("INVALID_BODY");
  });

  test("POST /api/razorpay accepts earlyBird plan when configured", async ({
    request,
  }) => {
    const response = await request.post("/api/razorpay", {
      data: { plan: "earlyBird" },
    });

    if (response.status() === 500) {
      const body = await response.json();
      expect(body.code).toMatch(/CONFIG_ERROR|ORDER_CREATE_FAILED/);
      return;
    }

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.orderId).toBeTruthy();
    expect(body.amount).toBe(4999900);
    expect(body.currency).toBe("INR");
  });
});

test.describe("Bootcamp enrollment route", () => {
  test("POST /bootcamp/enroll without auth returns 401", async ({ request }) => {
    const response = await request.post("/bootcamp/enroll", {
      data: { plan: "earlyBird" },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Unauthorized");
  });

  test("POST /bootcamp/enroll checks auth before validating the plan", async ({
    request,
  }) => {
    const response = await request.post("/bootcamp/enroll", {
      data: { plan: "not-a-real-plan" },
    });

    expect(response.status()).toBe(401);
  });
});

test.describe("Sprint payment confirmation", () => {
  // The client-side fallback path to markSprintEnrollmentPaid(); the webhook is
  // the other. Both must refuse to mark an enrollment paid on an unverified
  // signature, so these assert the rejection, not the fulfilment.
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
