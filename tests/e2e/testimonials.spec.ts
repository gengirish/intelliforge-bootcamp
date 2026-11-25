import { test, expect } from "@playwright/test";
import {
  displayName,
  formatPaymentEvidence,
  readPaymentEvidence,
  validatePaymentEvidence,
  normalizeLinkedinUrl,
  normalizeProvider,
  readTestimonialForm,
  validateTestimonial,
  mediaKindFor,
  mediaPrefixFor,
} from "../../src/lib/testimonials";

test.describe("Testimonial rules", () => {
  test("capitalises all-lowercase names for display only", () => {
    expect(displayName("prasad inchal")).toBe("Prasad Inchal");
    expect(displayName("anne-marie o'neil")).toBe("Anne-Marie O'Neil");
    expect(displayName("Ravi Bandakkanavar")).toBe("Ravi Bandakkanavar");
    expect(displayName("Jan van der Berg")).toBe("Jan van der Berg");
  });

  test("validates off-platform payment evidence before an admin can verify a learner", () => {
    const programs = ["12-week Bootcamp", "2-Week AI Sprint — Cohort 1"];
    const today = new Date("2026-11-25T10:00:00Z");
    const form = new FormData();
    form.set("method", "UPI");
    form.set("reference", " 4123 4567 8901 ");
    form.set("paidOn", "2026-06-10");
    form.set("program", "2-Week AI Sprint — Cohort 1");
    const input = readPaymentEvidence(form);
    expect(input.reference).toBe("412345678901");
    expect(validatePaymentEvidence(input, { programs, today })).toEqual({});
    expect(formatPaymentEvidence(input)).toBe("UPI · ref 412345678901 · received 2026-06-10");

    const bad = validatePaymentEvidence(
      { method: "Cash", reference: "12-34", paidOn: "2026-12-01", program: "Sprint 9" },
      { programs, today }
    );
    expect(Object.keys(bad).sort()).toEqual(["method", "paidOn", "program", "reference"]);
  });

  test("maps Clerk provider ids to Google or LinkedIn only", () => {
    expect(normalizeProvider("oauth_google")).toBe("google");
    expect(normalizeProvider("google")).toBe("google");
    expect(normalizeProvider("oauth_linkedin_oidc")).toBe("linkedin");
    expect(normalizeProvider("oauth_github")).toBeNull();
    expect(normalizeProvider(undefined)).toBeNull();
  });

  test("accepts only linkedin.com/in/ profile URLs", () => {
    expect(normalizeLinkedinUrl("linkedin.com/in/jane-doe")).toBe("https://www.linkedin.com/in/jane-doe/");
    expect(normalizeLinkedinUrl("https://in.linkedin.com/in/jane-doe/")).toBe("https://www.linkedin.com/in/jane-doe/");
    expect(normalizeLinkedinUrl("https://www.linkedin.com/company/acme")).toBeNull();
    expect(normalizeLinkedinUrl("https://evil.example/in/jane")).toBeNull();
    expect(normalizeLinkedinUrl("https://linkedin.com.evil.example/in/jane")).toBeNull();
  });

  test("classifies media types and scopes upload paths per user", () => {
    expect(mediaKindFor("video/webm;codecs=vp9,opus")).toBe("VIDEO");
    expect(mediaKindFor("audio/mp4")).toBe("AUDIO");
    expect(mediaKindFor("image/png")).toBeNull();
    expect(mediaPrefixFor("user_2abc/../x")).toBe("testimonials/user_2abcx/");
  });

  test("requires a headline, a real quote, and consent", () => {
    const form = new FormData();
    form.set("headline", "");
    form.set("quote", "Too short");
    form.set("linkedinUrl", "not a url");
    const errors = validateTestimonial(readTestimonialForm(form));
    expect(Object.keys(errors).sort()).toEqual(["consent", "headline", "linkedinUrl", "quote"]);

    form.set("headline", "Data Engineer, Infosys");
    form.set("quote", "I shipped a RAG service to production in week two and my team now uses it daily.");
    form.set("linkedinUrl", "");
    form.set("consent", "on");
    expect(validateTestimonial(readTestimonialForm(form))).toEqual({});
  });
});

test.describe("Testimonial pages", () => {
  test("public page explains how testimonials are verified", async ({ page }) => {
    await page.goto("/testimonials");
    await expect(page.getByRole("heading", { level: 1, name: "What learners say" })).toBeVisible();
    await expect(page.getByText(/own Google or LinkedIn account/)).toBeVisible();
    await expect(page.getByText("Their words, unedited")).toBeVisible();
    await expect(page.getByRole("link", { name: /Join the Cohort 2 waitlist/ })).toHaveAttribute(
      "href",
      "/waitlist"
    );
    await expect(page.getByRole("link", { name: "Share your testimonial" })).toHaveAttribute(
      "href",
      "/testimonials/submit"
    );
  });

  test("submit page renders without Clerk under the E2E bypass", async ({ page }) => {
    await page.goto("/testimonials/submit");
    await expect(page.getByRole("heading", { name: "Share your testimonial" })).toBeVisible();
  });

  test("upload tokens are refused to signed-out visitors", async ({ request }) => {
    const res = await request.post("/api/testimonials/upload", {
      data: { type: "blob.generate-client-token", payload: { pathname: "testimonials/x/video.webm", multipart: false, clientPayload: null } },
    });
    // 503 when no Blob store is connected, 401 when one is.
    expect([401, 503]).toContain(res.status());
  });
});
