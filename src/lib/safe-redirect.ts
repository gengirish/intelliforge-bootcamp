/**
 * Turns a `redirect_url` into a same-site path, or null if it points elsewhere.
 *
 * Accepts a relative path ("/testimonials/submit") and an absolute URL on one of
 * `allowedOrigins`. Clerk rewrites redirect_url to an absolute URL during the
 * OAuth round trip, so rejecting absolute URLs dropped users onto the fallback.
 * Protocol-relative ("//evil.example") and other-origin URLs are refused.
 */
export function safeRedirectPath(raw: string | undefined, allowedOrigins: string[]): string | null {
  const value = raw?.trim();
  if (!value) return null;

  if (value.startsWith("/")) {
    if (value.startsWith("//") || value.startsWith("/\\")) return null;
    return value;
  }

  try {
    const url = new URL(value);
    if (!allowedOrigins.includes(url.origin)) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}
