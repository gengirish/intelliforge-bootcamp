import { Suspense } from "react";
import type { Metadata } from "next";
import { OtpLogin } from "@/components/auth/otp-login";

export const metadata: Metadata = {
  title: "Sign in — IntelliForge Bootcamp",
  description: "Sign in with a one-time code sent to your WhatsApp.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Suspense fallback={null}>
        <OtpLogin />
      </Suspense>
    </main>
  );
}
