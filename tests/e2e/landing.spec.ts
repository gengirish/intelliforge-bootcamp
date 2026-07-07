import { test, expect } from "@playwright/test";

test.describe("Landing Page — All Sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/IntelliForge/);
  });

  test("serves IntelliForge bootcamp favicon", async ({ page }) => {
    const iconLink = page.locator('link[rel="icon"]').first();
    await expect(iconLink).toHaveAttribute("href", /favicon\.ico/);

    const faviconHref = await iconLink.getAttribute("href");
    expect(faviconHref).toBeTruthy();
    const faviconResponse = await page.request.get(faviconHref!);
    expect(faviconResponse.status()).toBe(200);
    expect(faviconResponse.headers()["content-type"]).toContain("image");
    const body = await faviconResponse.body();
    expect(body.byteLength).toBeGreaterThan(100);
    expect(body.byteLength).toBeLessThan(10_000);
  });

  test("header renders with logo and nav links", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).toBeVisible();
    await expect(header.getByText("IntelliForge AI Bootcamp")).toBeVisible();
    await expect(header.getByRole("link", { name: "Curriculum" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Pricing" })).toBeVisible();
  });

  test("hero section renders headline and CTAs", async ({ page }) => {
    await expect(page.getByText("Ship proof they can click.")).toBeVisible();
    await expect(page.getByText("Not another portfolio toy.")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Ship Proof in 14 Days — ₹4,999/ }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Try the free demo — live, no signup/ }).first()
    ).toBeVisible();
  });

  test("trust badges are visible", async ({ page }) => {
    await expect(page.getByText("Founder-taught by Girish").first()).toBeVisible();
    await expect(page.getByText("2 live URLs in 14 days", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Recruiter-checkable credential").first()).toBeVisible();
  });

  test("build-alongside section renders with kill line", async ({ page }) => {
    const section = page.locator("#build-alongside");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText("Build-Alongside: Ship on a")).toBeVisible();
    await expect(section.getByText(/Ask any bootcamp for the repo/)).toBeVisible();
    await expect(section.getByRole("link", { name: /LocalFlash/ })).toBeVisible();
    await expect(section.getByRole("link", { name: /Maidaan/ })).toBeVisible();
    await expect(section.getByRole("link", { name: /ForgeAhead/ })).toBeVisible();
    await expect(section.getByRole("link", { name: /Chronicle/ })).toBeVisible();
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

  test("live schedule section has timezone selector", async ({ page }) => {
    const section = page.locator("#live-schedule");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText("Every Saturday & Sunday")).toBeVisible();
    await expect(section.getByLabel("Show times in")).toBeVisible();
    await expect(section.getByText("Morning live class")).toBeVisible();
  });

  test("who's behind section renders founder Girish", async ({ page }) => {
    const section = page.locator("#whos-behind");
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByText("Who's Behind This")).toBeVisible();
    await expect(page.getByText("Girish").first()).toBeVisible();
    await expect(page.getByText("Founder & Principal Engineer")).toBeVisible();
    await expect(page.getByText("14 years")).toBeVisible();
    await expect(
      page.getByText("IntelliForge Ships Real Products for Real Clients")
    ).toHaveCount(0);
    await expect(page.getByText("Rahul M.")).toHaveCount(0);
  });

  test("learner testimonials with LinkedIn links render", async ({ page }) => {
    const section = page.locator("#testimonials");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText("What Learners Say")).toBeVisible();
    await expect(section.getByText("Harish Hooli")).toBeVisible();
    await expect(section.getByText("Shreya Rajasekar")).toBeVisible();
    const linkedInLinks = section.getByRole("link", { name: /View on LinkedIn/ });
    await expect(linkedInLinks).toHaveCount(5);
    await expect(linkedInLinks.first()).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/harish-hooli/"
    );
  });

  test("pricing section renders all three tracks", async ({ page }) => {
    const section = page.locator("#pricing");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText("Start with the 2-Week Sprint")).toBeVisible();
    await expect(section.getByText("₹4,999", { exact: true })).toBeVisible();
    await expect(section.getByText("₹49,999", { exact: true })).toBeVisible();
    await expect(section.getByText("₹74,999").first()).toBeVisible();
    await expect(
      section.getByRole("link", { name: /Ship Proof in 14 Days — ₹4,999/ })
    ).toBeVisible();
  });

  test("bootcamp enroll redirects unauthenticated user to sign-in", async ({
    page,
  }) => {
    const section = page.locator("#pricing");
    await section.scrollIntoViewIfNeeded();
    await page
      .getByRole("button", { name: /Enrol — ₹49,999/ })
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

  test("final CTA section renders with sprint as primary", async ({ page }) => {
    const finalCta = page.locator("section", {
      has: page.getByRole("heading", { name: /Ask any bootcamp for the repo/ }),
    });
    await finalCta.scrollIntoViewIfNeeded();
    await expect(
      finalCta.getByRole("link", { name: /Ship Proof in 14 Days — ₹4,999/ })
    ).toBeVisible();
    await expect(
      finalCta.getByRole("link", { name: /Try the free demo — live, no signup/ })
    ).toBeVisible();
  });

  test("footer renders with copyright and funnel links", async ({ page }) => {
    await page.getByText("© 2026 IntelliForge AI").scrollIntoViewIfNeeded();
    const footer = page.locator("footer");
    await expect(footer.getByText("© 2026 IntelliForge AI")).toBeVisible();
    await expect(footer.getByText("alerts@intelliforge.tech")).toBeVisible();
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
