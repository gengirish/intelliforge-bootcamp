import { Bot, Database, Sparkles } from "lucide-react";
import { Fragment } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";
import { FREE_PREVIEW, LMS_REGISTER_URL } from "@/lib/constants";

const ICON_MAP = {
  Bot,
  Database,
  Sparkles,
} as const;

export function FreePreview() {
  return (
    <section
      id="free-preview"
      className="scroll-mt-20 bg-surface py-16 sm:py-24 lg:py-28"
      aria-labelledby="free-preview-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="free-preview-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            {FREE_PREVIEW.heading.split("Free Class").map((part, i) => (
              <Fragment key={i}>
                {part}
                {i === 0 && (
                  <span className="gradient-text">Free Class</span>
                )}
              </Fragment>
            ))}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            {FREE_PREVIEW.subheading}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FREE_PREVIEW.sessions.map((session, index) => {
            const IconComponent =
              ICON_MAP[session.icon as keyof typeof ICON_MAP] ?? Bot;
            return (
              <FadeIn key={session.title} delay={index * 0.1}>
                <article
                  className={cn(
                    "group rounded-xl border border-border bg-surface-light p-6 transition-all duration-300",
                    "hover:-translate-y-1 hover:border-accent/30"
                  )}
                >
                  <div
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent"
                    aria-hidden
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {session.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{session.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
                      {session.duration}
                    </span>
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
                      {session.level}
                    </span>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.3} className="mt-12 text-center">
          <Link
            href={LMS_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 font-semibold text-background",
              "transition-all duration-300 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
            )}
          >
            Start Free Class →
          </Link>
          <p className="mt-4 text-sm text-muted">
            No signup required. No payment. Just learn.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
