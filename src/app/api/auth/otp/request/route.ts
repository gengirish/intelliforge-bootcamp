import { NextRequest, NextResponse } from "next/server";
import { isOtpConfigured, normalizePhoneE164, requestLoginOtp } from "@/lib/otp";

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

  // Without this the missing-key throw escapes as a bodyless 500, and the login
  // UI reports "Network error" for what is really a server misconfiguration.
  if (!isOtpConfigured()) {
    console.error(
      "[otp/request] OTP API is not configured — set OTP_API_KEY (or WHATSAPP_HUB_API_KEY)"
    );
    return NextResponse.json(
      {
        error: "otp_not_configured",
        message: "WhatsApp login is unavailable right now. Please try again later.",
      },
      { status: 503 }
    );
  }

  try {
    const { status, body } = await requestLoginOtp(phone);
    return NextResponse.json(body, { status });
  } catch (err) {
    console.error("[otp/request] OTP API call failed:", err);
    return NextResponse.json(
      {
        error: "otp_upstream_failed",
        message: "Couldn't send the code right now. Please try again.",
      },
      { status: 502 }
    );
  }
}
