import Link from "next/link";
import { headers } from "next/headers";
import { SignIn } from "@clerk/nextjs";
import { safeRedirectPath } from "@/lib/safe-redirect";

const SITE_ORIGIN = "https://upskill.intelliforge.tech";

async function safeRedirectUrl(raw?: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  const origins = host ? [SITE_ORIGIN, `${proto}://${host}`] : [SITE_ORIGIN];
  return safeRedirectPath(raw, origins) ?? "/sprint";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const params = await searchParams;
  const redirectUrl = await safeRedirectUrl(params.redirect_url);
  const isSprint = redirectUrl.startsWith("/sprint");

  if (process.env.NEXT_PUBLIC_E2E_BYPASS === "1") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-6 py-12">
      <SignIn
        forceRedirectUrl={redirectUrl}
        appearance={{
          elements: {
            card: "border border-border shadow-none",
          },
        }}
      />
      <Link
        href={isSprint ? "/sprint" : "/"}
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        {isSprint ? "← Back to AI Sprint" : "← Back to homepage"}
      </Link>
    </main>
  );
}
