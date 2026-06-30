import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  CTA_MICRO_TRUST,
  LMS_REGISTER_URL,
  SPRINT_CONFIG,
  TRUST_SIGNALS,
  WHATSAPP_DEMO_URL,
} from "@/lib/constants";
import { CtaMicroTrust, TrustSignals } from "@/components/ui/trust-signals";

const headlineLines = [
  { text: "Build ", highlight: "AI Agents." },
  { text: "Ship ", highlight: "AI Products." },
  { text: "Own Your ", highlight: "AI Future." },
];

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
          🔥 {SPRINT_CONFIG.urgencyLine}
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          {headlineLines.map((line, i) => (
            <span key={i} className="hero-animate-headline block">
              {line.text}
              <span className="gradient-text">{line.highlight}</span>
            </span>
          ))}
        </h1>

        <p className="hero-animate-subheading mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
          Your team shipped an AI demo. You didn&apos;t — yet. Start with our
          2-week sprint: two live products deployed, then scale into the full
          12-week bootcamp. {SPRINT_CONFIG.liveScheduleSummary}.
        </p>

        <div className="hero-animate-cta mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex w-full flex-col items-center sm:w-auto">
            <Link
              href={SPRINT_CONFIG.href}
              className={cn(
                "glow-cta inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-cta px-8 py-4 text-base font-semibold text-background sm:w-auto",
                "hover:bg-cta-hover shadow-lg transition-colors focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              )}
            >
              {SPRINT_CONFIG.ctaLabel}
            </Link>
            <CtaMicroTrust
              text={CTA_MICRO_TRUST.sprint}
              className="hero-animate-secondary mt-2 max-w-xs px-1 sm:max-w-sm"
            />
          </div>
          <Link
            href="#pricing"
            className={cn(
              "inline-flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-border px-8 py-4 text-base font-semibold text-foreground sm:w-auto",
              "hover:bg-surface-light hover:border-surface-light transition-colors focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            )}
          >
            12-Week Bootcamp — from ₹49,999
          </Link>
        </div>

        <div className="hero-animate-secondary mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-x-6">
          <p className="text-sm text-muted">Not ready to enroll?</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a
              href={WHATSAPP_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-2 hover:underline"
            >
              Book a free 1:1 demo
              <span className="text-muted font-normal">— talk to a founder</span>
            </a>
            <a
              href={LMS_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-accent underline-offset-2 hover:underline"
            >
              Try a free class
              <span className="font-normal opacity-80">— no payment</span>
            </a>
          </div>
        </div>

        <TrustSignals
          signals={TRUST_SIGNALS.hero}
          variant="badges"
          className="hero-animate-badges mt-12"
        />
      </div>
    </section>
  );
}
