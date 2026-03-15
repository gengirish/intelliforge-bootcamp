"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";

const FOR_YOU_ITEMS = [
  "You know basic Python and want to level up to AI engineering",
  "You want to build AI products, not just learn AI theory",
  "You're ready to commit 15-18 hours/week for 12 weeks",
  "You want multiple career options — job, freelance, or founder",
  "You value learning from real enterprise practitioners",
];

const NOT_FOR_YOU_ITEMS = [
  "You're looking for a quick certification without real work",
  "You have zero programming experience",
  "You want passive video-only learning with no projects",
  "You expect guaranteed job placement without effort",
];

export function WhoIsFor() {
  return (
    <section
      id="who-is-for"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="who-is-for-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="who-is-for-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Is This Bootcamp Right for You?
          </h2>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* This IS for you */}
          <FadeIn delay={0.1} direction="left">
            <article
              className={cn(
                "rounded-xl border border-border bg-surface-light p-6 sm:p-8",
                "border-l-4 border-l-emerald-500"
              )}
            >
              <h3 className="mb-6 text-xl font-semibold text-emerald-400 sm:text-2xl">
                This IS for you if…
              </h3>
              <ul className="space-y-4">
                {FOR_YOU_ITEMS.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle
                      className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500"
                      aria-hidden
                    />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </FadeIn>

          {/* This is NOT for you */}
          <FadeIn delay={0.2} direction="right">
            <article
              className={cn(
                "rounded-xl border border-border bg-surface-light p-6 sm:p-8",
                "border-l-4 border-l-red-500"
              )}
            >
              <h3 className="mb-6 text-xl font-semibold text-red-400 sm:text-2xl">
                This is NOT for you if…
              </h3>
              <ul className="space-y-4">
                {NOT_FOR_YOU_ITEMS.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle
                      className="mt-0.5 h-6 w-6 shrink-0 text-red-500"
                      aria-hidden
                    />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
