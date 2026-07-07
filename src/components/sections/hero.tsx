import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  CTA_MICRO_TRUST,
  FREE_LIVE_DEMO_URL,
  FOUNDER,
  SPRINT_CONFIG,
  TRUST_SIGNALS,
} from "@/lib/constants";
import { CtaMicroTrust, TrustSignals } from "@/components/ui/trust-signals";

export function Hero() {
  return (
    <section className="animated-gradient-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]"
          aria-hidden
        />
        <div
          className="absolute -right-40 top-1/2 h-80 w-80 rounded-full bg-accent/15 blur-[100px]"
          aria-hidden
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[80px]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="hero-animate-headline mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-sm text-accent">
          Interview in 3 weeks? · {SPRINT_CONFIG.name} · {SPRINT_CONFIG.priceDisplay}
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="hero-animate-headline block">
            Ship proof they can click.
          </span>
          <span className="hero-animate-headline block">
            <span className="gradient-text">Not another portfolio toy.</span>
          </span>
        </h1>

        <p className="hero-animate-subheading mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
          Two live AI products deployed in 14 days — plus a verifiable credential
          at certs.intelliforge.tech with the URLs recruiters can verify. Top
          bootcamp performers ship to a live IntelliForge repo and get
          mentor-scored.
        </p>

        <p className="hero-animate-secondary mx-auto mt-4 max-w-xl text-sm font-medium text-amber-400/90 sm:text-base">
          {SPRINT_CONFIG.urgencyLine}
        </p>

        <div className="hero-animate-cta mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex w-full flex-col items-center sm:w-auto">
            <Link
              href={SPRINT_CONFIG.href}
              className={cn(
                "glow-cta inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-cta px-8 py-4 text-base font-semibold text-background sm:w-auto",
                "hover:bg-cta-hover shadow-lg transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              )}
            >
              {SPRINT_CONFIG.ctaLabel}
            </Link>
            <CtaMicroTrust
              text={CTA_MICRO_TRUST.sprint}
              className="hero-animate-secondary mt-2 max-w-xs px-1 sm:max-w-sm"
            />
          </div>
          <a
            href={FREE_LIVE_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-border px-8 py-4 text-base font-semibold text-foreground sm:w-auto",
              "hover:bg-surface-light hover:border-surface-light transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            )}
          >
            Try the free demo — live, no signup
          </a>
        </div>

        <p className="hero-animate-secondary mt-8 text-sm text-muted">
          Founder-taught by {FOUNDER.name} · Built on IntelliForge&apos;s live
          product studio
        </p>

        <TrustSignals
          signals={TRUST_SIGNALS.hero}
          variant="badges"
          className="hero-animate-badges mt-10"
        />
      </div>
    </section>
  );
}
