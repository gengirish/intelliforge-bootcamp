/**
 * Shared rules for learner testimonials: limits, consent wording, and input
 * validation. Imported by both the submit form and the server action, so the
 * browser and the server enforce the same limits.
 */

export const TESTIMONIAL_LIMITS = {
  headlineMax: 120,
  quoteMin: 40,
  quoteMax: 600,
  transcriptMax: 4000,
  /** Recording stops itself here; uploads longer than this are still accepted
   *  by size, but the form warns. */
  mediaSeconds: 120,
  audioBytes: 25 * 1024 * 1024,
  videoBytes: 150 * 1024 * 1024,
} as const;

export const AUDIO_TYPES = ["audio/webm", "audio/ogg", "audio/mp4", "audio/mpeg", "audio/wav", "audio/x-m4a"];
export const VIDEO_TYPES = ["video/webm", "video/mp4", "video/quicktime"];

/** Bump the version whenever the wording changes; each row stores the one it agreed to. */
export const CONSENT_VERSION = "2026-11-08";
export const CONSENT_TEXT =
  "I agree that IntelliForge may publish this testimonial, with my name, photo, headline, and any audio or video I add, on its website and marketing. I can ask for it to be removed at any time by emailing learning@intelliforge.tech.";

export type TestimonialProvider = "google" | "linkedin";

export const PROVIDER_LABEL: Record<TestimonialProvider, string> = {
  google: "Google",
  linkedin: "LinkedIn",
};

/** Clerk reports providers as "oauth_google", "oauth_linkedin_oidc", or "google". */
export function normalizeProvider(raw: string | null | undefined): TestimonialProvider | null {
  const p = (raw ?? "").toLowerCase().replace(/^oauth_/, "");
  if (p === "google") return "google";
  if (p === "linkedin" || p === "linkedin_oidc") return "linkedin";
  return null;
}

export type MediaKind = "NONE" | "AUDIO" | "VIDEO";

export function mediaKindFor(contentType: string): MediaKind | null {
  const base = contentType.split(";")[0].trim().toLowerCase();
  if (AUDIO_TYPES.includes(base)) return "AUDIO";
  if (VIDEO_TYPES.includes(base)) return "VIDEO";
  return null;
}

/** Accepts only a linkedin.com/in/ profile URL and returns it in canonical form. */
export function normalizeLinkedinUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    const host = url.hostname.replace(/^www\./, "").replace(/^[a-z]{2}\./, "");
    const match = url.pathname.match(/^\/in\/([A-Za-z0-9\-_%]+)\/?$/);
    if (host !== "linkedin.com" || !match) return null;
    return `https://www.linkedin.com/in/${match[1]}/`;
  } catch {
    return null;
  }
}

export interface TestimonialInput {
  headline: string;
  quote: string;
  linkedinUrl: string | null;
  transcript: string | null;
  mediaUrl: string | null;
  provider: TestimonialProvider | null;
  consent: boolean;
}

export type FieldErrors = Partial<Record<keyof TestimonialInput, string>>;

export function readTestimonialForm(form: FormData): TestimonialInput {
  const text = (k: string) => String(form.get(k) ?? "").trim();
  return {
    headline: text("headline"),
    quote: text("quote"),
    linkedinUrl: text("linkedinUrl") || null,
    transcript: text("transcript") || null,
    mediaUrl: text("mediaUrl") || null,
    provider: normalizeProvider(text("provider")),
    consent: form.get("consent") === "on",
  };
}

export function validateTestimonial(input: TestimonialInput): FieldErrors {
  const L = TESTIMONIAL_LIMITS;
  const errors: FieldErrors = {};
  if (!input.headline) errors.headline = "Add your role and company.";
  else if (input.headline.length > L.headlineMax)
    errors.headline = `Keep it under ${L.headlineMax} characters.`;

  if (input.quote.length < L.quoteMin)
    errors.quote = `Write at least ${L.quoteMin} characters.`;
  else if (input.quote.length > L.quoteMax)
    errors.quote = `Keep it under ${L.quoteMax} characters.`;

  if (input.linkedinUrl && !normalizeLinkedinUrl(input.linkedinUrl))
    errors.linkedinUrl = "Use your profile link, like linkedin.com/in/your-name.";

  if (input.transcript && input.transcript.length > L.transcriptMax)
    errors.transcript = `Keep it under ${L.transcriptMax} characters.`;

  if (!input.consent) errors.consent = "We need your permission to publish it.";
  return errors;
}

/** Blob pathname prefix for a user's uploads, so the server can check ownership. */
export function mediaPrefixFor(clerkUserId: string): string {
  return `testimonials/${clerkUserId.replace(/[^A-Za-z0-9_-]/g, "")}/`;
}
