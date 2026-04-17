"use client";

import {
  Rocket,
  Layers,
  Building2,
  GitBranch,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { WHY_CARDS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Rocket,
  Layers,
  Building2,
  GitBranch,
};

export function WhyIntelliForge() {
  return (
    <section
      id="why-intelliforge"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="why-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Not Another AI Theory Course.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Here&apos;s what makes IntelliForge different.
          </p>
        </FadeIn>

        {/* Cards grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {WHY_CARDS.map((card, index) => {
            const IconComponent = ICON_MAP[card.icon] ?? Rocket;
            return (
              <FadeIn
                key={card.title}
                delay={index * 0.1}
                className="group"
              >
                <article
                  className={cn(
                    "flex flex-col rounded-xl border border-border bg-surface-light p-6 transition-all duration-300",
                    "hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(124,58,237,0.12)] sm:p-8"
                  )}
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <IconComponent className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-muted sm:text-base">
                    {card.description}
                  </p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
