import { test, expect } from "@playwright/test";
import { envLocal } from "./helpers/env-local";

const TENANT = envLocal("WHATSAPP_TENANT_ID", "bootcamp");

test.describe("WhatsApp inbound — tenant guard", () => {
  test("rejects a mismatched tenant", async ({ request }) => {
    const response = await request.post("/api/whatsapp/inbound", {
      headers: {
        "X-WhatsApp-Hub-Tenant": "some-other-tenant",
        "X-WhatsApp-Hub-Event": "message",
      },
      data: { messages: [{ from: "+919999999999" }] },
    });

    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.error).toBe("tenant_mismatch");
  });

  test("rejects a request with no tenant header", async ({ request }) => {
    const response = await request.post("/api/whatsapp/inbound", {
      data: { messages: [] },
    });

    expect(response.status()).toBe(403);
    expect((await response.json()).error).toBe("tenant_mismatch");
  });

  test("accepts the configured tenant", async ({ request }) => {
    const response = await request.post("/api/whatsapp/inbound", {
      headers: {
        "X-WhatsApp-Hub-Tenant": TENANT,
        "X-WhatsApp-Hub-Event": "message",
      },
      data: {
        messages: [{ from: "+919999999999", text: { body: "hi" } }],
      },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  test("accepts a delivery-status forward", async ({ request }) => {
    const response = await request.post("/api/whatsapp/inbound", {
      headers: {
        "X-WhatsApp-Hub-Tenant": TENANT,
        "X-WhatsApp-Hub-Event": "status",
      },
      data: { statuses: [{ id: "wamid.test", status: "delivered" }] },
    });

    expect(response.status()).toBe(200);
    expect((await response.json()).ok).toBe(true);
  });

  test("tolerates a malformed body instead of erroring back at the hub", async ({
    baseURL,
  }) => {
    // The route parses with .catch(() => null) so a bad forward is logged, not 500'd.
    const response = await fetch(`${baseURL}/api/whatsapp/inbound`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WhatsApp-Hub-Tenant": TENANT,
      },
      body: "not-json",
    });

    expect(response.status).toBe(200);
  });
});

test.describe("WhatsApp admin test route — auth guard", () => {
  // Only unauthorized paths are exercised: an authorized POST sends a real
  // WhatsApp template through the hub, which a test suite must never do.
  test("POST without a bearer token is rejected", async ({ request }) => {
    const response = await request.post("/api/admin/whatsapp/test", {
      data: { phone: "+919999999999" },
    });

    expect(response.status()).toBe(401);
    expect((await response.json()).error).toBe("Unauthorized");
  });

  test("POST with a wrong bearer token is rejected", async ({ request }) => {
    const response = await request.post("/api/admin/whatsapp/test", {
      headers: { authorization: "Bearer definitely-not-the-admin-secret" },
      data: { phone: "+919999999999" },
    });

    expect(response.status()).toBe(401);
  });

  test("auth is checked before the request body is parsed", async ({
    baseURL,
  }) => {
    // Malformed JSON must still 401 rather than 400 — an unauthenticated caller
    // should not be able to tell valid input from invalid.
    const response = await fetch(`${baseURL}/api/admin/whatsapp/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });

    expect(response.status).toBe(401);
  });

  test("GET reports hub health", async ({ request }) => {
    const response = await request.get("/api/admin/whatsapp/test");
    const body = await response.json();

    if (response.status() === 503) {
      expect(body).toEqual({ ok: false, error: "hub_not_configured" });
      return;
    }

    expect(response.status()).toBe(200);
    expect(body.configured).toBe(true);
    expect(typeof body.ok).toBe("boolean");
  });
});
