import { NextRequest, NextResponse } from "next/server";
import { normalizePhoneE164, requestLoginOtp } from "@/lib/otp";

export const dynamic = "force-dynamic";

/** POST { phone } → sends a WhatsApp login OTP via the hosted OTP API. */
export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => null)) as { phone?: string } | null;

  const phone = normalizePhoneE164(input?.phone);
  if (!phone) {
    return NextResponse.json(
      { error: "invalid_phone", message: "Enter a valid phone number (e.g. +919620010983)" },
      { status: 400 }
    );
  }

  const { status, body } = await requestLoginOtp(phone);
  return NextResponse.json(body, { status });
}
