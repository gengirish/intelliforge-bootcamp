import { test, expect } from "@playwright/test";

test.describe("Interactions & Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("header becomes blurred on scroll", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(800);
    const header = page.locator("header");
    const classes = await header.getAttribute("class");
    expect(classes).toContain("backdrop-blur");
  });

  test("nav links scroll to correct sections", async ({ page }) => {
    await page.getByRole("link", { name: "Curriculum" }).first().click();
    await page.waitForTimeout(800);
    const section = page.locator("#curriculum");
    await expect(section).toBeInViewport();
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

    const vibeCodingQ = page.getByText("What is Vibe Coding?");
    await vibeCodingQ.click();
    await page.waitForTimeout(400);
    await expect(page.getByText("Vibe Coding is the practice of using AI coding assistants")).toBeVisible();

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
    await page.waitForTimeout(1500);

    const scrollTop = await page.evaluate(() => window.scrollY);
    expect(scrollTop).toBeLessThan(200);
  });
});
