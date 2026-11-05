"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import {
  CTA_MICRO_TRUST,
  FREE_LIVE_DEMO_URL,
  PRICING,
  SPRINT_CONFIG,
} from "@/lib/constants";
import { CtaMicroTrust } from "@/components/ui/trust-signals";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="pricing-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            {PRICING.perSprint.price} per sprint. That&apos;s the whole price.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            The 12-week bootcamp is six 2-week sprints. Pay for one at a time, and
            stop whenever you like. All prices in ₹ (INR).
          </p>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          <FadeIn delay={0.1}>
            <article className="gradient-border relative flex h-full flex-col rounded-xl bg-surface p-6 shadow-lg sm:p-8">
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cta px-4 py-1 text-xs font-semibold text-background"
                aria-hidden
              >
                Start here
              </span>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-cta">
                {PRICING.perSprint.name}
              </p>
              <p className="mt-4 text-4xl font-bold text-foreground sm:text-5xl">
                {PRICING.perSprint.price}
              </p>
              <p className="mt-2 text-sm text-muted">{PRICING.perSprint.unit}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {PRICING.perSprint.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-muted">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href={SPRINT_CONFIG.ctaHref}
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

          <FadeIn delay={0.15}>
            <article className="flex h-full flex-col rounded-xl border border-border bg-surface-light p-6 sm:p-8">
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted">
                {PRICING.fullProgramme.name}
              </p>
              <p className="mt-4 text-4xl font-bold text-foreground sm:text-5xl">
                {PRICING.fullProgramme.price}
              </p>
              <p className="mt-2 text-sm text-muted">{PRICING.fullProgramme.unit}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {PRICING.fullProgramme.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-muted">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sprint/all"
                className={cn(
                  "mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-border px-6 py-3 text-base font-semibold text-foreground",
                  "hover:bg-surface hover:border-primary/30 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                )}
              >
                See all 6 sprints
              </Link>
            </article>
          </FadeIn>
        </div>

        <FadeIn delay={0.3} className="mt-8 text-center">
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
