import { test, expect, type Page } from "@playwright/test";

/**
 * The CCAR-F prep hub: /claude, /claude/quiz, /claude/review, /claude/foundations.
 * Everything here is static content plus client state, so none of it needs a
 * database or an external service.
 */

const DISCLAIMER_PATTERN = /not affiliated with, sponsored by, or endorsed by Anthropic/i;

type BankQuestion = {
  id: string;
  domain: number;
  stem: string;
  options: Record<string, string>;
  answer: string;
  explanation: string;
  distractors: Record<string, string>;
  docUrl: string;
};

async function fetchBank(page: Page): Promise<BankQuestion[]> {
  const response = await page.request.get("/claude/quiz/questions.json");
  expect(response.status()).toBe(200);
  return (await response.json()) as BankQuestion[];
}

test.describe("CCAR-F hub — routes", () => {
  const routes = [
    { path: "/claude", heading: /Everything we build and write about/i },
    { path: "/claude/quiz", heading: /Free CCAR-F mock exam/i },
    { path: "/claude/review", heading: /question bank/i },
    { path: "/claude/foundations", heading: /Claude Certified Architect: Foundations/i },
  ];

  for (const route of routes) {
    test(`GET ${route.path} renders its heading and the disclaimer`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);

      await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
      await expect(page.getByText(DISCLAIMER_PATTERN).first()).toBeVisible();
    });
  }

  test("hub links through to the quiz, review, and guide", async ({ page }) => {
    await page.goto("/claude");
    await expect(page.getByRole("link", { name: /Start the free mock exam/i })).toHaveAttribute(
      "href",
      "/claude/quiz"
    );
    await expect(page.getByRole("link", { name: /Read the guide/i })).toHaveAttribute(
      "href",
      "/claude/foundations"
    );
  });
});

test.describe("CCAR-F question bank", () => {
  test("every question is well-formed and scoreable", async ({ page }) => {
    const bank = await fetchBank(page);
    expect(bank.length).toBeGreaterThan(0);

    const ids = new Set<string>();
    const domains = new Set<number>();

    for (const question of bank) {
      expect(ids.has(question.id), `duplicate id ${question.id}`).toBe(false);
      ids.add(question.id);
      domains.add(question.domain);

      expect(Object.keys(question.options).sort()).toEqual(["A", "B", "C", "D"]);
      expect(question.options[question.answer], `${question.id} answer not in options`).toBeTruthy();
      expect(question.explanation.length).toBeGreaterThan(0);
      // The correct option is never also explained as a distractor.
      expect(question.distractors[question.answer]).toBeUndefined();
      expect(question.docUrl).toMatch(/^https:\/\//);
    }

    // Every domain is represented, so a per-domain score is always meaningful.
    expect([...domains].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  test("the bank stays weighted like the blueprint", async ({ page }) => {
    const bank = await fetchBank(page);
    const weights: Record<number, number> = { 1: 27, 2: 18, 3: 20, 4: 20, 5: 15 };

    for (const [domain, weight] of Object.entries(weights)) {
      const share =
        (bank.filter((q) => q.domain === Number(domain)).length / bank.length) * 100;
      // Within 3 points of the blueprint, so a mock mirrors the real domain mix.
      expect(Math.abs(share - weight), `domain ${domain} is ${share.toFixed(1)}%`).toBeLessThanOrEqual(3);
    }
  });
});

test.describe("CCAR-F practice mode", () => {
  test("answering reveals the explanation and locks the question", async ({ page }) => {
    await page.goto("/claude/quiz");

    await page.getByRole("button", { name: "All domains" }).click();

    const options = page.getByRole("radio");
    await expect(options).toHaveCount(4);

    await options.first().click();

    await expect(page.getByText(/Correct answer:/i)).toBeVisible();
    await expect(page.getByText(/Why not/i).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Read the documentation/i })).toBeVisible();

    // Once answered, the options are inert.
    for (const option of await options.all()) {
      await expect(option).toBeDisabled();
    }
  });

  test("a domain drill only serves that domain", async ({ page }) => {
    await page.goto("/claude/quiz");
    await page.getByRole("button", { name: /^D2 ·/ }).click();

    await expect(page.getByText(/Practice · Tool Design/i)).toBeVisible();
    await expect(page.getByText(/^Domain 2 ·/)).toBeVisible();
  });
});

test.describe("CCAR-F exam mode", () => {
  test("runs a timed attempt through to a scored result", async ({ page }) => {
    page.on("dialog", (dialog) => dialog.accept());

    const bank = await fetchBank(page);
    await page.goto("/claude/quiz");
    await page.getByRole("button", { name: /Start the mock exam/i }).click();

    // Timer is showing and the navigator covers the whole attempt.
    await expect(page.getByText(/^\d{1,2}:\d{2}(:\d{2})?$/)).toBeVisible();
    const navigator = page.getByLabel("Question navigator");
    await expect(navigator.getByRole("button")).toHaveCount(bank.length);

    // Answering marks the navigator; flagging is reflected in the button label.
    await page.getByRole("radio").first().click();
    await expect(page.getByLabel("Question 1, answered")).toBeVisible();

    await page.getByRole("button", { name: /Flag/ }).click();
    await expect(page.getByRole("button", { name: "★ Flagged" })).toBeVisible();

    // Jump to the end and submit with questions left blank.
    await navigator.getByRole("button").last().click();
    await page.getByRole("button", { name: /Review & submit/i }).click();

    await expect(page.getByRole("heading", { name: /Score by domain/i })).toBeVisible();
    await expect(page.getByText(/of \d+ correct/)).toBeVisible();
    await expect(page.getByText(/passing analogue/i)).toBeVisible();
  });

  test("an unfinished attempt is offered back after a reload", async ({ page }) => {
    await page.goto("/claude/quiz");
    await page.getByRole("button", { name: /Start the mock exam/i }).click();
    await page.getByRole("radio").first().click();

    await page.reload();

    await expect(page.getByRole("heading", { name: /Resume your mock exam/i })).toBeVisible();
    await page.getByRole("button", { name: "Resume" }).click();
    await expect(page.getByText(/^\d{1,2}:\d{2}(:\d{2})?$/)).toBeVisible();
  });
});

test.describe("CCAR-F review library", () => {
  test("server-renders every question with its answer", async ({ page }) => {
    const bank = await fetchBank(page);
    await page.goto("/claude/review");

    await expect(page.locator("article[id^='D']")).toHaveCount(bank.length);
    await expect(page.getByText(/Correct answer:/i).first()).toBeVisible();
  });

  test("test mode hides the answers", async ({ page }) => {
    await page.goto("/claude/review");

    const firstAnswer = page.locator("[data-ccarf-answer]").first();
    await expect(firstAnswer).toBeVisible();

    await page.getByLabel(/Test mode/i).check();
    await expect(firstAnswer).toBeHidden();

    await page.getByLabel(/Test mode/i).uncheck();
    await expect(firstAnswer).toBeVisible();
  });
});
