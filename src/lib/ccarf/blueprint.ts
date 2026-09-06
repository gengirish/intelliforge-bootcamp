/**
 * The CCAR-F exam blueprint as published by Anthropic, plus IntelliForge's
 * study-facing framing of it.
 *
 * Ported from the IntelliForge CCA-F course (`module-00-orientation-and-blueprint`
 * and `course-config.js`) so the site, the LMS course, and the exam-prep skill all
 * describe the same exam.
 */

import type { Domain, Scenario } from "./types";

export const EXAM = {
  name: "Claude Certified Architect — Foundations",
  abbr: "CCAR-F",
  /** Percentage proxy for the real exam's 720/1000 threshold. */
  passPercent: 72,
  /** Minutes allowed for a full mock attempt. */
  examMinutes: 120,
  /** Questions in a full attempt. */
  examQuestions: 60,
  /** The real exam draws this many of the eight scenarios per attempt. */
  scenariosPerAttempt: 4,
  scaledScoreRange: "100–1000",
  scaledPassMark: 720,
} as const;

export const DISCLAIMER =
  "Original practice questions written by IntelliForge from the public exam blueprint and Claude documentation. These are not real exam questions, and this material is not affiliated with, sponsored by, or endorsed by Anthropic.";

export const SHORT_DISCLAIMER =
  "Unofficial study material. Not affiliated with or endorsed by Anthropic.";

export const EXAM_FACTS: { label: string; value: string }[] = [
  { label: "Question type", value: "Multiple choice — one correct of four" },
  { label: "Questions", value: "60" },
  { label: "Time limit", value: "120 minutes" },
  { label: "Scoring", value: "100–1000 scale, passing score 720" },
  { label: "Guessing penalty", value: "None — answer every question" },
  { label: "Scenarios", value: "4 of 8 possible, randomly selected per attempt" },
  { label: "Validity", value: "12 months" },
];

export const DOMAINS: Domain[] = [
  {
    id: 1,
    title: "Agent Architecture & Orchestration",
    weight: 27,
    summary:
      "The Agent SDK's agentic loop, stop_reason-driven control flow, coordinator/subagent orchestration, hooks, escalation design, and error propagation across multi-step systems.",
  },
  {
    id: 2,
    title: "Tool Design & MCP Integration",
    weight: 18,
    summary:
      "Writing tool descriptions and schemas Claude can select correctly, MCP servers, tools vs. resources, and the boundary between what a tool does and what the model decides.",
  },
  {
    id: 3,
    title: "Claude Code Configuration & Workflows",
    weight: 20,
    summary:
      "CLAUDE.md and memory, skills and slash commands, hooks, sub-agents, permissions, headless mode, and Claude Code in CI.",
  },
  {
    id: 4,
    title: "Prompt Engineering & Structured Output",
    weight: 20,
    summary:
      "System prompt design, few-shot examples, extended thinking, JSON schema enforcement, and getting reliably parseable output from a probabilistic model.",
  },
  {
    id: 5,
    title: "Context Management & Reliability",
    weight: 15,
    summary:
      "Context window budgeting, compaction and memory strategies, retries and idempotency, batching, and keeping long-running sessions coherent.",
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Customer Support Resolution Agent",
    summary:
      "Agent SDK plus MCP tools (get_customer, lookup_order, process_refund, escalate_to_human) targeting 80%+ first-contact resolution.",
  },
  {
    id: 2,
    title: "Code Generation with Claude Code",
    summary:
      "Accelerating development with slash commands, CLAUDE.md, and planning mode.",
  },
  {
    id: 3,
    title: "Multi-Agent Research System",
    summary:
      "A coordinator delegating to web-research, document-analysis, synthesis, and report-generation subagents.",
  },
  {
    id: 4,
    title: "Developer Productivity Tools",
    summary:
      "Built-in tools (Read, Write, Bash, Grep, Glob) plus MCP servers for codebase exploration and boilerplate.",
  },
  {
    id: 5,
    title: "Claude Code for Continuous Integration",
    summary:
      "Automated code review, test generation, and PR feedback with false positives kept low.",
  },
  {
    id: 6,
    title: "Structured Data Extraction",
    summary:
      "Extracting from unstructured documents, validating against JSON schemas, and handling edge cases.",
  },
  {
    id: 7,
    title: "Conversational AI Architecture Patterns",
    summary:
      "Context window management, instruction persistence, memory strategies, safe tool design, and ambiguity handling.",
  },
  {
    id: 8,
    title: "Agentic AI Tools",
    summary:
      "Reported by candidates but not fully documented — treat as a gap area and apply the tool-design principles from the other scenarios.",
  },
];

