/** Structured excerpts from IF-RES-2026-012 & IF-RES-2026-013 research series. */

export const RESEARCH_DOCS = [
  {
    id: "IF-RES-2026-012",
    title: "12-Week AI Upskill RoadMap",
    subtitle: "Outcome-based curriculum · pre-read & post-read for every session",
    pdfPath: "/research/if-res-2026-012-12-week-roadmap.pdf",
    author: "Girish Hiremath",
    published: "June 2026",
    abstract:
      "Complete week-by-week curriculum: 12 sessions, 6 phases, 5 portfolio-grade agentic projects, and curated free resources for every session.",
    highlights: [
      "12 shipped deliverables — code, APIs, agents, deployed apps",
      "5 portfolio projects with quantified business impact",
      "6 phases from AI Foundations to Capstone & Career",
    ],
  },
  {
    id: "IF-RES-2026-013",
    title: "5 AI Roles You Can Become",
    subtitle: "Post-session guide · map the RoadMap to your target role",
    pdfPath: "/research/if-res-2026-013-5-ai-roles.pdf",
    author: "Girish Hiremath",
    published: "June 2026",
    abstract:
      "Maps the 12-week programme to five high-demand roles: AI Engineer, ML Engineer, Agent Engineer, Voice AI Engineer, and AI Product Engineer — with salary ranges, key weeks, and portfolio signals.",
    highlights: [
      "5 roles with India salary ranges (2026 market data)",
      "Week-weighting per role — know where to invest extra effort",
      "Portfolio projects & open-source contribution paths",
    ],
  },
] as const;

export const CURRICULUM_GLANCE = [
  { week: "W01", module: "AI & LLM Foundations", phase: "AI Foundations", deliverable: "Code" },
  { week: "W02", module: "AI Engineering Toolkit", phase: "AI Foundations", deliverable: "Code + Eval" },
  { week: "W03", module: "Vector Databases & Embeddings", phase: "RAG & Data", deliverable: "Data Pipeline" },
  { week: "W04", module: "RAG Systems Architecture", phase: "RAG & Data", deliverable: "Portfolio: RAG + Generator" },
  { week: "W05", module: "AI Agent Design Patterns", phase: "Agents & Automation", deliverable: "Portfolio: Agentic System" },
  { week: "W06", module: "Task Queues & Async AI Workflows", phase: "Agents & Automation", deliverable: "Portfolio: Multi-Agent" },
  { week: "W07", module: "Next.js + AI Integration", phase: "Full-Stack AI", deliverable: "Portfolio: Swarm + SaaS" },
  { week: "W08", module: "Prisma, Supabase & Payments", phase: "Full-Stack AI", deliverable: "Monetised App" },
  { week: "W09", module: "Production Deployment & Observability", phase: "Production & DevOps", deliverable: "Runbook + Monitoring" },
  { week: "W10", module: "Security, Cost & Responsible AI", phase: "Production & DevOps", deliverable: "Portfolio: LLM Gateway" },
  { week: "W11", module: "Capstone — Build & Ship", phase: "Capstone", deliverable: "Shipped Product" },
  { week: "W12", module: "Career Strategy & Personal GTM", phase: "Career & GTM", deliverable: "Personal Brand" },
] as const;

export const PORTFOLIO_PROJECTS = [
  { week: "W04", name: "Research-to-Deck Generator", tag: "RAG + python-pptx" },
  { week: "W05", name: "Compliance Sentinel Agent", tag: "LangGraph + RAG" },
  { week: "W06", name: "Autonomous Code Reviewer", tag: "Multi-agent + LLM-as-judge" },
  { week: "W07", name: "Recruiting Swarm", tag: "Multi-agent SaaS" },
  { week: "W10", name: "Cost-Aware Agent Router", tag: "Model routing + Prometheus" },
] as const;

export const AI_ROLES = [
  {
    id: "R1",
    title: "AI Engineer",
    skills: "RAG · Agents · MCP · Deployment",
    salary: "₹18–35 LPA",
    demand: "Very High",
    keyWeeks: ["W01", "W02", "W03", "W04", "W05", "W09", "W10", "W11"],
    hiringSignal:
      "A deployed RAG API + one agentic project with a Loom demo is the minimum bar for AI Engineer roles in 2026.",
    portfolio: ["Compliance Sentinel Agent", "Autonomous Code Reviewer", "Research-to-Deck Generator"],
  },
  {
    id: "R2",
    title: "ML Engineer",
    skills: "Models · Pipelines · Evaluation",
    salary: "₹20–45 LPA",
    demand: "High",
    keyWeeks: ["W01", "W02", "W03", "W04", "W09", "W10", "W11"],
    hiringSignal:
      "LLM evaluation experience (RAGAS, LLM-as-judge, latency benchmarking) commands a 40% premium over traditional ML roles.",
    portfolio: ["Cost-Aware Agent Router", "Research-to-Deck Generator", "LLM Eval Harness (W02)"],
  },
  {
    id: "R3",
    title: "Agent Engineer",
    skills: "Tool orchestration · Memory · MCP",
    salary: "₹22–50 LPA",
    demand: "Very High",
    keyWeeks: ["W02", "W05", "W06", "W09", "W10", "W11"],
    hiringSignal:
      "ReAct agents with tool calling, async job queues, and observable multi-step traces — not chatbot wrappers.",
    portfolio: ["Compliance Sentinel Agent", "Autonomous Code Reviewer", "Recruiting Swarm"],
  },
  {
    id: "R4",
    title: "Voice AI Engineer",
    skills: "STT · TTS · Multimodal systems",
    salary: "₹18–40 LPA",
    demand: "High",
    keyWeeks: ["W01", "W02", "W05", "W06", "W07", "W11"],
    hiringSignal:
      "Streaming pipelines, low-latency inference, and multimodal agent interfaces — voice is the next UX layer for agents.",
    portfolio: ["Voice-enabled agent capstone", "Async workflow infrastructure (W06)"],
  },
  {
    id: "R5",
    title: "AI Product Engineer",
    skills: "System design · UX · Scalability",
    salary: "₹25–60 LPA",
    demand: "Very High",
    keyWeeks: ["W01", "W02", "W07", "W08", "W09", "W10", "W11", "W12"],
    hiringSignal:
      "End-to-end shipped AI SaaS with auth, payments, and observability — the role that blends builder + product sense.",
    portfolio: ["Recruiting Swarm", "Monetised App (W08)", "Capstone shipped product (W11)"],
  },
] as const;

export const RESEARCH_PRINCIPLE =
  "Most people build chatbots. Builders build systems that solve expensive problems.";
