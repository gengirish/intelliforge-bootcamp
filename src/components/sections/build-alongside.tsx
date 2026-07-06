import {
  Briefcase,
  ExternalLink,
  FileText,
  GraduationCap,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import {
  BUILD_ALONGSIDE,
  BUILD_ALONGSIDE_PRODUCTS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  GraduationCap,
  FileText,
  ShieldCheck,
  Briefcase,
};

export function BuildAlongside() {
  return (
    <section
      id="build-alongside"
      className="scroll-mt-20 bg-surface py-16 sm:py-24 lg:py-28"
      aria-labelledby="build-alongside-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="build-alongside-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Build-Alongside: Ship on a{" "}
            <span className="gradient-text">Real Product</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted">
            Top performers get staffed on a live IntelliForge product and ship
            to a production repo — tracked on the same system our intern cohort
            runs. Not a capstone toy. A real contribution recruiters can verify.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <blockquote
            className={cn(
              "mx-auto mb-12 max-w-3xl rounded-xl border-l-4 border-l-accent bg-accent/5 px-6 py-5",
              "text-lg font-medium text-foreground sm:text-xl"
            )}
          >
            &ldquo;{BUILD_ALONGSIDE.killLine}&rdquo;
          </blockquote>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {BUILD_ALONGSIDE_PRODUCTS.map((product, index) => {
            const IconComponent = ICON_MAP[product.icon] ?? FileText;
            return (
              <FadeIn key={product.name} delay={index * 0.08}>
                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex h-full flex-col rounded-xl border border-border bg-surface-light p-6",
                    "transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:glow-cyan",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                  )}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                      <IconComponent className="h-5 w-5" aria-hidden />
                    </div>
                    <ExternalLink
                      className="h-4 w-4 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                    {product.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted sm:text-base">
                    {product.description}
                  </p>
                  <span className="mt-4 text-xs text-accent group-hover:underline">
                    {product.href.replace("https://", "")}
                  </span>
                </a>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.3} className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-sm text-muted sm:text-base">
            {BUILD_ALONGSIDE.capacityNote}
            {BUILD_ALONGSIDE.slotsDisplay && (
              <>
                {" "}
                Current capacity:{" "}
                <span className="font-medium text-foreground">
                  {BUILD_ALONGSIDE.slotsDisplay}
                </span>
              </>
            )}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
