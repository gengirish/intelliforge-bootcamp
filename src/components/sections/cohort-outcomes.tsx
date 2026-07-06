import { Clock } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";

export function CohortOutcomes() {
  return (
    <section
      id="cohort-outcomes"
      className="scroll-mt-20 bg-surface py-16 sm:py-24 lg:py-28"
      aria-labelledby="cohort-outcomes-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center">
          <h2
            id="cohort-outcomes-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Cohort 1 Outcomes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Coming as our first cohort ships.
          </p>

          <div
            className={cn(
              "mx-auto mt-10 max-w-lg rounded-xl border border-dashed border-border bg-surface-light p-8 sm:p-10"
            )}
          >
            <Clock
              className="mx-auto h-10 w-10 text-muted"
              aria-hidden
            />
            <p className="mt-4 text-foreground">
              We don&apos;t fabricate learner testimonials. When Cohort 1
              graduates ship to live repos and receive credentials, their
              outcomes — shipped-product links, mentor scores, and verification
              URLs — will appear here.
            </p>
            <p className="mt-4 text-sm text-muted">
              Until then, the client quotes above show what IntelliForge ships
              for paying customers. Your credential will prove what{" "}
              <em>you</em> ship.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
