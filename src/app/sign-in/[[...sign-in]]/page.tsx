import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  if (process.env.NEXT_PUBLIC_E2E_BYPASS === "1") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0A0F1E]">
        <h1 className="text-2xl font-bold text-white">Sign in</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A0F1E]">
      <SignIn forceRedirectUrl="/sprint" />
    </main>
  );
}
