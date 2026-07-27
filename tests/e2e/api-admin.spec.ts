import { test, expect } from "@playwright/test";

/**
 * Admin routes sit outside the Clerk middleware matcher and guard themselves
 * with a bearer token, so the guard is the only thing standing between a public
 * URL and marking enrollments paid. Authorized paths are not exercised: they
 * mutate enrollment state and trigger LMS/email/WhatsApp fulfilment.
 */

test.describe("POST /api/admin/mark-sprint-paid", () => {
  test("rejects a request with no token", async ({ request }) => {
    const response = await request.post("/api/admin/mark-sprint-paid", {
      data: { enrollmentId: "enr_e2e_test" },
    });

    expect(response.status()).toBe(401);
    expect((await response.json()).error).toBe("Unauthorized");
  });

  test("rejects a wrong bearer token", async ({ request }) => {
    const response = await request.post("/api/admin/mark-sprint-paid", {
      headers: { authorization: "Bearer definitely-not-the-admin-secret" },
      data: { enrollmentId: "enr_e2e_test" },
    });

    expect(response.status()).toBe(401);
  });

  test("rejects a bare token with no Bearer prefix", async ({ request }) => {
    const response = await request.post("/api/admin/mark-sprint-paid", {
      headers: { authorization: "definitely-not-the-admin-secret" },
      data: { enrollmentId: "enr_e2e_test" },
    });

    expect(response.status()).toBe(401);
  });

  test("checks auth before parsing the body", async ({ baseURL }) => {
    const response = await fetch(`${baseURL}/api/admin/mark-sprint-paid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });

    expect(response.status).toBe(401);
  });
});

test.describe("POST /api/admin/retry-lms-enrollments", () => {
  test("rejects a request with no token", async ({ request }) => {
    const response = await request.post("/api/admin/retry-lms-enrollments", {
      data: {},
    });

    expect(response.status()).toBe(401);
    expect((await response.json()).error).toBe("Unauthorized");
  });

  test("rejects a wrong bearer token", async ({ request }) => {
    const response = await request.post("/api/admin/retry-lms-enrollments", {
      headers: { authorization: "Bearer definitely-not-the-cron-secret" },
      data: {},
    });

    expect(response.status()).toBe(401);
  });
});
