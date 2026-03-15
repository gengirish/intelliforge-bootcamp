"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { CURRICULUM } from "@/lib/constants";
import { cn } from "@/lib/utils";

type PhaseColor = "violet" | "cyan" | "amber";

const PHASE_COLORS: Record<
  PhaseColor,
  { border: string; dot: string; check: string }
> = {
  violet: {
    border: "border-l-primary",
    dot: "bg-primary",
    check: "text-primary",
  },
  cyan: {
    border: "border-l-accent",
    dot: "bg-accent",
    check: "text-accent",
  },
  amber: {
    border: "border-l-cta",
    dot: "bg-cta",
    check: "text-cta",
  },
};

function getModuleKey(phaseIndex: number, moduleIndex: number): string {
  return `${phaseIndex}-${moduleIndex}`;
}

export function Curriculum() {
  const [openModules, setOpenModules] = useState<Set<string>>(
    new Set([getModuleKey(0, 0)])
  );

  const toggleModule = (phaseIndex: number, moduleIndex: number) => {
    const key = getModuleKey(phaseIndex, moduleIndex);
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <section
      id="curriculum"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="curriculum-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="curriculum-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            12 Weeks to Mastery.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            A structured path from foundations to shipping your own product.
          </p>
        </FadeIn>

        {/* Phase groups */}
        <div className="space-y-8">
          {CURRICULUM.map((phase, phaseIndex) => {
            const phaseColor = phase.color as PhaseColor;
            const colors = PHASE_COLORS[phaseColor] ?? PHASE_COLORS.violet;

            return (
              <FadeIn
                key={phase.phase}
                delay={phaseIndex * 0.05}
                className="space-y-4"
              >
                {/* Phase header */}
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      colors.dot
                    )}
                    aria-hidden
                  />
                  <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                    {phase.phase}
                  </h3>
                  <span className="text-muted">{phase.weeks}</span>
                </div>

                {/* Phase card with modules */}
                <div
                  className={cn(
                    "rounded-xl border border-border bg-surface",
                    "border-l-4",
                    colors.border
                  )}
                >
                  <div className="divide-y divide-border">
                    {phase.modules.map((module, moduleIndex) => {
                      const key = getModuleKey(phaseIndex, moduleIndex);
                      const isOpen = openModules.has(key);

                      return (
                        <div key={key}>
                          <button
                            type="button"
                            onClick={() => toggleModule(phaseIndex, moduleIndex)}
                            className={cn(
                              "flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors",
                              "hover:bg-surface-light/50 sm:px-6 sm:py-5"
                            )}
                            aria-expanded={isOpen}
                            aria-controls={`module-content-${key}`}
                            id={`module-trigger-${key}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-muted">
                                {module.week}
                              </span>
                              <span className="font-medium text-foreground">
                                {module.title}
                              </span>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-5 w-5 shrink-0 text-muted transition-transform duration-200",
                                isOpen && "rotate-180"
                              )}
                              aria-hidden
                            />
                          </button>

                          <div
                            id={`module-content-${key}`}
                            role="region"
                            aria-labelledby={`module-trigger-${key}`}
                            className={cn(
                              "overflow-hidden transition-all duration-200",
                              isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            )}
                          >
                            <ul className="space-y-2 px-4 pb-4 sm:px-6 sm:pb-5">
                              {module.topics.map((topic) => (
                                <li
                                  key={topic}
                                  className="flex items-start gap-2 text-muted sm:text-base"
                                >
                                  <Check
                                    className={cn(
                                      "mt-0.5 h-4 w-4 shrink-0",
                                      colors.check
                                    )}
                                    aria-hidden
                                  />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
