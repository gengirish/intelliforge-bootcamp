import { test, expect } from "@playwright/test";

test.describe("Interactions & Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("header becomes blurred on scroll", async ({ page }) => {
    const header = page.locator("header");
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 400);
    }
    await expect(header).toHaveClass(/backdrop-blur/, { timeout: 5000 });
  });

  test("nav links scroll to correct sections", async ({ page }) => {
    // Sections below the fold are dynamic() imports. If they hydrate after the
    // smooth scroll starts, the layout shifts under it and #curriculum lands off
    // screen — so let the page settle before clicking rather than racing it.
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: "Curriculum" }).first().click();

    const section = page.locator("#curriculum");
    await expect(section).toBeInViewport({ timeout: 15000 });
  });

  test("curriculum accordion expands and collapses", async ({ page }) => {
    const section = page.locator("#curriculum");
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const week2 = page.getByText("RAG Pipelines & Vector Databases");
    await week2.click();
    await page.waitForTimeout(300);
    await expect(page.getByText("Embedding models & vector stores")).toBeVisible();

    await week2.click();
    await page.waitForTimeout(500);
  });

  test("FAQ accordion opens and closes items", async ({ page }) => {
    const section = page.locator("#faq");
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const buildAlongsideQ = page.getByText("What is build-alongside?");
    await buildAlongsideQ.click();
    await page.waitForTimeout(400);
    await expect(
      page.getByText("Top performers in the cohort get staffed")
    ).toBeVisible();

    const anotherQ = page.getByText("Do I need prior AI/ML experience?");
    await anotherQ.click();
    await page.waitForTimeout(300);
    await expect(page.getByText("basic Python programming")).toBeVisible();
  });

  test("scroll to top button works", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.getByRole("button", { name: /scroll to top/i }).click();

    // Smooth scrolling from the footer can take well over a fixed 1.5s wait;
    // poll until it settles instead of sampling once and hoping.
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 15000 })
      .toBeLessThan(200);
  });
});
