import { test, expect } from "@playwright/test";
import { envLocal } from "./helpers/env-local";
import { signWebhook } from "./helpers/razorpay";

/**
 * The sprint page reads isActive from the DB and falls back to false when it is
 * unreachable, which renders the whole page sold out — no enroll CTAs, no seat
 * map. Anything asserting the live-cohort UI therefore needs a seeded database.
 */
const HAS_DB = envLocal("DATABASE_URL", "") !== "";
const NEEDS_DB = "needs a seeded DATABASE_URL — page renders sold out without one";

test.describe("Sprint Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sprint");
    await page.waitForLoadState("domcontentloaded");
  });

  test("loads with correct title and hero", async ({ page }) => {
    await expect(page).toHaveTitle(/2-Week AI Sprint/);
    await expect(page.getByText("Interview in 3 weeks?")).toBeVisible();
    await expect(
      page.getByText("Ship two live AI products in 14 days.")
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Is This You Right Now?" })).toBeVisible();
  });

  test("shows pricing and savings", async ({ page }) => {
    await expect(page.getByText("₹4,999").first()).toBeVisible();
    await expect(page.getByText("₹12,999").first()).toBeVisible();
    await expect(page.getByText("Save ₹8,000")).toBeVisible();
  });

  test("shows cohort start date and seat count", async ({ page }) => {
    test.skip(!HAS_DB, NEEDS_DB);
    await expect(page.getByText(/Cohort 1 · Starts/)).toBeVisible();
    await expect(page.getByText(/seats left|Sold out/)).toBeVisible();
    await expect(page.getByText("Max 30 seats")).toBeVisible();
    // The counts are already spelled out in the map's own aria-label, which is
    // unambiguous — getByText("booked") matches both the legend and the
    // "Hover a booked seat for name" hint below it.
    await expect(
      page.getByLabel("Cohort seat map: 9 of 30 seats booked, 21 available").first()
    ).toBeVisible();
    await expect(
      page.getByText("Hover a booked seat for name").first()
    ).toBeVisible();
  });

  test("booked seats show occupant name on hover", async ({ page }) => {
    test.skip(!HAS_DB, NEEDS_DB);
    const seatMap = page.getByLabel(/Cohort seat map:/).first();
    await expect(seatMap).toBeVisible();
    const firstBooked = seatMap.getByLabel("Seat A1, booked by Prasad K");
    await expect(firstBooked).toBeVisible();
    await firstBooked.hover();
    // SprintLandingClient renders the seat map more than once, so scope the
    // tooltip to the map actually hovered rather than matching all of them.
    await expect(
      seatMap.getByRole("tooltip", { name: "Prasad K" })
    ).toBeVisible();
  });

  test("shows countdown and timezone-selectable live schedule", async ({ page }) => {
    await expect(
      page.getByText("Countdown to Cohort 1 kickoff")
    ).toBeVisible();
    await expect(page.getByText("Live class schedule")).toBeVisible();
    await expect(page.getByText(/Every Saturday & Sunday/)).toBeVisible();
    await expect(page.getByLabel("Show times in")).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "IST (anchor)" })).toBeVisible();
    await expect(page.getByText("Morning live class")).toBeVisible();
    await expect(page.getByText("Evening live class")).toBeVisible();

    const timezoneSelect = page.getByLabel("Show times in");
    await timezoneSelect.selectOption("America/Los_Angeles");
    await expect(page.getByRole("columnheader", { name: "PST" })).toBeVisible();
    await expect(page.getByText("8:30 PM – 10:30 PM").first()).toBeVisible();
    await expect(page.getByText("7:30 AM – 9:30 AM").first()).toBeVisible();
  });

  test("renders curriculum weeks and outcomes", async ({ page }) => {
    await expect(page.getByText("What You'll Ship")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Claude API Chatbot" })).toBeVisible();
    await expect(page.getByText("RAG Document Q&A")).toBeVisible();
    await expect(page.getByText("Deployed AI Product")).toBeVisible();
    await expect(page.getByText("Week 1 — Claude API")).toBeVisible();
    await expect(page.getByText("Week 2 — RAG System")).toBeVisible();
    await expect(
      page.getByText("Build a production chatbot with streaming responses")
    ).toBeVisible();
  });

  test("has enroll CTAs and bootcamp cross-link", async ({ page }) => {
    test.skip(!HAS_DB, NEEDS_DB);
    await expect(
      page.getByRole("button", { name: /Enroll Now — ₹4,999/ })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Secure My Seat — ₹4,999/ })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Full 12-Week Bootcamp/ }).first()
    ).toBeVisible();
  });

  test("header links back to home", async ({ page }) => {
    const homeLink = page.getByRole("link", { name: "IntelliForge AI" });
    await expect(homeLink).toHaveAttribute("href", "/");
  });

  test("redirects unauthenticated user to sign-in on enroll click", async ({
    page,
  }) => {
    test.skip(!HAS_DB, NEEDS_DB);
    // The button is server-rendered before React attaches its onClick, so a
    // click that lands too early is silently dropped and the URL never changes.
    await page.waitForLoadState("networkidle");
    await page
      .getByRole("button", { name: /Enroll Now — ₹4,999/ })
      .click();
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 15000 });
  });
});

