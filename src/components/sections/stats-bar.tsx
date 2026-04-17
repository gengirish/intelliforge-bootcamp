"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { CountUp } from "@/components/animations/count-up";
import { STATS } from "@/lib/constants";

export function StatsBar() {
  return (
    <FadeIn>
      <section
        className="border-y border-border bg-surface py-12 sm:py-16"
        aria-label="Key statistics"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-3 lg:grid-cols-5">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center"
              >
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  duration={2}
                  className="text-3xl font-bold gradient-text sm:text-4xl lg:text-5xl"
                />
                <p className="mt-2 text-sm text-muted sm:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
