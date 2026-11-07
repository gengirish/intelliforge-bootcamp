import { NextResponse } from "next/server";
import { z } from "zod";
import type { ApiResponse } from "@/lib/api-response";
import { COHORT_2, TIERED_WELCOME_EMAILS } from "@/lib/constants";
import {
  sendWaitlistConfirmation,
  sendWaitlistNotification,
} from "@/lib/email";
import { scoreLead } from "@/lib/lead-score";
import { prisma } from "@/lib/prisma";

const values = <T extends readonly { value: string }[]>(opts: T) =>
  opts.map((o) => o.value) as [string, ...string[]];

const attr = z.string().trim().max(200).optional().catch(undefined);

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().max(32).optional(),
  motivation: z.enum(values(COHORT_2.motivations)),
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
    })
    .optional()
    .catch(undefined),
});

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

  const { name, email, motivation, role, experience, payer, website, attribution } =
    parsed.data;
  const phone = parsed.data.phone || undefined;

  if (website) {
    return NextResponse.json<ApiResponse<null>>({ success: true, data: null });
  }

  const lead = scoreLead({ role, experience, payer, motivation });
  const qualification = {
    role,
    experience,
    payer,
    score: lead?.score,
    tier: lead?.tier,
  };

  try {
    await prisma.waitlistEntry.upsert({
      where: { cohort_email: { cohort: COHORT_2.slug, email } },
      create: {
        cohort: COHORT_2.slug,
        name,
        email,
        phone,
        motivation,
        ...qualification,
        ...attribution,
      },
      // A returning visitor refreshes their answers but keeps the attribution
      // of their first signup.
      update: { name, phone, motivation, ...qualification, consentedAt: new Date() },
    });
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

  // The entry is saved, so a failed email must not fail the request.
  const [admin, learner] = await Promise.allSettled([
    sendWaitlistNotification({
      cohortName: COHORT_2.name,
      name,
      email,
      phone,
      motivation,
      tier: lead?.tier,
      score: lead?.score,
      source: attribution?.utmSource ?? attribution?.referrer,
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
    }),
  ]);
  if (admin.status === "rejected") {
    console.error("[Waitlist] Admin notification failed:", admin.reason);
  }
  if (learner.status === "rejected") {
    console.error("[Waitlist] Learner confirmation failed:", learner.reason);
  }

  return NextResponse.json<ApiResponse<null>>({ success: true, data: null });
}
