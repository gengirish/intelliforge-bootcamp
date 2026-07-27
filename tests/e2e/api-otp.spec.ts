import { test, expect } from "@playwright/test";
import { envLocal } from "./helpers/env-local";

/**
 * Only the validation paths are covered. A well-formed phone number makes the
 * route call the hosted OTP API for real, which sends a WhatsApp message and
 * burns rate limit — do not add a happy-path test here.
 */

const HAS_OTP_KEY =
  envLocal("OTP_API_KEY", "") !== "" || envLocal("WHATSAPP_HUB_API_KEY", "") !== "";

test.describe("OTP routes with no API key configured", () => {
  // Production shipped without OTP_API_KEY set and the missing-key throw escaped
  // as a bodyless 500, so the login UI showed "Network error". These pin the
  // contract that a config gap is reported as a clean, parseable 503.
  test("request returns a structured 503 rather than a bare 500", async ({
    request,
  }) => {
    test.skip(HAS_OTP_KEY, "only meaningful when the OTP API is unconfigured");

    // Safe to send a valid number: unconfigured means it never reaches the API.
    const response = await request.post("/api/auth/otp/request", {
      data: { phone: "+919999999999" },
    });

    expect(response.status()).toBe(503);
    const body = await response.json();
    expect(body.error).toBe("otp_not_configured");
    expect(body.message).toBeTruthy();
  });

  test("verify returns a structured 503 rather than a bare 500", async ({
    request,
  }) => {
    test.skip(HAS_OTP_KEY, "only meaningful when the OTP API is unconfigured");

    const response = await request.post("/api/auth/otp/verify", {
      data: { phone: "+919999999999", code: "123456" },
    });

    expect(response.status()).toBe(503);
    const body = await response.json();
    expect(body.error).toBe("otp_not_configured");
    expect(body.clerkSignInToken).toBeUndefined();
  });
});

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
