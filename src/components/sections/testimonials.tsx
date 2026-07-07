import { ExternalLink, Linkedin } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { LEARNER_TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 bg-surface py-16 sm:py-24 lg:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            What Learners Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Real professionals who&apos;ve attended IntelliForge live sessions.
            Every profile links to a verified LinkedIn — no anonymous quotes.
          </p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {LEARNER_TESTIMONIALS.map((testimonial, index) => (
            <FadeIn key={testimonial.linkedin} delay={index * 0.08}>
              <article
                className={cn(
                  "flex h-full flex-col rounded-xl border border-border bg-surface-light p-6 sm:p-8",
                  "transition-all duration-300 hover:border-accent/30"
                )}
              >
                {testimonial.quote ? (
                  <>
                    <span
                      className="text-5xl font-serif leading-none text-primary-light/40"
                      aria-hidden
                    >
                      &ldquo;
                    </span>
                    <p className="mt-2 flex-1 text-foreground/90">
                      {testimonial.quote}
                    </p>
                  </>
                ) : (
                  <p className="flex-1 text-sm text-muted">
                    IntelliForge AI Bootcamp &amp; sprint participant — profile
                    verified on LinkedIn.
                  </p>
                )}

                <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                      "bg-primary/20 text-sm font-semibold text-primary-light"
                    )}
                    aria-hidden
                  >
                    {testimonial.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted">{testimonial.role}</p>
                  </div>
                </div>

                <a
                  href={testimonial.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5",
                    "border border-border bg-background text-sm font-medium text-foreground",
                    "transition-colors hover:border-accent/40 hover:bg-surface",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                  )}
                >
                  <Linkedin className="h-4 w-4 shrink-0 text-[#0A66C2]" aria-hidden />
                  View on LinkedIn
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                </a>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
