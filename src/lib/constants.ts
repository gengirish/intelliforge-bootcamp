export const SITE_CONFIG = {
  name: "IntelliForge AI Bootcamp",
  tagline: "Build AI Agents. Ship AI Products. Own Your AI Future.",
  description:
    "12-week intensive bootcamp to master AI Agent Development and Vibe Coding. Build, deploy & monetize production AI systems. From the team with 13+ years of Fortune 500 enterprise experience.",
  url: "https://upskill.intelliforge.tech",
  mainSite: "https://www.intelliforge.tech",
  lms: "https://learning.intelliforge.tech",
  contact: {
    email: "contact@intelliforge.tech",
    phone: "+91 85559 60837",
    whatsapp: "918555960837",
    location: "Hyderabad, Telangana, India",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/intelliforge-ai",
  },
};

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I'm interested in the IntelliForge AI Bootcamp. I'd like to book a free demo class."
);

export const WHATSAPP_DEMO_URL = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`;

export const getWhatsAppUrl = (message: string) =>
  `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(message)}`;

export const LMS_REGISTER_URL = `${SITE_CONFIG.lms}/register`;
export const LMS_SIGNIN_URL = `${SITE_CONFIG.lms}/api/auth/signin`;
export const LMS_FEEDBACK_URL = `${SITE_CONFIG.lms}/feedback`;

export const ZOOM_MEETING = {
  topic: "Why Upskill and How?",
  // Update `time` when the next live session is confirmed
  time: "Jun 28, 2026 09:00 AM Mumbai, Kolkata, New Delhi",
  displayShort: "Jun 28, 9:00 AM IST",
  displayDate: "Next session — check WhatsApp for schedule",
  joinUrl:
    "https://us06web.zoom.us/j/86071939853?pwd=VovRc9JnO1qDKxqK9L3JNJ3cp3KwCB.1",
  meetingId: "86071939853",
  passcode: "314874",
  chatUrl: "https://us06web.zoom.us/launch/jc/86071939853",
};

export const ZOOM_URL = `${SITE_CONFIG.url}/zoom`;

export const WHATSAPP_GROUP = {
  name: "AI Roadmap Cohort!",
  inviteUrl: "https://chat.whatsapp.com/LwxMCJ1EqLm4oLOG0fLqmE",
};

export const WHATSAPP_GROUP_URL = `${SITE_CONFIG.url}/whatsapp`;

/** Paid sprint enrollments join this WhatsApp group after checkout. */
export const SPRINT_COHORT_WHATSAPP = {
  name: "UpSkill-Cohort-01",
  inviteUrl: "https://chat.whatsapp.com/EG5aUDfvrHbGa9tvEaleAu",
};

export const SPRINT_COHORT_WHATSAPP_URL = `${SITE_CONFIG.url}/sprint/whatsapp`;

export const FREE_PREVIEW = {
  heading: "Not Sure Yet? Try a Free Class First.",
  subheading:
    "Access free AI Agent sessions on our learning platform. No payment, no commitment — just real content.",
  sessions: [
    {
      title: "Build Your First AI Agent",
      description: "60-minute hands-on session. Go from zero to a working AI agent with tool calling.",
      duration: "60 min",
      level: "Beginner",
      icon: "Bot",
    },
    {
      title: "RAG Pipeline Crash Course",
      description: "Build a document Q&A system with vector search. Real retrieval-augmented generation.",
      duration: "45 min",
      level: "Intermediate",
      icon: "Database",
    },
    {
      title: "Vibe Coding Live Demo",
      description: "Watch an AI app get built in real-time using Cursor. From idea to deployed product.",
      duration: "30 min",
      level: "All Levels",
      icon: "Sparkles",
    },
  ],
};

export const STATS = [
  { value: 13, suffix: "+", label: "Years Enterprise Experience" },
  { value: 500, suffix: "", label: "Fortune 500 Clients Served" },
  { value: 20, suffix: "+", label: "AI Frameworks Covered" },
  { value: 10, suffix: "+", label: "Shippable AI Products" },
  { value: 12, suffix: "", label: "Weeks to Mastery" },
];

export const WHY_CARDS = [
  {
    title: "Build to Ship, Not Just to Learn",
    description:
      "Other bootcamps hand you portfolio projects. We hand you production-ready AI products you can deploy, sell, and monetize from day one.",
    icon: "Rocket",
  },
  {
    title: "Dual-Track: Agents + Vibe Coding",
    description:
      "Master AI Agent Development (Level 4) AND AI App Development through Vibe Coding (Level 5). Graduate with the complete AI builder toolkit.",
    icon: "Layers",
  },
  {
    title: "Enterprise DNA from Fortune 500",
    description:
      "Learn real patterns from 13+ years of Banking, Pharma, Telecom, and IoT enterprise engagements. Not academic theory — battle-tested systems.",
    icon: "Building2",
  },
  {
    title: "3 Career Paths, Not Just 1",
    description:
      "Get hired as an AI Engineer, freelance as an AI consultant, or launch your own AI micro-SaaS. We prepare you for all three.",
    icon: "GitBranch",
  },
];

export const CURRICULUM = [
  {
    phase: "Phase 1: AI Agent Foundations",
    weeks: "Weeks 1–4",
    color: "violet",
    modules: [
      {
        week: "Week 1",
        title: "LLM Fundamentals & Prompt Engineering",
        topics: [
          "LLM architecture & tokenization",
          "Advanced prompt engineering patterns",
          "OpenAI, Anthropic & open-source model APIs",
          "Structured outputs & function calling",
        ],
      },
      {
        week: "Week 2",
        title: "RAG Pipelines & Vector Databases",
        topics: [
          "Embedding models & vector stores (Pinecone, ChromaDB)",
          "Chunking strategies & retrieval optimization",
          "Production RAG with LangChain",
          "Evaluation & quality metrics for RAG",
        ],
      },
      {
        week: "Week 3",
        title: "Tool Calling & Single Agent Systems",
        topics: [
          "Function/tool calling patterns",
          "Building your first AI agent",
          "Agent memory & state management",
          "Error handling & fallback strategies",
        ],
      },
      {
        week: "Week 4",
        title: "LangGraph & Agent Workflows",
        topics: [
          "Graph-based agent orchestration",
          "State machines for AI workflows",
          "Human-in-the-loop patterns",
          "Conditional branching & routing",
        ],
      },
    ],
  },
  {
    phase: "Phase 2: Multi-Agent Systems & Enterprise Patterns",
    weeks: "Weeks 5–8",
    color: "cyan",
    modules: [
      {
        week: "Week 5",
        title: "Multi-Agent Architecture",
        topics: [
          "Role specialization & hierarchical agents",
          "CrewAI & multi-agent frameworks",
          "Inter-agent communication protocols",
          "Conflict resolution & consensus",
        ],
      },
      {
        week: "Week 6",
        title: "Enterprise Integration Patterns",
        topics: [
          "Banking & Fintech AI use cases",
          "Healthcare & Pharma compliance patterns",
          "API orchestration & middleware",
          "Security, audit trails & RBAC",
        ],
      },
      {
        week: "Week 7",
        title: "Production Deployment & DevOps",
        topics: [
          "Docker containerization for AI agents",
          "CI/CD pipelines (GitHub Actions)",
          "AWS Bedrock & cloud deployment",
          "AgentOps, monitoring & observability",
        ],
      },
      {
        week: "Week 8",
        title: "AI Workflow Automation",
        topics: [
          "n8n & automation platforms",
          "Webhook-driven agent triggers",
          "Email, Slack & CRM integrations",
          "Building automation as a service",
        ],
      },
    ],
  },
  {
    phase: "Phase 3: Vibe Coding & Ship Your Product",
    weeks: "Weeks 9–12",
    color: "amber",
    modules: [
      {
        week: "Week 9",
        title: "Vibe Coding — AI-Assisted Development",
        topics: [
          "Cursor, Windsurf & AI coding assistants",
          "Prompt-to-product workflows",
          "Full-stack app scaffolding with AI",
          "Code review & quality with AI",
        ],
      },
      {
        week: "Week 10",
        title: "Building Your AI Micro-SaaS",
        topics: [
          "Idea validation & market research with AI",
          "Landing page & payment integration",
          "User auth, dashboards & admin panels",
          "Pricing strategy & monetization models",
        ],
      },
      {
        week: "Week 11",
        title: "Launch & Growth",
        topics: [
          "Product launch playbook",
          "SEO & content marketing with AI",
          "Customer support automation",
          "Analytics & iteration",
        ],
      },
      {
        week: "Week 12",
        title: "Capstone Demo Day & Career Prep",
        topics: [
          "Product demo & pitch presentation",
          "Portfolio & GitHub optimization",
          "AI engineering interview prep",
          "Freelance profile & proposal writing",
        ],
      },
    ],
  },
];

export const CAPSTONE_PRODUCTS = [
  {
    title: "AI Research Agent",
    description:
      "Multi-agent system that researches any topic in parallel, synthesizes findings, and generates comprehensive reports with citations.",
    tags: ["Multi-Agent", "RAG", "LangGraph", "Python"],
    icon: "Search",
  },
  {
    title: "AI Interview Platform",
    description:
      "Full-stack AI-powered interview platform with role-based authentication, real-time evaluation, and automated feedback generation.",
    tags: ["Full Stack", "AI Agent", "Auth", "SaaS"],
    icon: "MessageSquare",
  },
  {
    title: "AI Digital Profile",
    description:
      "Interactive portfolio with a 'Talk to My Resume' AI chatbot. Neural-themed design with career visualizations and skill maps.",
    tags: ["RAG", "Chatbot", "Next.js", "Vercel"],
    icon: "User",
  },
  {
    title: "Workflow Automation Engine",
    description:
      "YouTube transcript extraction, content processing, and report generation — fully automated with AI agents and webhook triggers.",
    tags: ["n8n", "API", "Automation", "FastAPI"],
    icon: "Workflow",
  },
  {
    title: "AI Content Studio",
    description:
      "Generate marketing copy, social media posts, blog articles, and email campaigns using specialized AI agents working in tandem.",
    tags: ["CrewAI", "Multi-Agent", "Marketing", "SaaS"],
    icon: "PenTool",
  },
  {
    title: "Enterprise RAG System",
    description:
      "Production-grade document Q&A system with vector search, access control, and compliance-ready audit trails for enterprise clients.",
    tags: ["RAG", "Enterprise", "Security", "Docker"],
    icon: "Database",
  },
];

export const OUTCOMES = [
  {
    title: "Build Multi-Agent Systems",
    description: "Design, develop, and deploy autonomous multi-agent AI systems using LangGraph, CrewAI, and custom orchestration.",
  },
  {
    title: "Ship Production AI Apps",
    description: "Go from idea to deployed product using vibe coding — full-stack AI applications with auth, payments, and dashboards.",
  },
  {
    title: "Architect RAG Pipelines",
    description: "Build enterprise-grade retrieval-augmented generation systems with vector databases, chunking strategies, and evaluation.",
  },
  {
    title: "Deploy with Confidence",
    description: "Containerize, CI/CD, monitor, and scale AI systems on AWS, Vercel, and cloud platforms with production best practices.",
  },
  {
    title: "Monetize Your Skills",
    description: "Launch your own AI micro-SaaS, freelance as an AI consultant, or ace AI engineering interviews at top companies.",
  },
  {
    title: "Automate Everything",
    description: "Connect AI agents to business workflows — email, Slack, CRM, webhooks — and sell automation as a service.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "IntelliForge built our AI workflow automation in just 3 weeks. What used to take our team 20 hours a week is now fully automated. The ROI was visible from month one.",
    name: "Rahul M.",
    role: "CTO, SaaS Startup",
    initials: "RM",
  },
  {
    quote:
      "Their multi-agent research system transformed how we operate. Research that took days now takes minutes — and the quality is consistently better than manual work.",
    name: "Priya S.",
    role: "Head of Research, Analytics Firm",
    initials: "PS",
  },
  {
    quote:
      "We needed someone who understood both enterprise engineering and modern AI. IntelliForge delivered exactly that — no buzzwords, just working solutions.",
    name: "Vikram K.",
    role: "Founder, Fintech Company",
    initials: "VK",
  },
  {
    quote:
      "From prompt engineering training to deploying our first AI agent — IntelliForge guided us through every level. Our team now thinks AI-first for every problem.",
    name: "Suresh P.",
    role: "VP Engineering, Enterprise SaaS",
    initials: "SP",
  },
];

export const PRICING = {
  earlyBird: {
    price: "₹49,999",
    originalPrice: "₹74,999",
    savings: "₹25,000",
    features: [
      "12 weeks live weekend sessions (Sat & Sun)",
      "20+ AI frameworks hands-on",
      "10+ shippable AI products",
      "Lifetime LMS access (learning.intelliforge.tech)",
      "Lifetime community membership",
      "Portfolio & GitHub optimization",
      "Mock interviews & career prep",
      "Direct founder mentorship",
      "Certificate of completion",
    ],
  },
  regular: {
    price: "₹74,999",
    features: [
      "12 weeks live weekend sessions (Sat & Sun)",
      "20+ AI frameworks hands-on",
      "10+ shippable AI products",
      "Lifetime LMS access",
      "Community membership",
      "Portfolio review",
      "Certificate of completion",
    ],
  },
};

export const FAQ_ITEMS = [
  {
    question: "What makes IntelliForge different from other AI bootcamps?",
    answer:
      "Most bootcamps teach you to build AI agents for someone else's company. We teach you to build, ship, and monetize your own AI-powered products. Our dual-track curriculum covers both Agent Development (Level 4) and Vibe Coding (Level 5), backed by 13+ years of Fortune 500 enterprise experience. You graduate with deployable products, not just GitHub projects.",
  },
  {
    question: "What is Vibe Coding?",
    answer:
      "Vibe Coding is the practice of using AI coding assistants (like Cursor, Windsurf) to build full applications rapidly. Instead of writing every line manually, you describe what you want and the AI helps you build it. Our Level 5 track teaches you to go from idea to deployed product in days, not weeks — the skill that's redefining software development.",
  },
  {
    question: "Do I need prior AI/ML experience?",
    answer:
      "No ML/AI experience required, but you should be comfortable with basic Python programming and have a general understanding of APIs. We start from LLM fundamentals in Week 1 and progressively build up to advanced multi-agent systems.",
  },
  {
    question: "What's the time commitment?",
    answer:
      "Live sessions are on Saturdays and Sundays (4-5 hours per day). You should plan for an additional 5-8 hours of self-paced project work during the week. Total commitment: approximately 15-18 hours per week for 12 weeks.",
  },
  {
    question: "What frameworks and tools will I learn?",
    answer:
      "LangChain, LangGraph, CrewAI, OpenAI API, Anthropic Claude, AWS Bedrock, Pinecone, ChromaDB, Docker, GitHub Actions, n8n, FastAPI, Next.js, Cursor, Vercel — and more. We cover 20+ frameworks so you can adapt to any enterprise tech stack.",
  },
  {
    question: "Will I get a job after this bootcamp?",
    answer:
      "We prepare you for three paths: (1) AI Engineer roles at companies, (2) Freelancing as an AI consultant, (3) Launching your own AI micro-SaaS. We provide mock interviews, portfolio reviews, and career mentorship. However, we don't guarantee placement — we guarantee you'll have the skills and portfolio to compete.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Yes, we offer a 15-day money-back guarantee. If you attend the first two weekends and feel the bootcamp isn't right for you, we'll refund your full payment — no questions asked.",
  },
  {
    question: "How is content delivered after the bootcamp?",
    answer:
      "All recordings, materials, and project resources are available on our dedicated LMS at learning.intelliforge.tech. You get lifetime access, including any future updates to the curriculum.",
  },
];

export const TRUST_SIGNALS = {
  hero: [
    { icon: "Award", label: "Aligned with Bharat AI Mission" },
    { icon: "Building2", label: "13+ Years Fortune 500 DNA" },
    { icon: "Shield", label: "15-Day Money-Back Guarantee" },
  ],
  sprint: [
    { icon: "Users", label: "Max 30 seats" },
    { icon: "Clock", label: "Live Sat & Sun · 9–11 AM & 8–10 PM IST" },
    { icon: "Shield", label: "Zero-risk guarantee" },
  ],
  checkout: [
    { icon: "Lock", label: "100% Secure Checkout" },
    { icon: "Shield", label: "15-Day Money-Back Guarantee" },
    { icon: "CreditCard", label: "0% EMI Available" },
  ],
  finalCta: [
    { icon: "Shield", label: "15-day money-back guarantee" },
    { icon: "Video", label: "Live weekend sessions on Zoom" },
    { icon: "GraduationCap", label: "12-week bootcamp path available" },
  ],
} as const;

export const CTA_MICRO_TRUST = {
  sprint:
    "Secure Razorpay checkout · UPI, cards & netbanking · Talk to a founder before you pay",
  bootcamp:
    "Secure checkout · 15-day money-back after first 2 weekends · 0% EMI available",
  freeClass: "No payment · No commitment · Real curriculum preview",
} as const;

export const SPRINT_CONFIG = {
  name: "2-Week AI Sprint",
  priceDisplay: "₹4,999",
  originalPriceDisplay: "₹12,999",
  session1Date: "Saturday, August 1, 2026",
  cohortStartDate: "August 1, 2026",
  cohortEndDate: "August 15, 2026",
  slug: "ai-sprint-jun-2026",
  href: "/sprint",
  ctaLabel: "Join 2-Week AI Sprint — ₹4,999",
  urgencyLine: "Cohort 1 starts August 1 · Live Sat & Sun · 30 seats",
  liveScheduleSummary:
    "Live on Zoom every Saturday & Sunday — 9–11 AM & 8–10 PM IST",
};

export const NAV_LINKS = [
  { label: "Free Preview", href: "#free-preview" },
  { label: "Why Us", href: "#why-intelliforge" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Projects", href: "#projects" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "AI Sprint", href: "/sprint" },
  { label: "Contact", href: "#contact" },
];
