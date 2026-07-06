import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { FUNNEL_STEPS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function FunnelLoop() {
  return (
    <section
      id="funnel"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="funnel-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="funnel-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Your Path Through IntelliForge
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            From first demo to verified win — every step connects.
          </p>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3 md:gap-4">
          {FUNNEL_STEPS.map((step, index) => (
            <FadeIn key={step.step} delay={index * 0.1}>
              <div className="relative flex h-full flex-col">
                {index < FUNNEL_STEPS.length - 1 && (
                  <ArrowRight
                    className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-muted md:block lg:-right-4"
                    aria-hidden
                  />
                )}
                {step.external ? (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex h-full flex-col rounded-xl border border-border bg-surface-light p-6",
                      "transition-all hover:border-accent/30 hover:-translate-y-0.5",
                      "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                    )}
                  >
                    <StepContent step={step} external />
                  </a>
                ) : (
                  <Link
                    href={step.href}
                    className={cn(
                      "group flex h-full flex-col rounded-xl border border-border bg-surface-light p-6",
                      "transition-all hover:border-accent/30 hover:-translate-y-0.5",
                      "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                    )}
                  >
                    <StepContent step={step} external={false} />
                  </Link>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4} className="mt-10 text-center">
          <p className="text-sm text-muted">
            Graduates share verified wins at{" "}
            <a
              href={SITE_CONFIG.share}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded"
            >
              share.intelliforge.tech
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

function StepContent({
  step,
  external,
}: {
  step: (typeof FUNNEL_STEPS)[number];
  external: boolean;
}) {
  return (
    <>
      <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
        {step.step}
      </span>
      <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        {step.label}
        {external && (
          <ExternalLink
            className="h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        )}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted">{step.description}</p>
    </>
  );
}
