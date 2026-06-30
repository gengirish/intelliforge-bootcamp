"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { BootcampCheckoutButton } from "@/components/bootcamp/BootcampCheckoutButton";
import { CTA_MICRO_TRUST, LMS_REGISTER_URL, PRICING, SPRINT_CONFIG, TRUST_SIGNALS, WHATSAPP_DEMO_URL } from "@/lib/constants";
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
                  "mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-border px-6 py-3 text-base font-semibold text-foreground",
                  "hover:bg-surface hover:border-primary/30 transition-colors duration-200"
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
                <BootcampCheckoutButton plan="earlyBird" />
                <CtaMicroTrust text={CTA_MICRO_TRUST.bootcamp} className="text-center" />
                <a
                  href={WHATSAPP_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 text-center text-sm text-muted transition-colors duration-200 hover:text-accent"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Book Free Demo
                </a>
              </div>
            </article>
          </FadeIn>
        </div>

        <FadeIn delay={0.3} className="mt-12">
          <TrustSignals signals={TRUST_SIGNALS.checkout} variant="badges" />
        </FadeIn>

        <FadeIn delay={0.4} className="mt-8 space-y-3">
          <p className="text-center text-muted">
            Not ready for 12 weeks?{" "}
            <Link href="/sprint" className="text-accent hover:underline transition-colors">
              Try the 2-Week AI Sprint ({SPRINT_CONFIG.priceDisplay}) →
            </Link>
          </p>
          <p className="text-center text-muted">
            Not ready to commit?{" "}
            <a
              href={LMS_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline transition-colors"
            >
              Try a free class on our learning platform →
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
