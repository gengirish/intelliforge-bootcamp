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
    await expect(page.getByText("Don't build a portfolio project.")).toBeVisible();
    await expect(page.getByText("Ship a real product.")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Try the free demo — live, no signup/ }).first()
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Enrol in Cohort 1/ }).first()).toBeVisible();
  });

  test("trust badges are visible", async ({ page }) => {
    await expect(page.getByText("Founder-taught by Girish").first()).toBeVisible();
    await expect(page.getByText("Ship to a live repo", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Verifiable credential").first()).toBeVisible();
  });

  test("build-alongside section renders with kill line", async ({ page }) => {
    const section = page.locator("#build-alongside");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText("Build-Alongside: Ship on a")).toBeVisible();
    await expect(section.getByText(/Ask any bootcamp for the repo/)).toBeVisible();
    await expect(section.getByRole("link", { name: /PDFforge/ })).toBeVisible();
    await expect(section.getByRole("link", { name: /Maidaan/ })).toBeVisible();
  });

  test("verifiable credential section renders", async ({ page }) => {
    const section = page.locator("#credential");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("heading", { name: /A Credential Recruiters Can/ })).toBeVisible();
    await expect(section.getByText("certs.intelliforge.tech").first()).toBeVisible();
  });

  test("comparison table renders three columns", async ({ page }) => {
    const section = page.locator("#comparison");
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByText("How We Compare")).toBeVisible();
    await expect(page.getByText("Recorded AI courses")).toBeVisible();
    await expect(page.getByText("University AI certificates")).toBeVisible();
  });

  test("curriculum section renders 3 phases", async ({ page }) => {
    const section = page.locator("#curriculum");
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByText("12 Weeks. Four Phases. One Shipped Product.")).toBeVisible();
    await expect(page.getByText("Phase 1: Ship Your First Agent")).toBeVisible();
    await expect(page.getByText("Phase 2: Ship Multi-Agent Systems")).toBeVisible();
    await expect(page.getByText("Phase 3: Ship Your Product")).toBeVisible();
  });

  test("who's behind section renders founder Girish", async ({ page }) => {
    const section = page.locator("#whos-behind");
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByText("Who's Behind This")).toBeVisible();
    await expect(page.getByText("Girish").first()).toBeVisible();
    await expect(page.getByText("Founder & Principal Engineer")).toBeVisible();
    await expect(page.getByText("14 years")).toBeVisible();
  });

  test("client quotes appear in who's behind section", async ({ page }) => {
    const section = page.locator("#whos-behind");
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByText("IntelliForge Ships Real Products for Real Clients")).toBeVisible();
    await expect(page.getByText("Rahul M.")).toBeVisible();
  });

  test("cohort outcomes placeholder is honest", async ({ page }) => {
    const section = page.locator("#cohort-outcomes");
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByText("Cohort 1 Outcomes")).toBeVisible();
    await expect(page.getByText("Coming as our first cohort ships.")).toBeVisible();
    await expect(page.getByText("We don't fabricate learner testimonials")).toBeVisible();
  });

  test("pricing section renders all three tracks", async ({ page }) => {
    const section = page.locator("#pricing");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText("Two Tracks. One Outcome: You Shipped.")).toBeVisible();
    await expect(section.getByText("₹4,999", { exact: true })).toBeVisible();
    await expect(section.getByText("₹49,999", { exact: true })).toBeVisible();
    await expect(section.getByText("₹74,999").first()).toBeVisible();
  });

  test("bootcamp enroll redirects unauthenticated user to sign-in", async ({
    page,
  }) => {
    const section = page.locator("#pricing");
    await section.scrollIntoViewIfNeeded();
    await page
      .getByRole("button", { name: /Enrol in Cohort 1/ })
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
    const faqSection = page.locator("#faq");
    await expect(faqSection.getByText(/Ask any bootcamp for the repo you'll contribute to/)).toBeVisible();
  });

  test("final CTA section renders with free demo primary", async ({ page }) => {
    const finalCta = page.locator("section", {
      has: page.getByRole("heading", { name: /Ask any bootcamp for the repo/ }),
    });
    await finalCta.scrollIntoViewIfNeeded();
    await expect(finalCta.getByRole("heading", { name: /Ask any bootcamp for the repo/ })).toBeVisible();
    await expect(
      finalCta.getByRole("link", { name: /Try the free demo — live, no signup/ })
    ).toBeVisible();
  });

  test("footer renders with copyright and funnel links", async ({ page }) => {
    await page.getByText("© 2026 IntelliForge AI").scrollIntoViewIfNeeded();
    const footer = page.locator("footer");
    await expect(footer.getByText("© 2026 IntelliForge AI")).toBeVisible();
    await expect(footer.getByText("contact@intelliforge.tech")).toBeVisible();
    await expect(footer.getByText("Graduate wins")).toBeVisible();
  });

  test("no animated stat counters on page", async ({ page }) => {
    await expect(page.getByText("Years Enterprise Experience")).not.toBeVisible();
    await expect(page.getByText("Fortune 500 Clients Served")).not.toBeVisible();
    await expect(page.getByText("0+", { exact: true })).not.toBeVisible();
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
