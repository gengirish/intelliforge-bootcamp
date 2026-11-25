import { test, expect } from "@playwright/test";

/** The page body must never scroll sideways, even with the longest phrase chosen in every blank. */
async function expectNoSideScroll(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

for (const viewport of [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test.describe(`Responsive — ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    test("sentence and button fit the screen", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByRole("button", { name: "Count me in" })).toBeVisible();
      await expectNoSideScroll(page);

      await page.getByLabel("Your name").fill("Venkataraghavan Subramaniam");
      await page.getByLabel("What you work in").selectOption("non-engineering");
      await page.getByLabel("Years of work experience").selectOption("15+");
      await page.getByLabel("What you want from the course").selectOption("other");
      await page.getByLabel("Who would pay").selectOption("undecided");
      await page.getByLabel("Your email").fill("venkataraghavan.subramaniam@example.com");
      await expectNoSideScroll(page);
    });
  });
}
