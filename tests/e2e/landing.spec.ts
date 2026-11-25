import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
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

  test("header has the wordmark and in-page links", async ({ page }) => {
    const header = page.locator("header");
    await expect(header.getByText("IntelliForge AI Bootcamp")).toBeVisible();
    await expect(header.getByRole("link", { name: "Curriculum" })).toHaveAttribute(
      "href",
      "#curriculum"
    );
    await expect(header.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "#faq");
  });

  test("hero is the waitlist, written as one sentence", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Ship AI in the job you already have." })
    ).toBeVisible();
    const form = page.getByRole("form", { name: "Join the Cohort 2 waitlist" });
    for (const label of [
      "Your name",
      "What you work in",
      "Years of work experience",
      "What you want from the course",
      "Who would pay",
      "Your email",
    ]) {
      await expect(form.getByLabel(label)).toBeAttached();
    }
    await expect(form.getByRole("button", { name: "Count me in" })).toBeVisible();
  });

  test("an incomplete sentence is flagged, not sent", async ({ page }) => {
    let posted = false;
    await page.route("**/api/waitlist", (route) => {
      posted = true;
      return route.fulfill({ json: { success: true, data: null } });
    });
    const form = page.getByRole("form", { name: "Join the Cohort 2 waitlist" });
    await form.getByRole("button", { name: "Count me in" }).click();
    await expect(form.getByRole("alert")).toContainText("Fill in the blanks");
    await expect(page.getByLabel("Your name")).toBeFocused();
    await expect(page.getByLabel("Your name")).toHaveAttribute("aria-invalid", "true");
    expect(posted).toBe(false);
  });

  test("a finished sentence joins the waitlist with every answer", async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route("**/api/waitlist", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({
        json: { success: true, data: { token: "t1", referralCode: "abc123" } },
      });
    });

    await page.getByLabel("Your name").fill("Priya Raman");
    await page.getByLabel("What you work in").selectOption("cloud-devops");
    await page.getByLabel("Years of work experience").selectOption("6-10");
    await page.getByLabel("What you want from the course").selectOption("ship-at-work");
    await page.getByLabel("Who would pay").selectOption("self");
    await page.getByLabel("Your email").fill("priya@example.com");
    // The blank shows the chosen phrase, so the sentence reads back as written.
    await expect(
      page.locator('span[aria-hidden="true"]', { hasText: "cloud, DevOps or SRE" })
    ).toBeVisible();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Count me in, Priya" }).click();

    await expect(page.getByText("You're on the list, Priya.")).toBeVisible();
    expect(body).toMatchObject({
      name: "Priya Raman",
      email: "priya@example.com",
      role: "cloud-devops",
      experience: "6-10",
      motivation: "ship-at-work",
      payer: "self",
      consent: true,
    });
  });

  test("free demo link opens the LMS demo in a new tab", async ({ page }) => {
    const demo = page.getByRole("link", { name: /free demo class/ });
    await expect(demo).toHaveAttribute("href", /learning\.intelliforge\.tech\/demo/);
    await expect(demo).toHaveAttribute("target", "_blank");
  });

  test("curriculum lists the six sprints and links to them", async ({ page }) => {
    await page.getByRole("link", { name: "Curriculum" }).click();
    const section = page.locator("#curriculum");
    await expect(section).toBeInViewport();
    await expect(section.locator("li")).toHaveCount(6);
    await expect(section.getByText("Chatbot + RAG")).toBeVisible();
    await expect(section.getByText("Launch & Demo Day")).toBeVisible();
    await expect(section.getByText(/₹4,999 per sprint/)).toBeVisible();
    await expect(section.getByText(/₹49,999|₹74,999|₹12,999/)).toHaveCount(0);
    await expect(section.getByRole("link", { name: "See all six sprints" })).toHaveAttribute(
      "href",
      "/sprint/all"
    );
  });

  test("founder is named", async ({ page }) => {
    await expect(page.getByText(/Girish Hiremath, founder & principal engineer/)).toBeVisible();
  });

  test("testimonials come only from verified submissions", async ({ page }) => {
    // The old hand-entered quotes are gone; the section shows approved,
    // sign-in-verified submissions and is absent until there is one.
    await expect(page.getByText("Harish Hooli")).toHaveCount(0);
    const section = page.locator("#testimonials");
    if ((await section.count()) === 0) return;
    await section.scrollIntoViewIfNeeded();
    const cards = section.locator("article");
    const n = await cards.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      await expect(cards.nth(i).getByText(/(Google|LinkedIn) verified/)).toBeVisible();
    }
    await expect(section.getByRole("link", { name: /Read all testimonials/ })).toHaveAttribute(
      "href",
      "/testimonials"
    );
  });

  test("FAQ answers open in place", async ({ page }) => {
    const faq = page.locator("#faq");
    await faq.getByText("What's the refund policy?").click();
    await expect(faq.getByText(/refundable in full until its first class/)).toBeVisible();
  });

  test("footer carries contact and funnel links", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByText("© 2026 IntelliForge AI")).toBeVisible();
    await expect(footer.getByText("alerts@intelliforge.tech")).toBeVisible();
    await expect(footer.getByRole("link", { name: "Graduate wins" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Learning Platform" })).toHaveAttribute(
      "href",
      "https://learning.intelliforge.tech"
    );
    await expect(footer.getByRole("link", { name: /IntelliForge AI main site/ })).toHaveAttribute(
      "href",
      "https://www.intelliforge.tech"
    );
    await expect(footer.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact"
    );
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
