"use client";

import { useCallback, useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type Step = "phone" | "code";

/**
 * WhatsApp OTP login, wired end-to-end:
 *   phone → POST /api/auth/otp/request (sends code via WhatsApp)
 *   code  → POST /api/auth/otp/verify (returns a Clerk sign-in token)
 *         → signIn.create({ strategy: "ticket" }) + setActive → signed in
 */
export function OtpLogin() {
  const clerk = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const requestOtp = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const body = await res.json();
      if (!res.ok || body.sent !== true) {
        if (res.status === 429 && body.retryInSeconds) {
          setError(`Too many requests. Try again in ${body.retryInSeconds}s.`);
        } else {
          setError(body.message ?? body.error ?? "Couldn't send the code. Try again.");
        }
        return;
      }
      setStep("code");
      setResendIn(body.resendInSeconds ?? 30);
    } catch {
      setError("Network error. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }, [phone]);

  const verifyOtp = useCallback(async () => {
    if (!clerk.loaded) {
      setError("Auth is still loading. Try again in a moment.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const body = await res.json();
      if (!res.ok || body.verified !== true) {
        if (res.status === 401) {
          setError(
            `Incorrect code${
              typeof body.attemptsLeft === "number" ? ` — ${body.attemptsLeft} attempts left` : ""
            }.`
          );
        } else if (res.status === 410) {
          setError("That code expired. Request a new one.");
        } else {
          setError(body.message ?? body.error ?? "Verification failed.");
        }
        return;
      }

      // Activate the Clerk session from the sign-in token (ticket strategy)
      // via the imperative Clerk instance (stable across hook API changes).
      const signInResource = await clerk.client.signIn.create({
        strategy: "ticket",
        ticket: body.clerkSignInToken as string,
      });
      await clerk.setActive({ session: signInResource.createdSessionId });
      router.push(redirectUrl);
    } catch (e) {
      setError((e as Error).message ?? "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }, [clerk, phone, code, router, redirectUrl]);

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface-light p-8 shadow-lg">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
          <MessageCircle className="h-6 w-6 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
        <p className="mt-1 text-sm text-foreground/60">
          {step === "phone"
            ? "We'll send a login code to your WhatsApp."
            : `Enter the 6-digit code sent to ${phone}.`}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {step === "phone" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading && phone.trim()) requestOtp();
          }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground/80">WhatsApp number</span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+91 96200 10983"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-cta"
              required
            />
          </label>
          <Button type="submit" variant="whatsapp" disabled={loading || !phone.trim()}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send code on WhatsApp"}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading && code.trim().length >= 4) verifyOtp();
          }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground/80">Verification code</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-2xl tracking-[0.4em] text-foreground outline-none focus:border-cta"
              required
              autoFocus
            />
          </label>
          <Button type="submit" disabled={loading || code.trim().length < 4}>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="mr-2 h-5 w-5" /> Verify &amp; sign in
              </>
            )}
          </Button>
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setCode("");
                setError(null);
              }}
              className="text-foreground/60 hover:text-foreground"
            >
              ← Change number
            </button>
            <button
              type="button"
              disabled={resendIn > 0 || loading}
              onClick={requestOtp}
              className="text-cta hover:text-cta-hover disabled:text-foreground/40"
            >
              {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
