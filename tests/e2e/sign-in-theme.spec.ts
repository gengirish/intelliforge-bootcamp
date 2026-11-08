import { test, expect, type Locator } from "@playwright/test";

/**
 * The local suite runs with Clerk bypassed, so /sign-in renders a stub and the
 * real widget never loads. Point CLERK_SIGN_IN_URL at a deployment with Clerk
 * keys (a preview, or https://upskill.intelliforge.tech/sign-in) to run this:
 *
 *   CLERK_SIGN_IN_URL=https://upskill.intelliforge.tech/sign-in npx playwright test sign-in-theme
 *
 * Guards against the regression where Clerk's light-theme defaults left the
 * social buttons black-on-navy.
 */
const SIGN_IN_URL = process.env.CLERK_SIGN_IN_URL;

type Rgba = [number, number, number, number];

function parseColor(value: string): Rgba {
  const rgb = value.match(/rgba?\(([^)]+)\)/);
  const srgb = value.match(/color\(srgb ([^)]+)\)/);
  const parts = (rgb?.[1] ?? srgb?.[1])
    ?.split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  if (!parts || parts.length < 3 || parts.some(Number.isNaN)) {
    throw new Error(`Unparseable colour: ${value}`);
  }
  const scale = srgb ? 255 : 1;
  return [parts[0] * scale, parts[1] * scale, parts[2] * scale, parts[3] ?? 1];
}

function luminance([r, g, b]: Rgba): number {
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** Contrast of `fg` composited over an opaque `bg`. */
function contrast(fg: Rgba, bg: Rgba): number {
  const a = fg[3];
  const blended: Rgba = [
    fg[0] * a + bg[0] * (1 - a),
    fg[1] * a + bg[1] * (1 - a),
    fg[2] * a + bg[2] * (1 - a),
    1,
  ];
  const [hi, lo] = [luminance(blended), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Text colour vs the first non-transparent background behind the button. */
async function textContrast(button: Locator) {
  const { fg, bg } = await button.evaluate((el) => {
    const label = el.querySelector(".cl-socialButtonsBlockButtonText") ?? el;
    let node: Element | null = el;
    let bg = "rgb(255, 255, 255)";
    while (node) {
      const c = getComputedStyle(node).backgroundColor;
      if (c && c !== "transparent" && !/,\s*0\)$|\/\s*0\)$/.test(c)) {
        bg = c;
        break;
      }
      node = node.parentElement;
    }
    return { fg: getComputedStyle(label).color, bg };
  });
  return contrast(parseColor(fg), parseColor(bg));
}

test.describe("Clerk sign-in theme", () => {
  test.skip(!SIGN_IN_URL, "CLERK_SIGN_IN_URL not set (local suite bypasses Clerk)");

  test("GitHub and Google buttons are visible and readable", async ({ page }) => {
    await page.goto(SIGN_IN_URL!);
    const card = page.locator(".cl-card").first();
    await expect(card).toBeVisible({ timeout: 20_000 });

    for (const provider of ["GitHub", "Google"]) {
      const button = page.getByRole("button", { name: new RegExp(provider, "i") });
      await expect(button).toBeVisible();
      // WCAG AA for normal-size text.
      expect(await textContrast(button)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
