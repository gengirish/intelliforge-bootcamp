import { FadeIn } from "@/components/animations/fade-in";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            What People Say About IntelliForge
          </h2>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <FadeIn key={testimonial.initials} delay={index * 0.1}>
              <article
                className={cn(
                  "relative rounded-xl border border-border bg-surface-light p-6 sm:p-8"
                )}
              >
                <span
                  className="absolute -top-2 left-6 text-6xl font-serif text-primary-light/40 sm:text-7xl"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="relative z-10 text-foreground/90 sm:text-base">
                  {testimonial.quote}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                      "bg-primary/20 text-primary-light font-semibold"
                    )}
                    aria-hidden
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
