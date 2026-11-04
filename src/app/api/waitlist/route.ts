import { NextResponse } from "next/server";
import { z } from "zod";
import type { ApiResponse } from "@/lib/api-response";
import { COHORT_2 } from "@/lib/constants";
import { sendWaitlistNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const motivationValues = COHORT_2.motivations.map((m) => m.value) as [
  string,
  ...string[],
];

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().max(32).optional(),
  motivation: z.enum(motivationValues),
  consent: z.literal(true),
  /** Honeypot: hidden from people, so a filled value means a bot. */
  website: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error:
          "Please enter your name and a valid email, choose an option, and tick the consent box.",
      },
      { status: 400 }
    );
  }

  const { name, email, motivation, website } = parsed.data;
  const phone = parsed.data.phone || undefined;

  if (website) {
    return NextResponse.json<ApiResponse<null>>({ success: true, data: null });
  }

  try {
    await prisma.waitlistEntry.upsert({
      where: { cohort_email: { cohort: COHORT_2.slug, email } },
      create: { cohort: COHORT_2.slug, name, email, phone, motivation },
      update: { name, phone, motivation, consentedAt: new Date() },
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

  // The entry is saved, so a failed notification must not fail the request.
  try {
    await sendWaitlistNotification({
      cohortName: COHORT_2.name,
      name,
      email,
      phone,
      motivation,
    });
  } catch (err) {
    console.error("[Waitlist] Admin notification failed:", err);
  }

  return NextResponse.json<ApiResponse<null>>({ success: true, data: null });
}
