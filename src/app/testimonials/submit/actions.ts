"use server";

import { del, head } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { sendTestimonialNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import {
  CONSENT_VERSION,
  PROVIDER_LABEL,
  TESTIMONIAL_LIMITS,
  mediaKindFor,
  mediaPrefixFor,
  normalizeLinkedinUrl,
  readTestimonialForm,
  validateTestimonial,
  type FieldErrors,
  type MediaKind,
} from "@/lib/testimonials";
import {
  findPaidPrograms,
  getSubmitterIdentity,
  isTestimonialMediaConfigured,
} from "@/lib/testimonials-server";

export type SubmitState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: FieldErrors }
  | { status: "success" };

interface CheckedMedia {
  kind: MediaKind;
  url: string | null;
  pathname: string | null;
  contentType: string | null;
}

const NO_MEDIA: CheckedMedia = { kind: "NONE", url: null, pathname: null, contentType: null };

/** Confirms the uploaded file exists in our store, under this user's prefix, within limits. */
async function checkMedia(url: string, userId: string): Promise<CheckedMedia | string> {
  if (!isTestimonialMediaConfigured()) return "Media uploads are not enabled.";
  try {
    const blob = await head(url);
    if (!blob.pathname.startsWith(mediaPrefixFor(userId))) return "That recording isn't yours.";
    const kind = mediaKindFor(blob.contentType);
    if (!kind || kind === "NONE") return "That file type isn't supported.";
    const limit = kind === "AUDIO" ? TESTIMONIAL_LIMITS.audioBytes : TESTIMONIAL_LIMITS.videoBytes;
    if (blob.size > limit) return "That recording is too large.";
    return { kind, url: blob.url, pathname: blob.pathname, contentType: blob.contentType };
  } catch {
    return "We couldn't find your recording. Try uploading it again.";
  }
}

export async function submitTestimonial(_prev: SubmitState, form: FormData): Promise<SubmitState> {
  if (process.env.E2E_BYPASS_CLERK === "1") {
    return { status: "error", message: "Sign in to submit a testimonial." };
  }

  const identity = await getSubmitterIdentity();
  if (!identity) return { status: "error", message: "Sign in to submit a testimonial." };
  if (identity.accounts.length === 0) {
    return { status: "error", message: "Sign in with Google or LinkedIn to submit a testimonial." };
  }

  const input = readTestimonialForm(form);
  const fieldErrors = validateTestimonial(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Check the highlighted fields.", fieldErrors };
  }

  const account =
    identity.accounts.find((a) => a.provider === input.provider) ?? identity.accounts[0];

  const existing = await prisma.testimonial.findUnique({
    where: { clerkUserId: identity.userId },
    select: { id: true, mediaUrl: true, mediaPathname: true, mediaKind: true, mediaContentType: true },
  });

  let media: CheckedMedia = NO_MEDIA;
  if (input.mediaUrl) {
    if (existing?.mediaUrl === input.mediaUrl) {
      media = {
        kind: existing.mediaKind,
        url: existing.mediaUrl,
        pathname: existing.mediaPathname,
        contentType: existing.mediaContentType,
      };
    } else {
      const checked = await checkMedia(input.mediaUrl, identity.userId);
      if (typeof checked === "string") return { status: "error", message: checked };
      media = checked;
    }
  }

  const emails = [...new Set([...(account.email ? [account.email] : []), ...identity.verifiedEmails])];
  let programs: string[] = [];
  try {
    programs = await findPaidPrograms(identity.userId, emails);
  } catch (err) {
    console.error("[Testimonials] Paid-learner lookup failed:", err);
  }

  const data = {
    status: "PENDING" as const,
    featured: false,
    reviewedAt: null,
    provider: account.provider,
    name: account.name,
    avatarUrl: account.avatarUrl,
    email: account.email ?? emails[0] ?? "",
    headline: input.headline,
    linkedinUrl: input.linkedinUrl ? normalizeLinkedinUrl(input.linkedinUrl) : null,
    quote: input.quote,
    mediaKind: media.kind,
    mediaUrl: media.url,
    mediaPathname: media.pathname,
    mediaContentType: media.contentType,
    transcript: media.kind === "NONE" ? null : input.transcript,
    verifiedLearner: programs.length > 0,
    learnerSprints: programs.length > 0 ? programs.join(", ") : null,
    consentVersion: CONSENT_VERSION,
    consentedAt: new Date(),
  };

  await prisma.testimonial.upsert({
    where: { clerkUserId: identity.userId },
    create: { clerkUserId: identity.userId, ...data },
    update: data,
  });

  // A replaced or removed recording is deleted, so only the live one stays stored.
  if (existing?.mediaUrl && existing.mediaUrl !== media.url && isTestimonialMediaConfigured()) {
    await del(existing.mediaUrl).catch((err) =>
      console.error("[Testimonials] Failed to delete replaced media:", err)
    );
  }

  // An edit takes the old version off the site until it is re-approved.
  revalidatePath("/");
  revalidatePath("/testimonials");

  if (process.env.AGENTMAIL_API_KEY) {
    await sendTestimonialNotification({
      name: data.name,
      headline: data.headline,
      provider: PROVIDER_LABEL[account.provider],
      verifiedLearner: data.verifiedLearner,
      learnerSprints: data.learnerSprints,
      mediaKind: data.mediaKind,
      quote: data.quote,
      isUpdate: Boolean(existing),
    }).catch((err) => console.error("[Testimonials] Admin notification failed:", err));
  }

  return { status: "success" };
}
