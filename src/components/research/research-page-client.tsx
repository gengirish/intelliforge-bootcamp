"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { ResearchPdfTabs } from "@/components/research/research-pdf-tabs";
import { ResearchRoles } from "@/components/research/research-roles";
import {
  CURRICULUM_GLANCE,
  PORTFOLIO_PROJECTS,
  RESEARCH_DOCS,
  RESEARCH_PRINCIPLE,
} from "@/lib/research";
import { SPRINT_CONFIG } from "@/lib/constants";

function ResearchPdfTabsWithQuery() {
  const searchParams = useSearchParams();
  const docId = searchParams.get("doc");
  const initialIndex = RESEARCH_DOCS.findIndex((d) => d.id === docId);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />;
  }

  return <ResearchPdfTabs initialDocIndex={initialIndex >= 0 ? initialIndex : 0} />;
}

export function ResearchPageClient() {
  return (
    <>
      <div className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Bootcamp
          </Link>
          <Link
            href={SPRINT_CONFIG.href}
            className="rounded-lg bg-cta px-3 py-1.5 text-xs font-semibold text-background sm:text-sm"
          >
            Join AI Sprint
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <FadeIn className="mb-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            IntelliForge Research Series · June 2026
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            12-Week RoadMap &amp; 5 AI Roles
          </h1>
          <p className="mt-4 text-lg text-muted">
            {RESEARCH_PRINCIPLE} Use these guides to pick your target role and
            weight each week of the programme for maximum hiring signal.
          </p>
        </FadeIn>

        <FadeIn className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Research documents</h2>
          <ResearchPdfTabsWithQuery />
        </FadeIn>

        <FadeIn className="mb-16">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Curriculum at a glance</h2>
          <p className="mb-6 text-muted">
            From IF-RES-2026-012 — one shipped artefact per week, five portfolio-grade systems.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-4 py-3 font-semibold text-foreground">Week</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Module</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Phase</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Deliverable</th>
                </tr>
              </thead>
              <tbody>
                {CURRICULUM_GLANCE.map((row) => (
                  <tr key={row.week} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-medium text-accent">{row.week}</td>
                    <td className="px-4 py-3 text-foreground">{row.module}</td>
                    <td className="px-4 py-3 text-muted">{row.phase}</td>
                    <td className="px-4 py-3 text-muted">{row.deliverable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {PORTFOLIO_PROJECTS.map((p) => (
              <span
                key={p.name}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-xs sm:text-sm"
              >
                <span className="font-medium text-cta">{p.week}</span>
                <span className="mx-1.5 text-muted">·</span>
                <span className="text-foreground">{p.name}</span>
                <span className="ml-1.5 text-muted">({p.tag})</span>
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <h2 className="mb-2 text-2xl font-bold text-foreground">5 AI roles × 12-week RoadMap</h2>
          <p className="mb-6 text-muted">
            From IF-RES-2026-013 — salary ranges, key weeks, and portfolio signals per role.
          </p>
          <ResearchRoles />
        </FadeIn>
      </main>
    </>
  );
}
