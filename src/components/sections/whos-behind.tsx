import { Linkedin } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { FOUNDER, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function WhosBehind() {
  return (
    <section
      id="whos-behind"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="whos-behind-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="whos-behind-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Who&apos;s Behind This
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            A live product studio, not a content factory.
          </p>
        </FadeIn>

        {/* Founder bio */}
        <FadeIn delay={0.1}>
          <div
            className={cn(
              "overflow-hidden rounded-xl border border-border bg-surface",
              "flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-start lg:gap-12 lg:p-10"
            )}
          >
            <div className="shrink-0 lg:w-72">
              <div
                className={cn(
                  "relative mx-auto aspect-square w-48 max-w-full sm:w-56 lg:mx-0 lg:w-64",
                  "rounded-2xl bg-gradient-to-br from-primary/40 via-primary/20 to-accent/30",
                  "flex items-center justify-center",
                  "gradient-border shadow-[0_0_60px_rgba(124,58,237,0.2),0_0_100px_rgba(6,182,212,0.1)]"
                )}
                aria-hidden
              >
                <span className="text-4xl font-bold tracking-tight text-foreground/90 sm:text-5xl">
                  {FOUNDER.name.charAt(0)}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div>
                <p className="text-xl font-semibold text-foreground sm:text-2xl">
                  {FOUNDER.name}
                </p>
                <p className="mt-1 text-muted sm:text-lg">
                  {FOUNDER.title}, {FOUNDER.company}
                </p>
                <p className="mt-1 text-sm text-muted">{FOUNDER.location}</p>
              </div>

              <p className="text-muted leading-relaxed">{FOUNDER.bio}</p>

              <ul className="space-y-2 text-sm text-muted">
                <li>
                  <span className="font-medium text-foreground">
                    Venture studio:
                  </span>{" "}
                  25+ live products deployed
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    IF-RES research:
                  </span>{" "}
                  <Link
                    href="/research"
                    className="text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded"
                  >
                    Published AI upskill roadmaps
                  </Link>
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Anthropic partner path:
                  </span>{" "}
                  Enterprise AI engineering practice
                </li>
              </ul>

              <div className="flex flex-wrap gap-2 pt-2">
                {FOUNDER.skillBadges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-border bg-surface-light px-3 py-1.5 text-xs font-medium text-foreground sm:text-sm"
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
                  "transition-colors hover:bg-primary/30",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
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
