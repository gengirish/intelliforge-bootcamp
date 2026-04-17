"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";
import { LMS_REGISTER_URL, WHATSAPP_DEMO_URL } from "@/lib/constants";

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28 lg:py-32"
      aria-labelledby="final-cta-heading"
    >
      {/* Subtle radial gradient background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(124,58,237,0.18),transparent_70%)]"
        aria-hidden
      />

      <FadeIn className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="final-cta-heading"
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="block">Stop Learning AI.</span>
          <span className="block">
            Start <span className="gradient-text">Shipping It.</span>
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
          Book a free demo class. No payment. No commitment. Just see if this is
          right for you.
        </p>

        <a
          href={WHATSAPP_DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "glow-cta mt-10 inline-flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-cta px-10 py-5 text-lg font-semibold text-background",
            "shadow-lg transition-colors duration-200 hover:bg-cta-hover"
          )}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Book Your Free Demo Class
        </a>

        <a
          href={LMS_REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "mt-4 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-accent/30 px-10 py-4 text-base font-semibold text-accent",
            "hover:bg-accent/10 transition-colors"
          )}
        >
          Or Try a Free Class First
        </a>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-muted sm:gap-6">
          <span>15-day money-back</span>
          <span className="hidden text-border sm:inline">·</span>
          <span>0% EMI available</span>
          <span className="hidden text-border sm:inline">·</span>
          <span>Early Bird ₹49,999</span>
        </div>
      </FadeIn>
    </section>
  );
}
