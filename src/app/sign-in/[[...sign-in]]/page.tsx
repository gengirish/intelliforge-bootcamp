import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A0F1E]">
      <SignIn forceRedirectUrl="/sprint" />
    </main>
  );
}
