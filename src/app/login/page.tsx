import { redirect } from "next/navigation";

/**
 * WhatsApp OTP login has been retired — Clerk's hosted sign-in at /sign-in is
 * the only login. This route is kept so older links (emails, WhatsApp messages,
 * bookmarks) land on the current flow instead of a 404.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const { redirect_url: raw } = await searchParams;
  const target =
    raw?.startsWith("/") && !raw.startsWith("//")
      ? `/sign-in?redirect_url=${encodeURIComponent(raw)}`
      : "/sign-in";
  redirect(target);
}
