import { test, expect } from "@playwright/test";
import { envLocal } from "./helpers/env-local";

/** These two round-trip through AgentMail, so they need a real key to mean anything. */
const HAS_AGENTMAIL = envLocal("AGENTMAIL_API_KEY", "") !== "";

test.describe("Email Integration — Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");
  });

  test.describe("Contact Form Section", () => {
    test("renders form with all fields", async ({ page }) => {

      await expect(page.getByText("Have Questions?")).toBeVisible();
      await expect(page.getByText("Get in Touch.")).toBeVisible();

      await expect(page.getByLabel("Name *")).toBeVisible();
      await expect(page.getByLabel("Email *")).toBeVisible();
      await expect(page.getByLabel("Phone (optional)")).toBeVisible();
      await expect(page.getByLabel("Message *")).toBeVisible();

      await expect(
        page.getByRole("button", { name: /Send Message/i })
      ).toBeVisible();
    });

    test("shows contact info alongside form", async ({ page }) => {
      const section = page.locator("#contact");

      await expect(section.getByText("alerts@intelliforge.tech")).toBeVisible();
      await expect(section.getByText("+91 85559 60837")).toBeVisible();
      await expect(section.getByText("Hyderabad, Telangana, India")).toBeVisible();
    });

    test("validates required fields before submit", async ({ page }) => {

      const submitBtn = page.getByRole("button", { name: /Send Message/i });
      await submitBtn.click();

      const nameInput = page.getByLabel("Name *");
      const isInvalid = await nameInput.evaluate(
        (el: HTMLInputElement) => !el.checkValidity()
      );
      expect(isInvalid).toBe(true);
    });

    test("submits form and shows success message", async ({ page }) => {
      test.skip(
        !HAS_AGENTMAIL,
        "sends a real email — needs AGENTMAIL_API_KEY in .env.local"
      );

      await page.getByLabel("Name *").fill("E2E Test User");
      await page.getByLabel("Email *").fill("intelliforge@agentmail.to");
      await page.getByLabel("Phone (optional)").fill("+91 99999 00000");
      await page
        .getByLabel("Message *")
        .fill("Automated E2E test — please ignore.");

      const submitBtn = page.getByRole("button", { name: /Send Message/i });
      await submitBtn.click();

      await expect(page.getByText("Sending...")).toBeVisible();

      await expect(
        page.getByText(/Message sent.*get back to you/i)
      ).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe("Email Test API", () => {
    test("GET /api/email-test verifies connection", async ({ request }) => {
      test.skip(
        !HAS_AGENTMAIL,
        "verifies a live AgentMail connection — needs AGENTMAIL_API_KEY in .env.local"
      );
      const response = await request.get("/api/email-test");
      const body = await response.json();

      expect(body.connection).toBe("verified");
      expect(body.inbox).toBeTruthy();
      expect(body.apiKeyPresent).toBe(true);
      expect(body.inboxDetails.inbox_id).toBe("learning@intelliforge.tech");
    });

    test("POST /api/contact validates input", async ({ request }) => {
      const response = await request.post("/api/contact", {
        data: { name: "", email: "", message: "" },
      });
      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toContain("required");
    });

    test("POST /api/contact rejects invalid email", async ({ request }) => {
      const response = await request.post("/api/contact", {
        data: { name: "Test", email: "not-an-email", message: "Hello" },
      });
      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toContain("Invalid email");
    });
  });
});
