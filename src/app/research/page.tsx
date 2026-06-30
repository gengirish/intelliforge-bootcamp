import type { Metadata } from "next";
import { Suspense } from "react";
import { ResearchPageClient } from "@/components/research/research-page-client";

export const metadata: Metadata = {
  title: "Research — 12-Week RoadMap & 5 AI Roles · IntelliForge AI",
  description:
    "IF-RES-2026-012 curriculum guide and IF-RES-2026-013 role-mapping research. Week-by-week deliverables, portfolio projects, and India salary data for five AI engineering roles.",
  openGraph: {
    title: "IntelliForge Research Series — AI Upskill RoadMap",
    description:
      "Evidence-backed curriculum and career intelligence for the 12-week AI bootcamp programme.",
  },
};

export default function ResearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-24 text-center text-muted">Loading research…</div>
      }
    >
      <ResearchPageClient />
    </Suspense>
  );
}
