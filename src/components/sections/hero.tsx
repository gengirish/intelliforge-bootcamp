import Link from "next/link";
import { cn } from "@/lib/utils";
import { LMS_REGISTER_URL, SPRINT_CONFIG, WHATSAPP_DEMO_URL } from "@/lib/constants";

const headlineLines = [
  { text: "Build ", highlight: "AI Agents." },
  { text: "Ship ", highlight: "AI Products." },
  { text: "Own Your ", highlight: "AI Future." },
];

const trustBadges = [
  "Aligned with Bharat AI Mission",
  "13+ Years Fortune 500 DNA",
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
          12-week bootcamp.
        </p>

        <div className="hero-animate-cta mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={SPRINT_CONFIG.href}
            className={cn(
              "glow-cta inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-cta px-8 py-4 text-base font-semibold text-background",
              "hover:bg-cta-hover shadow-lg transition-colors focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            )}
          >
            {SPRINT_CONFIG.ctaLabel}
          </Link>
          <Link
            href="#pricing"
            className={cn(
              "inline-flex cursor-pointer items-center justify-center rounded-lg border-2 border-border px-8 py-4 text-base font-semibold text-foreground",
              "hover:bg-surface-light hover:border-surface-light transition-colors focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            )}
          >
            12-Week Bootcamp
          </Link>
        </div>
        <div className="hero-animate-secondary mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <a
            href={WHATSAPP_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted underline-offset-2 hover:text-foreground hover:underline"
          >
            Book free demo →
          </a>
          <a
            href={LMS_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-2 hover:underline"
          >
            Try a free class →
          </a>
        </div>

        <div className="hero-animate-badges mt-12 flex flex-wrap items-center justify-center gap-4">
          {trustBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-border bg-surface/50 px-4 py-2 text-xs text-muted sm:text-sm"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
