import type { Metadata } from "next";
import Link from "next/link";
import {
  COMMON_DISTRACTORS,
  DISCLAIMER,
  DOMAINS,
  EXAM,
  EXAM_FACTS,
  MENTAL_MODEL,
  OFFICIAL_DOCS,
  SCENARIOS,
} from "@/lib/ccarf/blueprint";

export const metadata: Metadata = {
  title: "CCAR-F Exam Guide — Blueprint, Domain Weights & Study Plan",
  description:
    "The Claude Certified Architect, Foundations blueprint in one page: exam format, the five domains and their weights, all eight scenarios, the mental model that separates the right answer from the plausible one, and the documentation to read.",
  alternates: { canonical: "/claude/foundations" },
  openGraph: {
    title: "CCAR-F Exam Guide — Blueprint & Study Plan",
    description:
      "Exam format, five domains with weights, eight scenarios, and the documentation set for the Claude Certified Architect, Foundations exam.",
    url: "/claude/foundations",
  },
};

function Section({
  title,
  children,
  lead,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      {lead && <p className="mt-2 text-sm leading-relaxed text-muted">{lead}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function FoundationsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium uppercase tracking-wider text-accent">Exam guide</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Claude Certified Architect: Foundations
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        {EXAM.abbr} tests whether you make sound tradeoff decisions when building production
        systems on Claude — not whether you can recite an API surface. Almost every question is
        a symptom in a running system, and the right answer is the smallest change that
        addresses the cause. This page is the blueprint, the scenarios, and the reading list.
      </p>

      <Section title="Exam format">
        <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {EXAM_FACTS.map((fact) => (
            <div key={fact.label} className="flex flex-wrap gap-2 bg-surface px-4 py-3 text-sm">
              <dt className="w-40 shrink-0 text-muted">{fact.label}</dt>
              <dd className="text-foreground">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        title="The five domains"
        lead="Weights are the blueprint's. Allocate study hours roughly in proportion — Domain 1 alone is more than a quarter of the exam."
      >
        <div className="space-y-3">
          {DOMAINS.map((domain) => (
            <div key={domain.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-foreground">
                  {domain.id}. {domain.title}
                </h3>
                <span className="rounded-full border border-primary/50 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary-light">
                  {domain.weight}%
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{domain.summary}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-light">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${domain.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="The eight scenarios"
        lead={`Each attempt draws ${EXAM.scenariosPerAttempt} of these ${SCENARIOS.length} at random, so you can sit the exam having never seen half of them. Prepare all eight.`}
      >
        <ol className="space-y-3">
          {SCENARIOS.map((scenario) => (
            <li key={scenario.id} className="rounded-xl border border-border bg-surface p-4">
              <h3 className="text-sm font-semibold text-foreground">
                {scenario.id}. {scenario.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{scenario.summary}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="The mental model"
        lead="Most questions offer four things that would all help a little. These three rules pick the one that is actually being asked for."
      >
        <div className="space-y-3">
          {MENTAL_MODEL.map((rule, i) => (
            <div key={rule.rule} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-semibold text-foreground">
                <span className="mr-2 font-mono text-sm text-accent">R{i + 1}</span>
                {rule.rule}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{rule.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Distractors that keep coming back"
        lead="Recognising these on sight removes one or two options before you start reasoning."
      >
        <ul className="space-y-2">
          {COMMON_DISTRACTORS.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span aria-hidden className="mt-0.5 text-red-400">
                ✗
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="How to study this">
        <ol className="space-y-3">
          {[
            {
              step: "Diagnose",
              body: "Sit the free mock exam cold. The per-domain breakdown tells you where your hours should go far better than a syllabus does.",
            },
            {
              step: "Drill the weak domains",
              body: "Use untimed practice, one domain at a time. Read the documentation link on every question you miss, not just the explanation.",
            },
            {
              step: "Build something",
              body: "Write an agent loop that keys on stop_reason, an MCP server with two tools, and a CLAUDE.md that actually changes what Claude Code does. The exam asks about production tradeoffs; those are hard to fake.",
            },
          ].map((item, i) => (
            <li key={item.step} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-semibold text-foreground">
                <span className="mr-2 font-mono text-sm text-accent">{i + 1}</span>
                {item.step}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/claude/quiz"
            className="rounded-lg bg-cta px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-cta-hover"
          >
            Take the free mock exam →
          </Link>
          <Link
            href="/claude/review"
            className="rounded-lg border border-border px-5 py-2.5 text-sm text-muted transition-colors hover:border-primary-light/60 hover:text-foreground"
          >
            Browse the question bank
          </Link>
        </div>
      </Section>

      <Section
        title="Documentation to read"
        lead="Every practice question on this site links to one of these pages. If you have read all of them carefully, you have covered the examinable surface."
      >
        <div className="space-y-5">
          {OFFICIAL_DOCS.map((group) => (
            <div key={group.group}>
              <h3 className="text-sm font-semibold text-foreground">{group.group}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {group.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary-light/60 hover:text-foreground"
                    >
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <p className="mt-14 text-xs leading-relaxed text-muted">{DISCLAIMER}</p>
    </main>
  );
}