test.describe("Sprint Success Page", () => {
  test("renders confirmation and next steps", async ({ page }) => {
    await page.goto(
      "/sprint/success?payment_id=pay_e2e_test&order_id=order_e2e_test"
    );
    await expect(
      page.getByRole("heading", { name: /You're in, Cohort 1!/ })
    ).toBeVisible();
    await expect(page.getByText("What happens next")).toBeVisible();
    await expect(
      page.getByText(/Session 1 is Saturday, 08\/08\/2026/)
    ).toBeVisible();
    await expect(
      page.getByText(/9–11 AM IST/)
    ).toBeVisible();
    await expect(page.getByText("Payment ID: pay_e2e_test")).toBeVisible();
  });

  test("WhatsApp CTA points to sprint cohort redirect", async ({ page }) => {
    await page.goto("/sprint/success");
    const whatsappLink = page.getByRole("link", {
      name: /Join UpSkill-Cohort-01 on WhatsApp/,
    });
    await expect(whatsappLink).toHaveAttribute(
      "href",
      "https://upskill.intelliforge.tech/sprint/whatsapp"
    );
  });

  test("LMS CTA points to sign-in URL", async ({ page }) => {
    await page.goto("/sprint/success");
    const lmsLink = page.getByRole("link", { name: /Sign in to LMS/ });
    await expect(lmsLink).toHaveAttribute(
      "href",
      "https://learning.intelliforge.tech/api/auth/signin"
    );
  });
});

test.describe("Sprint API", () => {
  test("GET /api/sprint/seats returns seat counts", async ({ request }) => {
    test.skip(!HAS_DB, NEEDS_DB);
    const response = await request.get("/api/sprint/seats");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({
      remaining: expect.any(Number),
      filled: expect.any(Number),
      total: expect.any(Number),
    });
    expect(body.data.remaining).toBe(body.data.total - body.data.filled);
    expect(body.data.filled).toBe(9);
    expect(body.data.remaining).toBe(21);
    expect(body.data.total).toBe(30);
  });

  test("GET /api/sprint/seats accepts slug query param", async ({ request }) => {
    test.skip(!HAS_DB, NEEDS_DB);
    const response = await request.get(
      "/api/sprint/seats?slug=ai-sprint-jun-2026"
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test("GET /api/sprint/seats returns 404 for unknown slug", async ({
    request,
  }) => {
    test.skip(!HAS_DB, NEEDS_DB);
    const response = await request.get(
      "/api/sprint/seats?slug=nonexistent-sprint"
    );
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("not found");
  });

  test("POST /sprint/enroll without auth returns 401", async ({ request }) => {
    const response = await request.post("/sprint/enroll", {
      data: { sprintSlug: "ai-sprint-jun-2026" },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Unauthorized");
  });

  test("POST /sprint/webhook accepts a correctly signed event", async ({
    request,
  }) => {
    test.skip(!HAS_DB, "handler looks the order up in the DB before dispatching");

    // An order that does not exist: the handler should verify the signature,
    // find nothing to mark paid, and still acknowledge so Razorpay stops retrying.
    const body = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: { id: "pay_e2e_unknown", order_id: "order_e2e_unknown" },
        },
      },
    });

    const response = await request.post("/sprint/webhook", {
      headers: {
        "x-razorpay-signature": signWebhook(body),
        "Content-Type": "application/json",
      },
      data: body,
    });

    expect(response.status()).toBe(200);
    expect((await response.json()).ok).toBe(true);
  });

  test("POST /sprint/webhook rejects invalid signature", async ({ request }) => {
    const response = await request.post("/sprint/webhook", {
      headers: {
        "x-razorpay-signature": "invalid_signature",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        event: "payment.captured",
        payload: { payment: { entity: { order_id: "order_test" } } },
      }),
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid signature");
  });
});

test.describe("Sprint — Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("landing page is usable on mobile", async ({ page }) => {
    await page.goto("/sprint");
    // "Your Team Shipped an AI Demo." is the og:title only — it is never in the
    // body, so assert the copy the hero actually renders.
    await expect(page.getByText("Interview in 3 weeks?")).toBeVisible();
    await expect(
      page.getByText("Ship two live AI products in 14 days.")
    ).toBeVisible();
  });

  test("shows the enroll CTA on mobile", async ({ page }) => {
    test.skip(!HAS_DB, NEEDS_DB);
    await page.goto("/sprint");
    await expect(
      page.getByRole("button", { name: /Enroll Now — ₹4,999/ })
    ).toBeVisible();
  });
});
