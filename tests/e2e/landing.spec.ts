import { test, expect } from "@playwright/test";

test.describe("Landing Page — All Sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/IntelliForge/);
  });

  test("header renders with logo and nav links", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).toBeVisible();
    await expect(header.getByText("IntelliForge AI Bootcamp")).toBeVisible();
    await expect(header.getByRole("link", { name: "Curriculum" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Pricing" })).toBeVisible();
  });

  test("hero section renders headline and CTAs", async ({ page }) => {
    await expect(page.getByText("Build AI Agents.")).toBeVisible();
    await expect(page.getByText("Ship AI Products.")).toBeVisible();
    await expect(page.getByText("Own Your AI Future.")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Join 2-Week AI Sprint/ }).first()
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "12-Week Bootcamp" })).toBeVisible();
  });

  test("trust badges are visible", async ({ page }) => {
    await expect(page.getByText("Aligned with Bharat AI Mission").first()).toBeVisible();
    await expect(page.getByText("13+ Years Fortune 500 DNA")).toBeVisible();
  });

  test("stats bar renders with numbers", async ({ page }) => {
    await expect(page.getByText("Years Enterprise Experience")).toBeVisible();
    await expect(page.getByText("AI Frameworks Covered")).toBeVisible();
    await expect(page.getByText("Weeks to Mastery", { exact: true })).toBeVisible();
  });

  test("Why IntelliForge section renders 4 cards", async ({ page }) => {
    const section = page.locator("#why-intelliforge");
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByText("Not Another AI Theory Course")).toBeVisible();
    await expect(page.getByText("Build to Ship, Not Just to Learn")).toBeVisible();
    await expect(page.getByText("Dual-Track: Agents + Vibe Coding")).toBeVisible();
    await expect(page.getByText("Enterprise DNA from Fortune 500")).toBeVisible();
    await expect(page.getByText("3 Career Paths, Not Just 1")).toBeVisible();
  });

  test("dual-track section shows both tracks", async ({ page }) => {
    await expect(page.getByText("AI Agent Development").first()).toBeVisible();
    await expect(page.getByText("Vibe Coding").first()).toBeVisible();
  });

  test("curriculum section renders 3 phases", async ({ page }) => {
    const section = page.locator("#curriculum");
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByText("12 Weeks to Mastery")).toBeVisible();
    await expect(page.getByText("Phase 1: AI Agent Foundations")).toBeVisible();
    await expect(page.getByText("Phase 2: Multi-Agent Systems")).toBeVisible();
    await expect(page.getByText("Phase 3: Vibe Coding")).toBeVisible();
  });

  test("capstone products section renders cards", async ({ page }) => {
    await page.getByText("10+ Production Products").scrollIntoViewIfNeeded();
    await expect(page.getByText("10+ Production Products")).toBeVisible();
    await expect(page.getByText("AI Research Agent")).toBeVisible();
    await expect(page.getByText("AI Interview Platform")).toBeVisible();
  });

  test("instructor section renders", async ({ page }) => {
    await expect(page.getByText("Learn From a Builder")).toBeVisible();
    await expect(page.getByText("IntelliForge AI").nth(1)).toBeVisible();
  });

  test("who-is-for section renders both columns", async ({ page }) => {
    await expect(page.getByText("Is This Bootcamp Right for You")).toBeVisible();
    await expect(page.getByText("This IS for you").first()).toBeVisible();
    await expect(page.getByText("This is NOT for you").first()).toBeVisible();
  });

  test("outcomes section renders", async ({ page }) => {
    await expect(page.getByText("What You'll Be Able to Do")).toBeVisible();
    await expect(page.getByText("Build Multi-Agent Systems")).toBeVisible();
    await expect(page.getByText("Ship Production AI Apps")).toBeVisible();
  });

  test("testimonials section renders", async ({ page }) => {
    await expect(page.getByText("What People Say")).toBeVisible();
    await expect(page.getByText("Rahul M.")).toBeVisible();
  });

  test("pricing section renders both cards", async ({ page }) => {
    const section = page.locator("#pricing");
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByText("Invest Once. Compound Forever")).toBeVisible();
    await expect(page.getByText("₹74,999").first()).toBeVisible();
    await expect(page.getByText("₹49,999", { exact: true })).toBeVisible();
    await expect(page.getByText("Best Value")).toBeVisible();
  });

  test("bootcamp enroll redirects unauthenticated user to sign-in", async ({
    page,
  }) => {
    const section = page.locator("#pricing");
    await section.scrollIntoViewIfNeeded();
    await page
      .getByRole("button", { name: /Enroll Now — Early Bird/ })
      .click();
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 10000 });
  });

  test("FAQ section renders and accordion works", async ({ page }) => {
    await page.getByText("Questions? Answered").scrollIntoViewIfNeeded();
    await expect(page.getByText("Questions? Answered")).toBeVisible();

    const firstQuestion = page.getByRole("button", { name: "What makes IntelliForge" });
    await expect(firstQuestion).toBeVisible();

    await firstQuestion.click();
    await page.waitForTimeout(400);
    await expect(page.getByText("dual-track curriculum covers both Agent Development")).toBeVisible();
  });

  test("final CTA section renders", async ({ page }) => {
    await expect(page.getByText("Stop Learning AI")).toBeVisible();
    await expect(page.getByText("Start Shipping It")).toBeVisible();
  });

  test("footer renders with copyright and links", async ({ page }) => {
    await page.getByText("© 2026 IntelliForge AI").scrollIntoViewIfNeeded();
    const footer = page.locator("footer");
    await expect(footer.getByText("© 2026 IntelliForge AI")).toBeVisible();
    await expect(footer.getByText("contact@intelliforge.tech")).toBeVisible();
  });
});

test.describe("Bootcamp Enrollment Success Page", () => {
  test("LMS CTA points to sign-in URL", async ({ page }) => {
    await page.goto("/enrollment/success?payment_id=pay_e2e_test");
    await expect(
      page.getByRole("heading", { name: /You're enrolled!/ })
    ).toBeVisible();
    const lmsLink = page.getByRole("link", { name: /Sign in to LMS/ });
    await expect(lmsLink).toHaveAttribute(
      "href",
      "https://learning.intelliforge.tech/api/auth/signin"
    );
  });
});
