import { test, expect } from "@playwright/test";

test.describe("Responsive — Mobile (375x812)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("desktop nav is hidden on mobile", async ({ page }) => {
    const desktopNav = page.locator("header nav.hidden");
    await expect(desktopNav).not.toBeVisible();
  });

  test("mobile menu toggle works", async ({ page }) => {
    const menuButton = page.getByRole("button", { name: /open menu/i });
    await expect(menuButton).toBeVisible();

    await menuButton.click();
    await page.waitForTimeout(400);

    await expect(page.locator("header nav").last().getByText("Curriculum")).toBeVisible();
    await expect(page.locator("header nav").last().getByText("Pricing")).toBeVisible();

    const closeButton = page.getByRole("button", { name: /close menu/i });
    await closeButton.click();
    await page.waitForTimeout(400);
  });

  test("hero stacks vertically on mobile", async ({ page }) => {
    await expect(page.getByText("Ship proof they can click.")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Join the Cohort 2 waitlist/ }).first()
    ).toBeVisible();
  });

  test("pricing cards stack on mobile", async ({ page }) => {
    const section = page.locator("#pricing");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText("₹4,999", { exact: true })).toBeVisible();
    await expect(section.getByText("₹29,994", { exact: true })).toBeVisible();
  });
});

test.describe("Responsive — Tablet (768x1024)", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test("page loads and all major sections visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByText("Ship proof they can click.")).toBeVisible();
    await expect(page.getByText("12 Weeks. Six Sprints. One Shipped Product.")).toBeVisible();
    await expect(page.getByRole("heading", { name: /₹4,999 per sprint/ })).toBeVisible();
  });
});

test.describe("Responsive — Desktop (1440x900)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("desktop nav is visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const navLink = page.locator("header").getByRole("link", { name: "Curriculum" });
    await expect(navLink).toBeVisible();
  });

  test("build-alongside cards in grid layout", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#build-alongside");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("link", { name: /LocalFlash/ })).toBeVisible();
    await expect(section.getByRole("link", { name: /ForgeAhead/ })).toBeVisible();
  });
});
