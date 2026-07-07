"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { BootcampCheckoutButton } from "@/components/bootcamp/BootcampCheckoutButton";
import {
  CTA_MICRO_TRUST,
  FREE_LIVE_DEMO_URL,
  PRICING,
  SPRINT_CONFIG,
  TRUST_SIGNALS,
} from "@/lib/constants";
import { CtaMicroTrust, TrustSignals } from "@/components/ui/trust-signals";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="pricing-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Start with the 2-Week Sprint
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Need proof before your next interview? Ship two live products in 14
            days for {SPRINT_CONFIG.priceDisplay}. Scale into the 12-week
            bootcamp when you&apos;re ready. All prices in ₹ (INR).
          </p>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* 2-Week Sprint — primary */}
          <FadeIn delay={0.1}>
            <article
              className={cn(
                "gradient-border relative flex h-full flex-col rounded-xl bg-surface p-6 shadow-lg sm:p-8",
                "lg:scale-[1.02]"
              )}
            >
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cta px-4 py-1 text-xs font-semibold text-background"
                aria-hidden
              >
                Start here
              </span>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-cta">
                {PRICING.sprint.name}
              </p>
              <div className="mt-4 flex flex-wrap items-baseline gap-2">
                <p className="text-4xl font-bold text-foreground sm:text-5xl">
                  {PRICING.sprint.price}
                </p>
                <p className="text-lg text-muted line-through">
                  {PRICING.sprint.originalPrice}
                </p>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {PRICING.sprint.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-muted">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href={SPRINT_CONFIG.href}
                  className={cn(
                    "glow-cta inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-cta px-6 py-3 text-base font-semibold text-background",
                    "hover:bg-cta-hover transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                  )}
                >
                  {SPRINT_CONFIG.ctaLabel}
                </Link>
                <CtaMicroTrust text={CTA_MICRO_TRUST.sprint} className="text-center" />
              </div>
            </article>
          </FadeIn>

          {/* 12-Week Regular */}
          <FadeIn delay={0.15}>
            <article
              className={cn(
                "flex h-full flex-col rounded-xl border border-border bg-surface-light p-6 sm:p-8"
              )}
            >
              <p className="text-sm font-medium uppercase tracking-wider text-muted">
                {PRICING.regular.name} — Regular
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
                href={FREE_LIVE_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-border px-6 py-3 text-base font-semibold text-foreground",
                  "hover:bg-surface hover:border-primary/30 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                )}
              >
                Try free demo first
              </a>
            </article>
          </FadeIn>

          {/* 12-Week Early Bird */}
          <FadeIn delay={0.2}>
            <article
              className={cn(
                "flex h-full flex-col rounded-xl border border-border bg-surface-light p-6 sm:p-8"
              )}
            >
              <p className="text-sm font-medium uppercase tracking-wider text-muted">
                {PRICING.earlyBird.name} — Early Bird
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
                <BootcampCheckoutButton
                  plan="earlyBird"
                  label={`Enrol — ${PRICING.earlyBird.price}`}
                  className="border-2 border-border bg-transparent text-foreground hover:bg-surface"
                />
                <CtaMicroTrust text={CTA_MICRO_TRUST.bootcamp} className="text-center" />
              </div>
            </article>
          </FadeIn>
        </div>

        <FadeIn delay={0.3} className="mt-12">
          <TrustSignals signals={TRUST_SIGNALS.checkout} variant="badges" />
        </FadeIn>

        <FadeIn delay={0.4} className="mt-8 text-center">
          <a
            href={FREE_LIVE_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded"
          >
            Not ready to pay? Try the free live demo first →
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
