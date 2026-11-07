import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Browser sessions for the admin pages. The cookie holds an HMAC derived from
 * ADMIN_SECRET rather than the secret itself, so a leaked cookie never reveals
 * the bearer token the admin API routes accept. Rotating ADMIN_SECRET signs
 * every browser out.
 */
export const ADMIN_COOKIE = "if_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function sessionToken(secret: string): string {
  return createHmac("sha256", secret).update("admin-session:v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function isAdminSecretConfigured(): boolean {
  return Boolean(process.env.ADMIN_SECRET);
}

export function isValidAdminSecret(candidate: string): boolean {
  const secret = process.env.ADMIN_SECRET;
  return Boolean(secret) && safeEqual(candidate, secret!);
}

export async function isAdminSession(): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(value) && safeEqual(value!, sessionToken(secret));
}

export async function startAdminSession(): Promise<void> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return;
  (await cookies()).set(ADMIN_COOKIE, sessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endAdminSession(): Promise<void> {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
}
