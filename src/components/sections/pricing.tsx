"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import Script from "next/script";
import { FadeIn } from "@/components/animations/fade-in";
import { PRICING, SITE_CONFIG, WHATSAPP_DEMO_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

interface RazorpayCheckoutOptions {
  key: string;
  amount?: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler?: (response: RazorpayPaymentResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: RazorpayPaymentResponse) => void) => void;
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const TRUST_BADGES = [
  "15-Day Money Back Guarantee",
  "100% Secure Checkout",
  "0% EMI Available",
];

export function Pricing() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scriptLoadedRef = useRef(false);

  const handleEnrollClick = useCallback(async () => {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!keyId) {
      setError("Payment configuration is missing. Please contact support.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "earlyBird" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create order");
      }

      const { orderId } = data;

      if (!window.Razorpay) {
        throw new Error("Payment gateway is still loading. Please try again.");
      }

      const options: RazorpayCheckoutOptions = {
        key: keyId,
        currency: "INR",
        name: "IntelliForge AI",
        description: "AI Bootcamp — Early Bird Enrollment",
        order_id: orderId,
        theme: { color: "#F59E0B" },
        handler(response) {
          if (response.razorpay_payment_id) {
            window.location.href = SITE_CONFIG.lms;
          }
        },
        modal: {
          ondismiss() {
            setIsLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again or contact support.");
        setIsLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <Script
        src={RAZORPAY_SCRIPT_URL}
        strategy="lazyOnload"
        onLoad={() => {
          scriptLoadedRef.current = true;
        }}
      />
      <section
        id="pricing"
        className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
        aria-labelledby="pricing-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <FadeIn className="mb-12 text-center sm:mb-16">
            <h2
              id="pricing-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Invest Once. Compound Forever.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              Early Bird pricing ends when this cohort fills. One enrollment — lifetime access.
            </p>
          </FadeIn>

          {/* Error message */}
          {error && (
            <FadeIn>
              <div
                className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                {error}
              </div>
            </FadeIn>
          )}

          {/* Pricing cards */}
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Regular card */}
            <FadeIn delay={0.1}>
              <article
                className={cn(
                  "flex flex-col rounded-xl border border-border bg-surface-light p-6 sm:p-8"
                )}
              >
                <p className="text-sm font-medium uppercase tracking-wider text-muted">
                  Regular Pricing
                </p>
                <p className="mt-4 text-4xl font-bold text-foreground sm:text-5xl">
                  {PRICING.regular.price}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {PRICING.regular.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-muted">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={WHATSAPP_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-8 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-border px-6 py-3 text-base font-semibold text-foreground",
                    "hover:bg-surface hover:border-primary/30 transition-colors"
                  )}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Book Free Demo
                </a>
              </article>
            </FadeIn>

            {/* Early Bird card - highlighted */}
            <FadeIn delay={0.2}>
              <article
                className={cn(
                  "gradient-border relative flex flex-col rounded-xl bg-surface p-6 shadow-lg sm:p-8",
                  "lg:scale-[1.02]"
                )}
              >
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cta px-4 py-1 text-xs font-semibold text-background"
                  aria-hidden
                >
                  Best Value
                </span>
                <p className="mt-2 text-sm font-medium uppercase tracking-wider text-primary-light">
                  Early Bird Offer
                </p>
                <div className="mt-4 flex flex-wrap items-baseline gap-2">
                  <p className="text-4xl font-bold text-foreground sm:text-5xl">
                    {PRICING.earlyBird.price}
                  </p>
                  <p className="text-xl text-muted line-through">
                    {PRICING.earlyBird.originalPrice}
                  </p>
                </div>
                <span
                  className="mt-2 inline-block rounded-md bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-400"
                  aria-hidden
                >
                  Save {PRICING.earlyBird.savings}
                </span>
                <ul className="mt-6 flex-1 space-y-3">
                  {PRICING.earlyBird.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-muted">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleEnrollClick}
                    disabled={isLoading}
                    className={cn(
                      "inline-flex items-center justify-center rounded-lg bg-cta px-6 py-4 text-base font-semibold text-background",
                      "hover:bg-cta-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    )}
                  >
                    {isLoading ? "Opening checkout…" : "Enroll Now — Early Bird"}
                  </button>
                  <a
                    href={WHATSAPP_DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-center text-sm text-muted hover:text-accent transition-colors"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Book Free Demo
                  </a>
                </div>
              </article>
            </FadeIn>
          </div>

          {/* Trust badges */}
          <FadeIn delay={0.3} className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {TRUST_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-border bg-surface/50 px-4 py-2 text-xs text-muted sm:text-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
