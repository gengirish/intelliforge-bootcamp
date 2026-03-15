"use client";

import { Linkedin } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SKILL_BADGES = [
  "LangChain · LangGraph",
  "AWS Bedrock",
  "Multi-Agent Systems",
  "RAG Architecture",
  "Docker · CI/CD",
  "Enterprise Consulting",
  "Vibe Coding",
];

export function Instructor() {
  return (
    <section
      id="instructor"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="instructor-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2
            id="instructor-heading"
            className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground sm:mb-16 sm:text-4xl lg:text-5xl"
          >
            Learn From a Builder, Not Just a Teacher
          </h2>

          <div
            className={cn(
              "overflow-hidden rounded-xl border border-border bg-surface",
              "flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-12 lg:p-10"
            )}
          >
            {/* Left: Avatar */}
            <div className="shrink-0 lg:w-80">
              <div
                className={cn(
                  "relative mx-auto aspect-square w-48 max-w-full sm:w-56 lg:mx-0 lg:w-64",
                  "rounded-2xl bg-gradient-to-br from-primary/40 via-primary/20 to-accent/30",
                  "flex items-center justify-center",
                  "gradient-border shadow-[0_0_60px_rgba(124,58,237,0.2),0_0_100px_rgba(6,182,212,0.1)]"
                )}
                aria-hidden
              >
                <span className="text-4xl font-bold tracking-tight text-foreground/90 sm:text-5xl lg:text-6xl">
                  SRY
                </span>
              </div>
            </div>

            {/* Right: Details */}
            <div className="flex flex-1 flex-col gap-4 lg:gap-5">
              <div>
                <p className="text-xl font-semibold text-foreground sm:text-2xl">
                  Founder, IntelliForge AI
                </p>
                <p className="mt-1 text-muted sm:text-lg">
                  AI Engineer & Enterprise Architect
                </p>
              </div>

              <p className="text-muted leading-relaxed sm:text-base">
                With 13+ years of enterprise engineering experience across
                Banking, Pharma, Telecom, and IoT — working with Fortune 500
                companies globally. M.Tech in Data Science & AI. Has built and
                deployed production multi-agent AI systems, RAG pipelines, and
                the very AI products you&apos;ll learn to build in this bootcamp.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {SKILL_BADGES.map((badge) => (
                  <span
                    key={badge}
                    className={cn(
                      "rounded-full border border-border bg-surface-light px-3 py-1.5",
                      "text-xs font-medium text-foreground sm:text-sm"
                    )}
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <a
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-2 inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2.5",
                  "bg-primary/20 text-primary-light font-medium",
                  "transition-colors hover:bg-primary/30 hover:text-primary-light"
                )}
              >
                <Linkedin className="h-5 w-5" aria-hidden />
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