export const OFFICIAL_DOCS: { group: string; links: { label: string; url: string }[] }[] = [
  {
    group: "Claude API",
    links: [
      { label: "Messages", url: "https://platform.claude.com/docs/en/api/messages" },
      { label: "Tool use", url: "https://platform.claude.com/docs/en/build-with-claude/tool-use" },
      { label: "Message Batches", url: "https://platform.claude.com/docs/en/build-with-claude/message-batches" },
      { label: "Extended thinking", url: "https://platform.claude.com/docs/en/build-with-claude/extended-thinking" },
      { label: "Prompt engineering", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview" },
    ],
  },
  {
    group: "Claude Agent SDK",
    links: [
      { label: "Overview", url: "https://platform.claude.com/docs/en/agent-sdk/overview" },
      { label: "Hooks", url: "https://platform.claude.com/docs/en/agent-sdk/hooks" },
      { label: "Subagents", url: "https://platform.claude.com/docs/en/agent-sdk/subagents" },
      { label: "Sessions", url: "https://platform.claude.com/docs/en/agent-sdk/sessions" },
    ],
  },
  {
    group: "Model Context Protocol",
    links: [
      { label: "MCP core", url: "https://modelcontextprotocol.io/" },
      { label: "Tools", url: "https://modelcontextprotocol.io/docs/concepts/tools" },
      { label: "Resources", url: "https://modelcontextprotocol.io/docs/concepts/resources" },
      { label: "Servers", url: "https://modelcontextprotocol.io/docs/concepts/servers" },
    ],
  },
  {
    group: "Claude Code",
    links: [
      { label: "Overview", url: "https://code.claude.com/docs/en/overview" },
      { label: "CLAUDE.md and memory", url: "https://code.claude.com/docs/en/memory" },
      { label: "Skills and slash commands", url: "https://code.claude.com/docs/en/skills" },
      { label: "Hooks", url: "https://code.claude.com/docs/en/hooks" },
      { label: "Sub-agents", url: "https://code.claude.com/docs/en/sub-agents" },
      { label: "MCP integration", url: "https://code.claude.com/docs/en/mcp" },
      { label: "GitHub Actions", url: "https://code.claude.com/docs/en/github-actions" },
      { label: "GitLab CI/CD", url: "https://code.claude.com/docs/en/gitlab-ci-cd" },
      { label: "Headless mode", url: "https://code.claude.com/docs/en/headless" },
    ],
  },
];

/**
 * Rules of thumb that separate the correct answer from a plausible one. Distilled
 * from the failure-mode tables in the IntelliForge CCA-F module overviews.
 */
export const MENTAL_MODEL: { rule: string; detail: string }[] = [
  {
    rule: "Fix the root cause, not the symptom",
    detail:
      "When a tool is chosen wrongly, the first move is almost always a better tool description — not few-shot examples, not a routing classifier, not a bigger model.",
  },
  {
    rule: "Prefer deterministic over probabilistic",
    detail:
      "If a step must always happen, enforce it in code — a programmatic precondition or a hook — rather than instructing the model to remember.",
  },
  {
    rule: "Match the fix to the size of the problem",
    detail:
      "A 12% failure rate on one tool call does not justify re-architecting into a multi-agent system. The right answer is usually the smallest one that fully addresses the cause.",
  },
];

export const COMMON_DISTRACTORS: string[] = [
  "Parsing natural language for control flow instead of reading stop_reason",
  "Adding few-shot examples where the real defect is an ambiguous tool description",
  "Introducing a routing classifier or a second model to fix a prompt-level problem",
  "Relying on model self-rated confidence instead of explicit, stated criteria",
  "Capping iterations with a fixed number rather than a real termination signal",
  "Reaching for fine-tuning or a larger model before exhausting prompt and tool design",
  "Merging distinct tools instead of describing their boundaries clearly",
  "Escalating on sentiment or difficulty rather than on a genuine policy gap",
];

/**
 * Credentials shown on the hub.
 *
 * TODO(launch): replace with real Credly public badge URLs before announcing.
 * A badge with no `url` renders as "verification pending" rather than a dead link.
 */
export const CREDENTIALS: { title: string; issued: string; url: string | null }[] = [
  { title: "Claude Certified Architect: Foundations", issued: "", url: null },
];

/** TODO(launch): 1:1 booking link (Topmate/Calendly). Section hides itself when null. */
export const BOOKING_URL: string | null = null;
