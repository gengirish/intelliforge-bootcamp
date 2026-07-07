import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  CTA_MICRO_TRUST,
  FREE_LIVE_DEMO_URL,
  SPRINT_CONFIG,
  TRUST_SIGNALS,
} from "@/lib/constants";
import { CtaMicroTrust, TrustSignals } from "@/components/ui/trust-signals";

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28 lg:py-32"
      aria-labelledby="final-cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(124,58,237,0.18),transparent_70%)]"
        aria-hidden
      />

      <FadeIn className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="final-cta-heading"
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          <span className="block">Ask any bootcamp for the repo</span>
          <span className="block">
            you&apos;ll contribute to.{" "}
            <span className="gradient-text">We&apos;ll show you ours.</span>
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
          Interview in weeks, not months? Ship two live products in 14 days for{" "}
          {SPRINT_CONFIG.priceDisplay}. Or try the free demo first.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={SPRINT_CONFIG.href}
            className={cn(
              "glow-cta inline-flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-cta px-10 py-5 text-lg font-semibold text-background",
              "shadow-lg transition-colors duration-200 hover:bg-cta-hover",
              "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            )}
          >
            {SPRINT_CONFIG.ctaLabel}
          </Link>
          <a
            href={FREE_LIVE_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-border px-10 py-5 text-lg font-semibold text-foreground",
              "hover:bg-surface-light transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            )}
          >
            Try the free demo — live, no signup
          </a>
        </div>
        <CtaMicroTrust text={CTA_MICRO_TRUST.sprint} className="mt-3" />

        <TrustSignals
          signals={TRUST_SIGNALS.finalCta}
          variant="inline"
          className="mt-10"
        />
      </FadeIn>
    </section>
  );
}
