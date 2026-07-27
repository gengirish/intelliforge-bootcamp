import { test, expect } from "@playwright/test";

/**
 * Only the validation paths are covered. A well-formed phone number makes the
 * route call the hosted OTP API for real, which sends a WhatsApp message and
 * burns rate limit — do not add a happy-path test here.
 */

test.describe("POST /api/auth/otp/request", () => {
  test("rejects a missing phone", async ({ request }) => {
    const response = await request.post("/api/auth/otp/request", { data: {} });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe("invalid_phone");
  });

  test("rejects a too-short number", async ({ request }) => {
    const response = await request.post("/api/auth/otp/request", {
      data: { phone: "12345" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe("invalid_phone");
  });

  test("rejects a non-numeric phone", async ({ request }) => {
    const response = await request.post("/api/auth/otp/request", {
      data: { phone: "not-a-phone" },
    });

    expect(response.status()).toBe(400);
  });

  test("rejects a malformed body", async ({ baseURL }) => {
    const response = await fetch(`${baseURL}/api/auth/otp/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe("invalid_phone");
  });
});

test.describe("POST /api/auth/otp/verify", () => {
  test("rejects a missing code", async ({ request }) => {
    const response = await request.post("/api/auth/otp/verify", {
      data: { phone: "+919999999999" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe("invalid_request");
  });

  test("rejects a missing phone", async ({ request }) => {
    const response = await request.post("/api/auth/otp/verify", {
      data: { code: "123456" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe("invalid_request");
  });

  test("rejects an invalid phone even when a code is supplied", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/otp/verify", {
      data: { phone: "12345", code: "123456" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe("invalid_request");
  });

  test("never returns a Clerk sign-in token on a rejected request", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/otp/verify", {
      data: { phone: "12345", code: "000000" },
    });

    const body = await response.json();
    expect(body.clerkSignInToken).toBeUndefined();
    expect(body.verified).not.toBe(true);
  });
});
