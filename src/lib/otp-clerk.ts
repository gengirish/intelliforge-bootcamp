/**
 * Mint a Clerk session after a verified WhatsApp OTP.
 *
 * The user is keyed by a derived email rather than the phone number, because
 * Clerk rejects both halves of the phone approach on this instance:
 *   - phone_number is not an enabled attribute ("not a valid parameter"), and
 *   - "Phone numbers from this country (India) are currently not supported".
 *
 * Possession of the number is already proven by our own OTP service; Clerk is
 * only being used to mint the session. So the account is keyed off an address on
 * a domain we own, with the real number kept in publicMetadata so that moving to
 * real phone identities later is a backfill rather than a re-registration.
 *
 * The client redeems the returned token with the ticket strategy:
 *   signIn.create({ strategy: "ticket", ticket: clerkSignInToken })
 */
import { clerkClient } from "@clerk/nextjs/server";

/** Subdomain we control; it never needs to receive mail. */
export const PHONE_EMAIL_DOMAIN = "phone.intelliforge.tech";

/** +91 74166 42072 → 917416642072@phone.intelliforge.tech */
export function derivedEmailForPhone(phoneE164: string): string {
  return `${phoneE164.replace(/\D/g, "")}@${PHONE_EMAIL_DOMAIN}`;
}

export async function mintClerkSignInToken(
  phoneE164: string
): Promise<{ token: string; userId: string }> {
  const clerk = await clerkClient();
  const emailAddress = derivedEmailForPhone(phoneE164);

  const existing = await clerk.users.getUserList({ emailAddress: [emailAddress] });
  const user =
    existing.data[0] ??
    (await clerk.users.createUser({
      emailAddress: [emailAddress],
      publicMetadata: { phone: phoneE164, viaWhatsappOtp: true },
      // The instance marks password required, and an OTP user has none to set.
      skipPasswordRequirement: true,
    }));

  const { token } = await clerk.signInTokens.createSignInToken({
    userId: user.id,
    expiresInSeconds: 60,
  });

  return { token, userId: user.id };
}
