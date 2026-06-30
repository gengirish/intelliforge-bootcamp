"use client";

import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import { RESEARCH_DOCS } from "@/lib/research";
import { cn } from "@/lib/utils";

export function ResearchPdfTabs({ initialDocIndex = 0 }: { initialDocIndex?: number }) {
  const [activeIndex, setActiveIndex] = useState(initialDocIndex);

  useEffect(() => {
    setActiveIndex(initialDocIndex);
  }, [initialDocIndex]);
  const active = RESEARCH_DOCS[activeIndex];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Research documents">
        {RESEARCH_DOCS.map((doc, i) => (
          <button
            key={doc.id}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              i === activeIndex
                ? "border-primary/50 bg-primary/10 text-foreground"
                : "border-border bg-surface text-muted hover:border-primary/30 hover:text-foreground"
            )}
          >
            <FileText className="h-4 w-4 shrink-0" aria-hidden />
            {doc.id}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-accent">{active.id}</p>
            <h3 className="mt-1 text-xl font-bold text-foreground">{active.title}</h3>
            <p className="mt-1 text-sm text-muted">{active.subtitle}</p>
          </div>
          <a
            href={active.pdfPath}
            download
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-surface-light px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download PDF
          </a>
        </div>

        <ul className="mb-4 space-y-1 text-sm text-muted">
          {active.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span className="text-accent" aria-hidden>
                →
              </span>
              {h}
            </li>
          ))}
        </ul>

        <div className="overflow-hidden rounded-lg border border-border bg-background">
          <iframe
            key={active.pdfPath}
            src={`${active.pdfPath}#view=FitH`}
            title={`${active.title} (${active.id})`}
            className="h-[min(70vh,640px)] w-full"
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          PDF not loading?{" "}
          <a href={active.pdfPath} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            Open in new tab
          </a>
        </p>
      </div>
    </div>
  );
}
