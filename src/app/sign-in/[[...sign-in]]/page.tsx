import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

function safeRedirectUrl(raw?: string): string {
  if (raw?.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return "/sprint";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const params = await searchParams;
  const redirectUrl = safeRedirectUrl(params.redirect_url);
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
          variables: {
            colorPrimary: "#7C3AED",
            colorBackground: "#111827",
            colorForeground: "#E2E8F0",
            colorInput: "#1E293B",
            colorInputForeground: "#E2E8F0",
          },
          elements: {
            card: "bg-surface border border-border shadow-none",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted",
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
