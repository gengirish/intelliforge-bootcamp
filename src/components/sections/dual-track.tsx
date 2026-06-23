import { Bot, Sparkles, Merge } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";

const TRACK_4_BULLETS = [
  "Multi-agent orchestration",
  "RAG pipelines",
  "Tool calling & workflows",
  "Enterprise patterns",
];

const TRACK_5_BULLETS = [
  "AI-assisted full-stack dev",
  "Prompt-to-product workflows",
  "SaaS deployment",
  "Monetization strategies",
];

export function DualTrack() {
  return (
    <section
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="dual-track-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="dual-track-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Two Tracks. One Outcome: You Ship.
          </h2>
        </FadeIn>

        {/* Two tracks + convergence */}
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:gap-8">
          {/* Left card — Level 4 */}
          <FadeIn direction="left" delay={0.1} className="flex-1">
            <article
              className={cn(
                "flex h-full flex-col rounded-xl border border-border bg-surface p-6",
                "border-l-4 border-l-primary glow-violet sm:p-8"
              )}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Bot className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                Level 4 — AI Agent Development
              </h3>
              <ul className="mt-4 space-y-2">
                {TRACK_4_BULLETS.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-center gap-2 text-muted sm:text-base"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          </FadeIn>

          {/* Convergence visual */}
          <FadeIn delay={0.2} className="flex shrink-0 flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-surface-light text-muted lg:h-14 lg:w-14">
              <Merge className="h-6 w-6 rotate-90 lg:h-7 lg:w-7" aria-hidden />
            </div>
            <span className="mt-2 text-sm font-medium text-muted">converge</span>
          </FadeIn>

          {/* Right card — Level 5 */}
          <FadeIn direction="right" delay={0.1} className="flex-1">
            <article
              className={cn(
                "flex h-full flex-col rounded-xl border border-border bg-surface p-6",
                "border-l-4 border-l-accent glow-cyan sm:p-8"
              )}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-accent">
                <Sparkles className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                Level 5 — AI App Development (Vibe Coding)
              </h3>
              <ul className="mt-4 space-y-2">
                {TRACK_5_BULLETS.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-center gap-2 text-muted sm:text-base"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          </FadeIn>
        </div>

        {/* Arrow pointing down (mobile: visible, desktop: subtle) */}
        <FadeIn delay={0.3} className="mt-6 flex justify-center">
          <div className="flex flex-col items-center">
            <svg
              className="h-8 w-8 text-muted/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </FadeIn>

        {/* Result card */}
        <FadeIn delay={0.4} className="mt-8">
          <div
            className={cn(
              "gradient-border rounded-xl bg-surface p-6 text-center sm:p-8"
            )}
          >
            <p className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              = Ship Your Own AI Product
            </p>
            <p className="mt-2 text-muted">
              Graduate with deployable products, not just GitHub projects.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
