import { test, expect } from "@playwright/test";

/**
 * Class links are for paid learners only, and tests run signed out, so these
 * routes must send the request to sign-in without revealing the destination.
 */
const GATED_ROUTES = ["/zoom", "/whatsapp", "/sprint/whatsapp"];

test.describe("Class link gate", () => {
  for (const route of GATED_ROUTES) {
    test(`GET ${route} sends signed-out visitors to sign-in`, async ({
      request,
    }) => {
      const response = await request.get(route, { maxRedirects: 0 });
      expect(response.status()).toBe(302);

      const location = new URL(response.headers().location);
      expect(location.pathname).toBe("/sign-in");
      expect(location.searchParams.get("redirect_url")).toBe(route);
      expect(response.headers()["cache-control"]).toContain("no-store");
    });
  }

  test("access page explains who the links are for", async ({ page }) => {
    await page.goto("/cohort-access");
    await expect(
      page.getByRole("heading", { name: "This link is for enrolled learners" })
    ).toBeVisible();
  });

  test("public footer does not link to class access", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Live Zoom Session" })).toHaveCount(0);
    await expect(footer.getByRole("link", { name: "Join WhatsApp Group" })).toHaveCount(0);
  });
});

test.describe("robots.txt", () => {
  test("is served, points at the sitemap, and excludes class links", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain("Sitemap: https://upskill.intelliforge.tech/sitemap.xml");
    expect(body).toContain("Disallow: /zoom");
  });
});

test.describe("Floating widgets", () => {
  test.use({ viewport: { width: 632, height: 900 } });

  // The real widget loads from another origin and would add a second launcher.
  test.beforeEach(async ({ page }) => {
    await page.route("**/embed.js", (route) => route.abort());
  });

  /** Stands in for the externally hosted launcher, so this test doesn't need the network. */
  async function addChatLauncher(page: import("@playwright/test").Page) {
    await page.evaluate(() => {
      const launcher = document.createElement("button");
      launcher.id = "if-chat-launcher";
      launcher.style.cssText = "position:fixed;bottom:24px;right:24px;width:56px;height:56px";
      document.body.appendChild(launcher);
    });
  }

  test("chat launcher clears the sticky CTA bar", async ({ page }) => {
    await page.goto("/");
    await addChatLauncher(page);

    const bar = await page.locator("[data-sticky-cta]").boundingBox();
    await expect
      .poll(async () => {
        const launcher = await page.locator("#if-chat-launcher").boundingBox();
        return launcher!.y + launcher!.height;
      })
      .toBeLessThanOrEqual(bar!.y);
  });

  test("WhatsApp button clears the sticky CTA bar and shows no tooltip", async ({
    page,
  }) => {
    await page.goto("/");
    const button = page.getByRole("link", { name: "Chat on WhatsApp" });
    await expect(button).toBeVisible({ timeout: 15_000 });

    const bar = await page.locator("[data-sticky-cta]").boundingBox();
    const box = await button.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(bar!.y);

    await page.waitForTimeout(4_500);
    await expect(page.getByText("Have questions?", { exact: true }).first()).toBeHidden();
  });

  test("chat launcher is hidden on the mock exam", async ({ page }) => {
    await page.goto("/claude/quiz");
    await addChatLauncher(page);
    await expect(page.locator("#if-chat-launcher")).toBeHidden();
  });
});

test.describe("Mobile menu", () => {
  test.use({ viewport: { width: 632, height: 900 } });

  test("closes on Escape and returns focus to the toggle", async ({ page }) => {
    await page.goto("/");
    const open = page.getByRole("button", { name: "Open menu" });
    await open.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    await page.keyboard.press("Escape");
    await expect(open).toHaveAttribute("aria-expanded", "false");
    await expect(open).toBeFocused();
  });
});

test.describe("POST /api/contact validation", () => {
  const valid = { name: "Test", email: "test@example.com", message: "Hello" };

  const invalid: [string, Record<string, string>, string][] = [
    ["an email with no domain dot", { email: "a@b" }, "Invalid email"],
    ["letters in the phone", { phone: "abc!!" }, "Invalid phone"],
    ["an overlong name", { name: "x".repeat(121) }, "Name is too long"],
    ["an overlong message", { message: "x".repeat(2001) }, "Message is too long"],
  ];

  for (const [label, override, error] of invalid) {
    test(`rejects ${label}`, async ({ request }) => {
      const response = await request.post("/api/contact", {
        data: { ...valid, ...override },
      });
      expect(response.status()).toBe(400);
      expect((await response.json()).error).toContain(error);
    });
  }

  test("form inputs carry limits and autocomplete", async ({ page }) => {
    await page.goto("/");
    const name = page.getByLabel("Name *");
    await expect(name).toHaveAttribute("autocomplete", "name");
    await expect(name).toHaveAttribute("maxlength", "120");
    await expect(page.getByLabel("Email *")).toHaveAttribute("autocomplete", "email");
    await expect(page.getByLabel("Phone (optional)")).toHaveAttribute("autocomplete", "tel");
    await expect(page.getByLabel("Message *")).toHaveAttribute("maxlength", "2000");
  });
});
