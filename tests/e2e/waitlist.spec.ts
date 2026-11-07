import { test, expect } from "@playwright/test";

test.describe("Cohort 2 waitlist", () => {
  test("home banner announces Cohort 2 and links to the waitlist", async ({
    page,
  }) => {
    await page.goto("/");
    const banner = page.locator('[class*="z-[60]"]');
    await expect(banner.getByText(/Cohort 2 opens 5–6 Dec/)).toBeVisible();
    await banner.getByRole("link", { name: "Join the waitlist →" }).click();
    await expect(page).toHaveURL(/\/waitlist$/);
    await expect(
      page.getByRole("heading", { name: "Join the Cohort 2 waitlist" })
    ).toBeVisible();
  });

  test("sprint page announces Cohort 2 dates", async ({ page }) => {
    await page.goto("/sprint");
    await expect(
      page.getByText(/Cohort 2 opens 5–6 Dec, first class 9 Jan 2027/)
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Join the waitlist →" })
    ).toHaveAttribute("href", "/waitlist");
  });

  async function fillForm(
    page: import("@playwright/test").Page,
    path = "/waitlist"
  ) {
    await page.goto(path);
    await page.getByLabel("Name", { exact: true }).fill("Test Learner");
    await page.getByLabel("Email", { exact: true }).fill("learner@example.com");
    await page
      .getByLabel("What do you most want from this?")
      .selectOption("ship-at-work");
    await page.getByLabel("What's your current role?").selectOption("software");
    await page.getByLabel("Years of work experience").selectOption("6-10");
    await page.getByLabel("Who would pay for the course?").selectOption("self");
    await page.getByLabel(/Contact me about Cohort 2/).check();
    await page.getByRole("button", { name: "Join the waitlist" }).click();
  }

  test("form shows confirmation once the entry is saved", async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route("**/api/waitlist", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ json: { success: true, data: null } });
    });
    await fillForm(page);
    const status = page.getByRole("status");
    await expect(status).toContainText("You're on the Cohort 2 waitlist");
    await expect(
      status.getByRole("link", { name: "Start the setup course" })
    ).toHaveAttribute(
      "href",
      "https://learning.intelliforge.tech/courses/fresher-prerequisite-setup"
    );
    await expect(
      status.getByRole("link", { name: "Chat on WhatsApp" })
    ).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=/);
    expect(body).toMatchObject({
      email: "learner@example.com",
      motivation: "ship-at-work",
      role: "software",
      experience: "6-10",
      payer: "self",
      consent: true,
    });
  });

  test("form sends the campaign that brought the visitor", async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route("**/api/waitlist", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ json: { success: true, data: null } });
    });
    await fillForm(
      page,
      "/waitlist?utm_source=linkedin&utm_medium=dm&utm_campaign=cohort2"
    );
    await expect(page.getByRole("status")).toBeVisible();
    expect(body.attribution).toMatchObject({
      utmSource: "linkedin",
      utmMedium: "dm",
      utmCampaign: "cohort2",
      landingPath: "/waitlist",
    });
  });

  test("form shows the server's error and can be retried", async ({ page }) => {
    await page.route("**/api/waitlist", (route) =>
      route.fulfill({
        status: 500,
        json: { success: false, error: "We couldn't save your place." },
      })
    );
    await fillForm(page);
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "We couldn't save your place"
    );
    await expect(
      page.getByRole("button", { name: "Join the waitlist" })
    ).toBeEnabled();
  });

  const invalidPayloads = {
    "missing consent": {
      name: "A",
      email: "a@example.com",
      motivation: "other",
      consent: false,
    },
    "invalid email": {
      name: "A",
      email: "nope",
      motivation: "other",
      consent: true,
    },
    "unknown motivation": {
      name: "A",
      email: "a@example.com",
      motivation: "x",
      consent: true,
    },
  };

  for (const [name, payload] of Object.entries(invalidPayloads)) {
    test(`API rejects ${name}`, async ({ request }) => {
      const res = await request.post("/api/waitlist", { data: payload });
      expect(res.status()).toBe(400);
      expect((await res.json()).success).toBe(false);
    });
  }

  test("API answers a filled honeypot with success", async ({ request }) => {
    const res = await request.post("/api/waitlist", {
      data: {
        name: "Bot",
        email: "bot@example.com",
        motivation: "other",
        consent: true,
        website: "spam.example",
      },
    });
    expect(res.status()).toBe(200);
  });
});
