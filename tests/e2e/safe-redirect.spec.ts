import { test, expect } from "@playwright/test";
import { safeRedirectPath } from "../../src/lib/safe-redirect";

const SITE = ["https://upskill.intelliforge.tech"];

test.describe("Sign-in redirect_url", () => {
  test("keeps relative paths", () => {
    expect(safeRedirectPath("/testimonials/submit", SITE)).toBe("/testimonials/submit");
    expect(safeRedirectPath("/sprint?x=1#top", SITE)).toBe("/sprint?x=1#top");
  });

  test("accepts absolute URLs on the site, as Clerk sends them after OAuth", () => {
    expect(safeRedirectPath("https://upskill.intelliforge.tech/testimonials/submit", SITE)).toBe(
      "/testimonials/submit"
    );
  });

  test("refuses other origins and protocol-relative paths", () => {
    expect(safeRedirectPath("https://evil.example/testimonials/submit", SITE)).toBeNull();
    expect(safeRedirectPath("https://upskill.intelliforge.tech.evil.example/x", SITE)).toBeNull();
    expect(safeRedirectPath("http://upskill.intelliforge.tech/x", SITE)).toBeNull();
    expect(safeRedirectPath("//evil.example/x", SITE)).toBeNull();
    expect(safeRedirectPath("/\\evil.example", SITE)).toBeNull();
    expect(safeRedirectPath("javascript:alert(1)", SITE)).toBeNull();
    expect(safeRedirectPath("", SITE)).toBeNull();
    expect(safeRedirectPath(undefined, SITE)).toBeNull();
  });
});
