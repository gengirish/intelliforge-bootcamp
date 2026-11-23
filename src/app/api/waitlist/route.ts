import { NextResponse } from "next/server";
import { z } from "zod";
import type { ApiResponse } from "@/lib/api-response";
import { COHORT_2, SITE_CONFIG, TIERED_WELCOME_EMAILS } from "@/lib/constants";
import {
  sendWaitlistConfirmation,
  sendWaitlistNotification,
} from "@/lib/email";
import { scoreLead } from "@/lib/lead-score";
import { prisma } from "@/lib/prisma";
import {
  REFERRAL_CODE_PATTERN,
  newReferralCode,
  waitlistShareUrl,
} from "@/lib/waitlist-referral";

const values = <T extends readonly { value: string }[]>(opts: T) =>
  opts.map((o) => o.value) as [string, ...string[]];

const attr = z.string().trim().max(200).optional().catch(undefined);
const motivationSchema = z.enum(values(COHORT_2.motivations));

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().max(32).optional(),
  // Asked after signup now (PATCH below). Still accepted here so a page loaded
  // before that change can submit.
  motivation: motivationSchema.optional(),
  // Optional at the API so a page loaded before these questions existed can
  // still submit; the form itself requires them.
  role: z.enum(values(COHORT_2.roles)).optional(),
  experience: z.enum(values(COHORT_2.experience)).optional(),
  payer: z.enum(values(COHORT_2.payers)).optional(),
  consent: z.literal(true),
  /** Honeypot: hidden from people, so a filled value means a bot. */
  website: z.string().optional(),
  /** Attribution is best-effort: a malformed value is dropped, never a 400. */
  attribution: z
    .object({
      utmSource: attr,
      utmMedium: attr,
      utmCampaign: attr,
      referrer: attr,
      landingPath: attr,
      ref: attr,
    })
    .optional()
    .catch(undefined),
});

/** What the form needs after signup: a handle for the follow-up question and the share code. */
export type WaitlistJoinResult = { token: string; referralCode: string } | null;

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error:
          "Please enter your name and a valid email, answer each question, and tick the consent box.",
      },
      { status: 400 }
    );
  }

  const { name, email, role, experience, payer, website } = parsed.data;
  const { ref, ...attribution } = parsed.data.attribution ?? {};
  const phone = parsed.data.phone || undefined;

  if (website) {
    return NextResponse.json<ApiResponse<WaitlistJoinResult>>({ success: true, data: null });
  }

  let entry: { id: string; referralCode: string | null };
  let lead: ReturnType<typeof scoreLead> = null;
  let referrer: { name: string; referralCode: string | null } | null = null;
  try {
    const key = { cohort_email: { cohort: COHORT_2.slug, email } };
    const existing = await prisma.waitlistEntry.findUnique({
      where: key,
      select: { motivation: true, referralCode: true },
    });
    // A rejoin keeps the motivation they gave before unless they send a new one.
    const motivation = parsed.data.motivation ?? existing?.motivation ?? undefined;
    lead = scoreLead({ role, experience, payer, motivation });
    const qualification = {
      role,
      experience,
      payer,
      motivation,
      score: lead?.score,
      tier: lead?.tier,
    };

    if (!existing && ref && REFERRAL_CODE_PATTERN.test(ref)) {
      referrer = await prisma.waitlistEntry.findUnique({
        where: { referralCode: ref },
        select: { name: true, referralCode: true },
      });
    }

    entry = await prisma.waitlistEntry.upsert({
      where: key,
      create: {
        cohort: COHORT_2.slug,
        name,
        email,
        phone,
        ...qualification,
        ...attribution,
        referralCode: newReferralCode(),
        referredBy: referrer?.referralCode ?? undefined,
      },
      // A returning visitor refreshes their answers but keeps the attribution
      // of their first signup.
      update: { name, phone, ...qualification, consentedAt: new Date() },
      select: { id: true, referralCode: true },
    });

    // Entries from before referrals existed get a code the first time they rejoin.
    if (!entry.referralCode) {
      entry = await prisma.waitlistEntry.update({
        where: { id: entry.id },
        data: { referralCode: newReferralCode() },
        select: { id: true, referralCode: true },
      });
    }
  } catch (err) {
    console.error("[Waitlist] Failed to save entry:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "We couldn't save your place. Please try again in a few minutes.",
      },
      { status: 500 }
    );
  }

  const employerPays = payer === "employer";

  // The entry is saved, so a failed email must not fail the request.
  const [admin, learner] = await Promise.allSettled([
    sendWaitlistNotification({
      cohortName: COHORT_2.name,
      name,
      email,
      phone,
      tier: lead?.tier,
      score: lead?.score,
      source: attribution.utmSource ?? attribution.referrer,
      employerPays,
      referredByName: referrer?.name,
    }),
    sendWaitlistConfirmation({
      name,
      email,
      cohortName: COHORT_2.name,
      launchWeekend: COHORT_2.launchWeekend,
      firstClass: COHORT_2.firstClass,
      prepCourseName: COHORT_2.prepCourse.name,
      prepCourseUrl: COHORT_2.prepCourse.url,
      whatsappUrl: COHORT_2.whatsappUrl,
      tier: TIERED_WELCOME_EMAILS ? lead?.tier : undefined,
      shareUrl: waitlistShareUrl(entry.referralCode),
      sponsorUrl: employerPays ? `${SITE_CONFIG.url}${COHORT_2.sponsorHref}` : undefined,
    }),
  ]);
  if (admin.status === "rejected") {
    console.error("[Waitlist] Admin notification failed:", admin.reason);
  }
  if (learner.status === "rejected") {
    console.error("[Waitlist] Learner confirmation failed:", learner.reason);
  }

  return NextResponse.json<ApiResponse<WaitlistJoinResult>>({
    success: true,
    data: { token: entry.id, referralCode: entry.referralCode! },
  });
}

const followUpSchema = z.object({
  token: z.string().min(1).max(64),
  motivation: motivationSchema,
});

/**
 * The post-signup question. The token is the entry id the POST returned; anyone
 * holding it could already overwrite the entry by re-posting the same email, so
 * it grants nothing new.
 */
export async function PATCH(req: Request) {
  const parsed = followUpSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Please choose one option." },
      { status: 400 }
    );
  }
  const { token, motivation } = parsed.data;

  try {
    const entry = await prisma.waitlistEntry.findUnique({
      where: { id: token },
      select: { role: true, experience: true, payer: true },
    });
    if (!entry) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "We couldn't find your signup." },
        { status: 404 }
      );
    }
    const lead = scoreLead({ ...entry, motivation });
    await prisma.waitlistEntry.update({
      where: { id: token },
      data: { motivation, score: lead?.score, tier: lead?.tier },
    });
  } catch (err) {
    console.error("[Waitlist] Failed to save follow-up answer:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "We couldn't save that. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json<ApiResponse<null>>({ success: true, data: null });
}
