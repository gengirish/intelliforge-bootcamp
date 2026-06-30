"use client";

import { useState } from "react";
import { AI_ROLES } from "@/lib/research";
import { cn } from "@/lib/utils";

export function ResearchRoles() {
  const [activeId, setActiveId] = useState<string>(AI_ROLES[0].id);
  const role = AI_ROLES.find((r) => r.id === activeId) ?? AI_ROLES[0];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="AI career roles">
        {AI_ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={r.id === activeId}
            onClick={() => setActiveId(r.id)}
            className={cn(
              "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
              r.id === activeId
                ? "border-cta/50 bg-cta/15 text-foreground"
                : "border-border text-muted hover:border-cta/30 hover:text-foreground"
            )}
          >
            {r.id} · {r.title}
          </button>
        ))}
      </div>

      <article className="rounded-xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-accent">{role.id}</p>
            <h3 className="mt-1 text-2xl font-bold text-foreground">{role.title}</h3>
            <p className="mt-1 text-muted">{role.skills}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-cta">{role.salary}</p>
            <p className="text-sm text-muted">Demand: {role.demand}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Key weeks</p>
          <div className="flex flex-wrap gap-2">
            {role.keyWeeks.map((w) => (
              <span
                key={w}
                className="rounded-md bg-primary/15 px-2 py-1 text-xs font-medium text-primary-light"
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Portfolio signal</p>
            <ul className="space-y-1 text-sm text-muted">
              {role.portfolio.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-accent" aria-hidden>
                    ◆
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-surface-light p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-cta">Hiring signal</p>
            <p className="text-sm leading-relaxed text-muted">{role.hiringSignal}</p>
          </div>
        </div>
      </article>
    </div>
  );
}
