/**
 * Mint a Clerk session after a verified WhatsApp OTP.
 * Find-or-create the Clerk user by E.164 phone, then issue a short-lived
 * sign-in token for the client-side ticket strategy:
 *   signIn.create({ strategy: "ticket", ticket: clerkSignInToken })
 * Phone login must be enabled on the Clerk instance.
 */
import { clerkClient } from "@clerk/nextjs/server";

export async function mintClerkSignInToken(
  phoneE164: string
): Promise<{ token: string; userId: string }> {
  const clerk = await clerkClient();

  const existing = await clerk.users.getUserList({ phoneNumber: [phoneE164] });
  const user = existing.data[0] ?? (await clerk.users.createUser({ phoneNumber: [phoneE164] }));

  const { token } = await clerk.signInTokens.createSignInToken({
    userId: user.id,
    expiresInSeconds: 60,
  });

  return { token, userId: user.id };
}
