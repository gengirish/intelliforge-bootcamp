import { FadeIn } from "@/components/animations/fade-in";
import { OUTCOMES } from "@/lib/constants";
import { cn } from "@/lib/utils";

function padNumber(n: number): string {
  return String(n).padStart(2, "0");
}

export function Outcomes() {
  return (
    <section
      id="outcomes"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="outcomes-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="outcomes-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            What You&apos;ll Be Able to Do After 12 Weeks
          </h2>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {OUTCOMES.map((outcome, index) => (
            <FadeIn key={outcome.title} delay={index * 0.08} className="group">
              <article
                className={cn(
                  "rounded-xl border border-border bg-surface-light p-6 transition-all duration-300",
                  "border-l-4 border-l-primary",
                  "hover:border-primary/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] sm:p-8"
                )}
              >
                <span
                  className="mb-4 inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-primary/20 px-2.5 text-sm font-bold text-primary"
                  aria-hidden
                >
                  {padNumber(index + 1)}
                </span>
                <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                  {outcome.title}
                </h3>
                <p className="mt-3 text-muted sm:text-base">
                  {outcome.description}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
