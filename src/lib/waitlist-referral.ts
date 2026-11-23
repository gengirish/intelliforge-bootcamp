import { COHORT_2, SITE_CONFIG, type UTM_SOURCES } from "@/lib/constants";

/** Lowercase, no 0/1/l/o, so a code read aloud or retyped survives. */
const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";
export const REFERRAL_CODE_LENGTH = 8;
export const REFERRAL_CODE_PATTERN = /^[a-z2-9]{8}$/;

/** A random referral code. Uses Web Crypto, so it runs on the server and in tests alike. */
export function newReferralCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(REFERRAL_CODE_LENGTH));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/**
 * A waitlister's personal link. Tagged per the UTM convention in constants.ts:
 * the channel as utm_source (omitted for a copied link, which could go anywhere),
 * utm_medium=referral, and their code as ref.
 */
export function waitlistShareUrl(
  code: string | null | undefined,
  source?: (typeof UTM_SOURCES)[number]
): string {
  const params = new URLSearchParams();
  if (code) params.set("ref", code);
  if (source) params.set("utm_source", source);
  params.set("utm_medium", "referral");
  params.set("utm_campaign", COHORT_2.slug);
  return `${SITE_CONFIG.url}${COHORT_2.waitlistHref}?${params.toString()}`;
}
