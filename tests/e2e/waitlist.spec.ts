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

  const joined = { token: "entry-1", referralCode: "abcd2345" };

  async function fillForm(
    page: import("@playwright/test").Page,
    path = "/waitlist",
    payer = "self"
  ) {
    await page.goto(path);
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Test Learner");
    await page.getByRole("textbox", { name: "Email", exact: true }).fill("learner@example.com");
    await page.getByLabel("What's your current role?").selectOption("software");
    await page.getByLabel("Years of work experience").selectOption("6-10");
    await page.getByLabel("Who would pay for the course?").selectOption(payer);
    await page.getByLabel(/Contact me about Cohort 2/).check();
    await page.getByRole("button", { name: "Join the waitlist" }).click();
  }

  test("page states the price above the form and marks required fields", async ({
    page,
  }) => {
    await page.goto("/waitlist");
    await expect(page.getByText("₹4,999 per 2-week sprint.")).toBeVisible();
    await expect(page.getByText(/Joining the waitlist is free/)).toBeVisible();
    await expect(page.getByText(/Fields marked \* are required/)).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Name", exact: true })).toHaveAttribute("required", "");
    // Motivation moved to after signup.
    await expect(page.getByLabel(/what do you most want/i)).toHaveCount(0);
  });

  test("form shows confirmation once the entry is saved", async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route("**/api/waitlist", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ json: { success: true, data: joined } });
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
      role: "software",
      experience: "6-10",
      payer: "self",
      consent: true,
    });
  });

  test("success screen offers a personal share link", async ({ page }) => {
    await page.route("**/api/waitlist", (route) =>
      route.fulfill({ json: { success: true, data: joined } })
    );
    await fillForm(page);
    const status = page.getByRole("status");
    await expect(status.getByText("Share your spot")).toBeVisible();

    const linkedin = status.getByRole("link", { name: "Post on LinkedIn" });
    const href = (await linkedin.getAttribute("href"))!;
    expect(href).toMatch(/^https:\/\/www\.linkedin\.com\/feed\/\?shareActive=true&text=/);
    const text = new URL(href).searchParams.get("text")!;
    expect(text).toContain("ref=abcd2345");
    expect(text).toContain("utm_source=linkedin");
    expect(text).toContain("utm_medium=referral");

    await expect(
      status.getByRole("link", { name: "Share on WhatsApp" })
    ).toHaveAttribute("href", /^https:\/\/wa\.me\/\?text=.*ref%3Dabcd2345/);
    await expect(status.getByText(/\/waitlist\?ref=abcd2345/)).toBeVisible();
    // Not an employer payer: no sponsorship note.
    await expect(status.getByRole("link", { name: "Open the employer one-pager" })).toHaveCount(0);
  });

  test("post-signup question saves the motivation", async ({ page }) => {
    let patch: Record<string, unknown> = {};
    await page.route("**/api/waitlist", async (route) => {
      if (route.request().method() === "PATCH") {
        patch = route.request().postDataJSON();
        await route.fulfill({ json: { success: true, data: null } });
      } else {
        await route.fulfill({ json: { success: true, data: joined } });
      }
    });
    await fillForm(page);
    await page.getByLabel(/what do you most want from this/i).selectOption("ship-at-work");
    await page.getByRole("button", { name: "Save answer" }).click();
    await expect(page.getByText(/Thanks, that helps us plan/)).toBeVisible();
    expect(patch).toEqual({ token: "entry-1", motivation: "ship-at-work" });
  });

  test("employer payers are pointed at the sponsorship one-pager", async ({ page }) => {
    await page.route("**/api/waitlist", (route) =>
      route.fulfill({ json: { success: true, data: joined } })
    );
    await fillForm(page, "/waitlist", "employer");
    await page.getByRole("status").getByRole("link", { name: "Open the employer one-pager" }).click();
    await expect(page).toHaveURL(/\/sponsor$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Sponsor an engineer");
    await expect(page.getByText("₹4,999 per sprint")).toBeVisible();
    await expect(page.getByText(/₹29,994 for all 6/)).toBeVisible();
    await expect(page.getByRole("heading", { name: /Sprint 6:/ })).toBeVisible();
  });

  test("a referral link's code is sent with the signup", async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route("**/api/waitlist", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ json: { success: true, data: joined } });
    });
    await fillForm(page, "/waitlist?ref=wxyz6789&utm_medium=referral");
    await expect(page.getByRole("status")).toBeVisible();
    expect(body.attribution).toMatchObject({ ref: "wxyz6789", utmMedium: "referral" });
  });

  test("API rejects an invalid follow-up answer", async ({ request }) => {
    const res = await request.patch("/api/waitlist", {
      data: { token: "x", motivation: "nope" },
    });
    expect(res.status()).toBe(400);
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
