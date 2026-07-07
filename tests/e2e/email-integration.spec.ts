import { test, expect } from "@playwright/test";

test.describe("Email Integration — Contact Form & New Sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test.describe("Announcement Banner", () => {
    test("renders with sprint enroll link and dismiss button", async ({ page }) => {
      const banner = page.locator('[class*="z-[60]"]');
      await expect(banner).toBeVisible();
      await expect(banner.getByText(/2-Week AI Sprint/)).toBeVisible();

      const sprintLink = banner.getByRole("link", { name: "Join sprint →" });
      await expect(sprintLink).toBeVisible();
      await expect(sprintLink).toHaveAttribute("href", "/sprint");
    });

    test("can be dismissed with X button", async ({ page }) => {
      const banner = page.locator('[class*="z-[60]"]');
      await expect(banner).toBeVisible();

      const dismissBtn = page.getByRole("button", { name: /dismiss/i });
      await dismissBtn.click();
      await page.waitForTimeout(300);
      await expect(banner).not.toBeVisible();
    });
  });

  test.describe("Hero — Free Class CTA", () => {
    test("shows 'try a free class' link pointing to LMS", async ({ page }) => {
      const freeClassLink = page.getByRole("link", {
        name: "Try a free class →",
        exact: true,
      });
      await expect(freeClassLink).toBeVisible();
      await expect(freeClassLink).toHaveAttribute(
        "href",
        /learning\.intelliforge\.tech/
      );
      await expect(freeClassLink).toHaveAttribute("target", "_blank");
    });
  });

  test.describe("Free Preview Section", () => {
    test("renders heading and 3 session cards", async ({ page }) => {
      const section = page.locator("#free-preview");
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(
        page.getByText("Not Sure Yet? Try a")
      ).toBeVisible();
      await expect(page.getByText("Free Class", { exact: true }).first()).toBeVisible();

      await expect(page.getByText("Build Your First AI Agent")).toBeVisible();
      await expect(page.getByText("RAG Pipeline Crash Course")).toBeVisible();
      await expect(page.getByText("Vibe Coding Live Demo")).toBeVisible();
    });

    test("session cards show duration and level badges", async ({ page }) => {
      const section = page.locator("#free-preview");
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(page.getByText("60 min")).toBeVisible();
      await expect(page.getByText("Beginner")).toBeVisible();
      await expect(page.getByText("45 min")).toBeVisible();
      await expect(page.getByText("Intermediate")).toBeVisible();
      await expect(page.getByText("30 min")).toBeVisible();
      await expect(page.getByText("All Levels")).toBeVisible();
    });

    test("has Start Free Class CTA linking to LMS", async ({ page }) => {
      const section = page.locator("#free-preview");
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const cta = section.getByRole("link", { name: /Start Free Class/i });
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute("href", /learning\.intelliforge\.tech/);
    });

    test("shows no-commitment message", async ({ page }) => {
      const section = page.locator("#free-preview");
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(
        page.getByText("No signup required. No payment. Just learn.")
      ).toBeVisible();
    });
  });

  test.describe("Pricing — LMS Cross-link", () => {
    test("shows free class link below pricing", async ({ page }) => {
      const section = page.locator("#pricing");
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(
        page.getByText("Not ready to commit?")
      ).toBeVisible();

      const lmsLink = section.getByRole("link", {
        name: /Try a free class on our learning platform/i,
      });
      await expect(lmsLink).toBeVisible();
      await expect(lmsLink).toHaveAttribute("href", /learning\.intelliforge\.tech/);
    });
  });

  test.describe("Final CTA — Dual Path", () => {
    test("has sprint and free demo CTAs", async ({ page }) => {
      const finalCtaSection = page.locator("section", {
        has: page.getByText("Ask any bootcamp for the repo"),
      });

      const sprintCTA = finalCtaSection.getByRole("link", {
        name: /Ship Proof in 14 Days — ₹4,999/,
      });
      await expect(sprintCTA).toBeVisible();
      await expect(sprintCTA).toHaveAttribute("href", "/sprint");

      const freeDemoCTA = finalCtaSection.getByRole("link", {
        name: /Try the free demo — live, no signup/,
      });
      await expect(freeDemoCTA).toBeVisible();
      await expect(freeDemoCTA).toHaveAttribute(
        "href",
        /learning\.intelliforge\.tech/
      );
    });
  });

  test.describe("Contact Form Section", () => {
    test("renders form with all fields", async ({ page }) => {
      const section = page.locator("#contact");
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

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
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(section.getByText("contact@intelliforge.tech")).toBeVisible();
      await expect(section.getByText("+91 85559 60837")).toBeVisible();
      await expect(section.getByText("Hyderabad, Telangana, India")).toBeVisible();
    });

    test("validates required fields before submit", async ({ page }) => {
      const section = page.locator("#contact");
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const submitBtn = page.getByRole("button", { name: /Send Message/i });
      await submitBtn.click();

      const nameInput = page.getByLabel("Name *");
      const isInvalid = await nameInput.evaluate(
        (el: HTMLInputElement) => !el.checkValidity()
      );
      expect(isInvalid).toBe(true);
    });

    test("submits form and shows success message", async ({ page }) => {
      const section = page.locator("#contact");
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

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

  test.describe("Footer — LMS Links", () => {
    test("shows Learning Platform and main site links", async ({ page }) => {
      const footer = page.locator("footer");
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      const lmsLink = footer.getByRole("link", { name: "Learning Platform" });
      await expect(lmsLink).toBeVisible();
      await expect(lmsLink).toHaveAttribute(
        "href",
        "https://learning.intelliforge.tech"
      );

      const mainLink = footer.getByRole("link", {
        name: /IntelliForge AI.*Main/i,
      });
      await expect(mainLink).toBeVisible();
      await expect(mainLink).toHaveAttribute(
        "href",
        "https://www.intelliforge.tech"
      );
    });
  });

  test.describe("Navigation — Contact link", () => {
    test("nav bar includes Contact link", async ({ page }) => {
      const contactNavLink = page
        .locator("header")
        .getByRole("link", { name: "Contact" });
      await expect(contactNavLink).toBeVisible();
    });

    test("Contact nav link scrolls to contact form", async ({ page }) => {
      await page
        .locator("header")
        .getByRole("link", { name: "Contact" })
        .click();
      await page.waitForTimeout(1000);

      const section = page.locator("#contact");
      await expect(section).toBeInViewport();
    });
  });

  test.describe("Email Test API", () => {
    test("GET /api/email-test verifies connection", async ({ request }) => {
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
