import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";
import {
  CTA_MICRO_TRUST,
  LMS_REGISTER_URL,
  SPRINT_CONFIG,
  TRUST_SIGNALS,
  WHATSAPP_DEMO_URL,
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
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="block">Stop Learning AI.</span>
          <span className="block">
            Start <span className="gradient-text">Shipping It.</span>
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
          Join Cohort 1 of our 2-Week AI Sprint — two live products deployed
          starting {SPRINT_CONFIG.cohortStartDate}. {SPRINT_CONFIG.priceDisplay}{" "}
          · 30 seats · backed by our zero-risk guarantee.
        </p>

        <div className="mt-10 flex flex-col items-center">
          <Link
            href={SPRINT_CONFIG.href}
            className={cn(
              "glow-cta inline-flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-cta px-10 py-5 text-lg font-semibold text-background",
              "shadow-lg transition-colors duration-200 hover:bg-cta-hover"
            )}
          >
            {SPRINT_CONFIG.ctaLabel}
          </Link>
          <CtaMicroTrust
            text={CTA_MICRO_TRUST.sprint}
            className="mt-3 max-w-md"
          />
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-sm text-muted">Want to see the fit first?</p>
          <a
            href={WHATSAPP_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-accent/30 px-10 py-4 text-base font-semibold text-accent",
              "hover:bg-accent/10 transition-colors"
            )}
          >
            Or Book a Free Demo First
          </a>
          <p className="text-xs text-muted">
            15-minute call · No sales pitch · Ask anything about the sprint or bootcamp
          </p>
        </div>

        <a
          href={LMS_REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-sm text-muted underline-offset-2 hover:text-foreground hover:underline"
        >
          Try a free class on our LMS →
        </a>
        <CtaMicroTrust text={CTA_MICRO_TRUST.freeClass} className="mt-1" />

        <TrustSignals
          signals={TRUST_SIGNALS.finalCta}
          variant="inline"
          className="mt-10"
        />
      </FadeIn>
    </section>
  );
}
