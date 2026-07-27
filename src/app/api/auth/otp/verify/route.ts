import { NextRequest, NextResponse } from "next/server";
import { isOtpConfigured, normalizePhoneE164, verifyLoginOtp } from "@/lib/otp";
import { mintClerkSignInToken } from "@/lib/otp-clerk";

export const dynamic = "force-dynamic";

/**
 * POST { phone, code } → verifies the OTP; on success mints a Clerk sign-in
 * token. The client then activates the session:
 *   signIn.create({ strategy: "ticket", ticket: clerkSignInToken })
 */
export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => null)) as { phone?: string; code?: string } | null;

  const phone = normalizePhoneE164(input?.phone);
  if (!phone || !input?.code) {
    return NextResponse.json(
      { error: "invalid_request", message: "phone and code are required" },
      { status: 400 }
    );
  }

  if (!isOtpConfigured()) {
    console.error(
      "[otp/verify] OTP API is not configured — set OTP_API_KEY (or WHATSAPP_HUB_API_KEY)"
    );
    return NextResponse.json(
      {
        error: "otp_not_configured",
        message: "WhatsApp login is unavailable right now. Please try again later.",
      },
      { status: 503 }
    );
  }

  let status: number;
  let body: Awaited<ReturnType<typeof verifyLoginOtp>>["body"];
  try {
    ({ status, body } = await verifyLoginOtp(phone, input.code));
  } catch (err) {
    console.error("[otp/verify] OTP API call failed:", err);
    return NextResponse.json(
      {
        error: "otp_upstream_failed",
        message: "Couldn't verify the code right now. Please try again.",
      },
      { status: 502 }
    );
  }

  if (body.verified !== true) {
    // Pass through the OTP API's failure (401 incorrect / 410 expired / 429 …).
    return NextResponse.json(body, { status });
  }

  try {
    const { token } = await mintClerkSignInToken(body.phone ?? phone);
    return NextResponse.json({ verified: true, clerkSignInToken: token }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { verified: true, error: "clerk_mint_failed", message: (e as Error).message },
      { status: 500 }
    );
  }
}
