import { test, expect } from "@playwright/test";
import {
  normalizeLinkedinUrl,
  normalizeProvider,
  readTestimonialForm,
  validateTestimonial,
  mediaKindFor,
  mediaPrefixFor,
} from "../../src/lib/testimonials";

test.describe("Testimonial rules", () => {
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
    await expect(page.getByText(/signing in with Google or\s+LinkedIn/)).toBeVisible();
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
