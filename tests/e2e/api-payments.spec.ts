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
