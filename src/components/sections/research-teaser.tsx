import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { RESEARCH_DOCS, RESEARCH_PRINCIPLE } from "@/lib/research";

export function ResearchTeaser() {
  return (
    <section
      id="research"
      className="scroll-mt-20 border-y border-border bg-surface/40 py-16 sm:py-24"
      aria-labelledby="research-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-10 text-center sm:mb-12">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-accent">
            <BookOpen className="h-4 w-4" aria-hidden />
            IntelliForge Research Series
          </p>
          <h2
            id="research-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Evidence-Backed RoadMaps
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            {RESEARCH_PRINCIPLE} Explore the full curriculum and role-mapping research
            that powers this programme.
          </p>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2">
          {RESEARCH_DOCS.map((doc, i) => (
            <FadeIn key={doc.id} delay={i * 0.1}>
              <article className="flex h-full flex-col rounded-xl border border-border bg-surface p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-accent">{doc.id}</p>
                <h3 className="mt-2 text-xl font-bold text-foreground">{doc.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{doc.abstract}</p>
                <Link
                  href={`/research?doc=${doc.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-foreground"
                >
                  Read & download
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.25} className="mt-8 text-center">
          <Link
            href="/research"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30"
          >
            View interactive research hub
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
