"use client";

import {
  Search,
  MessageSquare,
  User,
  Workflow,
  PenTool,
  Database,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { CAPSTONE_PRODUCTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  MessageSquare,
  User,
  Workflow,
  PenTool,
  Database,
};

export function CapstoneProducts() {
  return (
    <section
      id="projects"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="projects-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            10+ Production Products. Not Just Projects.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Every product mirrors what companies actively pay for — deployed
            live, not just pushed to GitHub.
          </p>
        </FadeIn>

        {/* Product cards grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CAPSTONE_PRODUCTS.map((product, index) => {
            const IconComponent = ICON_MAP[product.icon] ?? Search;
            return (
              <FadeIn key={product.title} delay={index * 0.08} className="group">
                <article
                  className={cn(
                    "flex h-full flex-col rounded-xl border border-border bg-surface-light p-6",
                    "transition-all duration-300",
                    "group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:glow-violet"
                  )}
                >
                  <div className="mb-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <IconComponent className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                    {product.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-muted sm:text-base">
                    {product.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-light"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
