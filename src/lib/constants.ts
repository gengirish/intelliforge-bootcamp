export const SITE_CONFIG = {
  name: "IntelliForge AI Bootcamp",
  tagline: "Ship a real product. Earn a verifiable credential.",
  description:
    "The only AI cohort where top performers ship to a live IntelliForge repo, get mentor-scored, and leave with a recruiter-checkable credential. Founder-taught by Girish. Based in Hyderabad, India.",
  url: "https://upskill.intelliforge.tech",
  mainSite: "https://www.intelliforge.tech",
  lms: "https://learning.intelliforge.tech",
  certs: "https://certs.intelliforge.tech",
  share: "https://share.intelliforge.tech",
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

/** Top-of-funnel: free live demo on the learning platform — no signup required. */
// TODO(girish): confirm exact demo URL path on learning.intelliforge.tech
export const FREE_LIVE_DEMO_URL = `${SITE_CONFIG.lms}/demo`;

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I'm interested in the IntelliForge AI Bootcamp. I'd like to book a free demo class."
);

export const WHATSAPP_DEMO_URL = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`;

export const getWhatsAppUrl = (message: string) =>
  `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(message)}`;

export const LMS_REGISTER_URL = `${SITE_CONFIG.lms}/register`;
export const LMS_SIGNIN_URL = `${SITE_CONFIG.lms}/api/auth/signin`;
export const LMS_UPSKILL_ROADMAP_URL = `${SITE_CONFIG.lms}/courses/ai-upskill-12-week-roadmap`;
export const LMS_FEEDBACK_URL = `${SITE_CONFIG.lms}/feedback`;

export const ZOOM_MEETING = {
  topic: "Why Upskill and How?",
  time: "Jun 28, 2026 09:00 AM Mumbai, Kolkata, New Delhi",
  displayShort: "28/06/2026, 9:00 AM IST",
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

export const SPRINT_COHORT_WHATSAPP = {
  name: "UpSkill-Cohort-01",
  inviteUrl: "https://chat.whatsapp.com/EG5aUDfvrHbGa9tvEaleAu",
};

export const SPRINT_COHORT_WHATSAPP_URL = `${SITE_CONFIG.url}/sprint/whatsapp`;

export const FREE_PREVIEW = {
  heading: "Try the Free Live Demo First.",
  subheading:
    "Watch a real session on our learning platform. No payment, no signup — see how we teach before you enrol.",
  sessions: [
    {
      title: "Build Your First AI Agent",
      description:
        "60-minute hands-on session. Go from zero to a working AI agent with tool calling.",
      duration: "60 min",
      level: "Beginner",
      icon: "Bot",
    },
    {
      title: "RAG Pipeline Crash Course",
      description:
        "Build a document Q&A system with vector search. Real retrieval-augmented generation.",
      duration: "45 min",
      level: "Intermediate",
      icon: "Database",
    },
    {
      title: "Vibe Coding Live Demo",
      description:
        "Watch an AI app get built in real-time using Cursor. From idea to deployed product.",
      duration: "30 min",
      level: "All Levels",
      icon: "Sparkles",
    },
  ],
};

export const FOUNDER = {
  name: "Girish",
  fullName: "Girish Hiremath",
  title: "Founder & Principal Engineer",
  company: "IntelliForge Digital Services",
  location: "Hyderabad, India",
  yearsExperience: 14,
  bio: "14 years of enterprise engineering across banking, pharma, telecom, and IoT. Runs IntelliForge's live product studio — 25+ deployed products and counting. M.Tech in Data Science & AI. Teaches from production systems he ships, not slide decks.",
  skillBadges: [
    "LangChain · LangGraph",
    "AWS Bedrock",
    "Multi-Agent Systems",
    "RAG Architecture",
    "Docker · CI/CD",
    "Enterprise Consulting",
    "Vibe Coding",
  ],
};

/** Live IntelliForge product surfaces learners may contribute to during build-alongside. */
export const BUILD_ALONGSIDE_PRODUCTS = [
  {
    name: "PDFforge",
    description: "AI-powered PDF processing and document workflows.",
    // TODO(girish): confirm exact production URL
    href: "https://pdfforge.intelliforge.tech",
    icon: "FileText",
  },
  {
    name: "LocalFlash",
    description: "Local-first flash storage and sync for edge deployments.",
    // TODO(girish): confirm exact production URL
    href: "https://localflash.intelliforge.tech",
    icon: "Zap",
  },
  {
    name: "RemoteForge",
    description: "Remote development and pair-programming infrastructure.",
    // TODO(girish): confirm exact production URL
    href: "https://remoteforge.intelliforge.tech",
    icon: "Monitor",
  },
  {
    name: "IELTSForge",
    description: "AI-assisted IELTS preparation and scoring platform.",
    // TODO(girish): confirm exact production URL
    href: "https://ieltsforge.intelliforge.tech",
    icon: "GraduationCap",
  },
  {
    name: "Maidaan",
    description: "Sports venue booking and community engagement platform.",
    // TODO(girish): confirm exact production URL
    href: "https://maidaan.intelliforge.tech",
    icon: "Trophy",
  },
];

export const BUILD_ALONGSIDE = {
  killLine:
    "Ask any bootcamp for the repo you'll contribute to. We'll show you ours.",
  capacityNote:
    "Build-alongside slots are limited by studio staffing — not marketing fiction. When we can't staff you on a live product, you're still in the cohort with full curriculum access.",
  // TODO(girish): set real build-alongside slot count when studio capacity is confirmed
  slotsDisplay: null as string | null,
};

export const VERIFIABLE_CREDENTIAL = {
  issuerUrl: SITE_CONFIG.certs,
  fields: [
    "Learner name",
    "Cohort & completion date",
    "Shipped-product link (live URL)",
    "Mentor score",
    "Public verification URL",
  ],
  contrastAttended:
    '"Attended" is a badge. Anyone can claim they were in a room.',
  contrastShipped:
    '"Shipped [live URL], scored by a mentor, verify here" is a credential. Recruiters can click to confirm.',
};

export const COMPARISON_ROWS = [
  {
    feature: "Delivery",
    intelliforge: "Live cohort with founder",
    recorded: "Pre-recorded videos",
    university: "Recorded lectures + exams",
  },
  {
    feature: "Ship to a real repo",
    intelliforge: true,
    recorded: false,
    university: false,
  },
  {
    feature: "Verifiable credential with shipped-product link",
    intelliforge: true,
    recorded: false,
    university: false,
  },
  {
    feature: "Mentor score on your work",
    intelliforge: true,
    recorded: false,
    university: false,
  },
  {
    feature: "Founder-taught by a practicing engineer",
    intelliforge: true,
    recorded: false,
    university: false,
  },
  {
    feature: "Scarcity model",
    intelliforge: "Real studio capacity limits build-alongside slots",
    recorded: "Unlimited enrolment",
    university: "Semester intake dates",
  },
];

export const CURRICULUM = [
  {
    phase: "Phase 1: Ship Your First Agent",
    weeks: "Weeks 1–4",
    outcome: "You deploy a working AI agent with tool calling to a live endpoint.",
    color: "violet",
    modules: [
      {
        week: "Week 1",
        title: "LLM Fundamentals & Prompt Engineering",
        shipOutcome: "Structured-output API you can demo in an interview.",
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
        shipOutcome: "Document Q&A system with vector search — deployed.",
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
        shipOutcome: "Single agent with tools, memory, and error handling.",
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
        shipOutcome: "Graph-based agent workflow with human-in-the-loop.",
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
    phase: "Phase 2: Ship Multi-Agent Systems",
    weeks: "Weeks 5–8",
    outcome: "You ship a multi-agent system with enterprise integration patterns.",
    color: "cyan",
    modules: [
      {
        week: "Week 5",
        title: "Multi-Agent Architecture",
        shipOutcome: "Crew of specialized agents collaborating on a task.",
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
        shipOutcome: "Agent integrated with real business APIs and RBAC.",
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
        shipOutcome: "Containerized agent on CI/CD with monitoring.",
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
        shipOutcome: "Webhook-driven automation connecting agents to Slack/email.",
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
    phase: "Phase 3: Ship Your Product",
    weeks: "Weeks 9–12",
    outcome: "You launch an AI product — or contribute to a live IntelliForge repo.",
    color: "amber",
    modules: [
      {
        week: "Week 9",
        title: "Vibe Coding — AI-Assisted Development",
        shipOutcome: "Full-stack app scaffolded and deployed with AI assistants.",
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
        shipOutcome: "Landing page, auth, and payment integration live.",
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
        shipOutcome: "Product live with analytics and support automation.",
        topics: [
          "Product launch playbook",
          "SEO & content marketing with AI",
          "Customer support automation",
          "Analytics & iteration",
        ],
      },
      {
        week: "Week 12",
        title: "Demo Day & Credential Issuance",
        shipOutcome: "Verifiable credential issued with your shipped-product link.",
        topics: [
          "Product demo & shipped-product review",
          "Mentor scoring session",
          "Credential issuance via certs.intelliforge.tech",
          "Share your win on share.intelliforge.tech",
        ],
      },
    ],
  },
];

/** B2B client quotes — prove IntelliForge ships, not learner outcomes. */
export const CLIENT_QUOTES = [
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
  sprint: {
    name: "2-Week Sprint",
    price: "₹4,999",
    originalPrice: "₹12,999",
    href: "/sprint",
    features: [
      "2 weeks live weekend sessions",
      "Two AI products deployed to production",
      "Gateway to the 12-week bootcamp",
      "Live on Zoom — Sat & Sun, IST",
    ],
  },
  earlyBird: {
    name: "12-Week Bootcamp",
    price: "₹49,999",
    originalPrice: "₹74,999",
    savings: "₹25,000",
    features: [
      "12 weeks live weekend sessions (Sat & Sun)",
      "Build-alongside eligibility on live IntelliForge products",
      "Verifiable credential with shipped-product link",
      "Mentor score on your shipped work",
      "Lifetime LMS access (learning.intelliforge.tech)",
      "Lifetime community membership",
      "Direct founder mentorship from Girish",
    ],
  },
  regular: {
    name: "12-Week Bootcamp",
    price: "₹74,999",
    features: [
      "12 weeks live weekend sessions (Sat & Sun)",
      "Build-alongside eligibility on live IntelliForge products",
      "Verifiable credential with shipped-product link",
      "Mentor score on your shipped work",
      "Lifetime LMS access",
      "Community membership",
    ],
  },
};

export const FAQ_ITEMS = [
  {
    question: "What makes IntelliForge different from other AI bootcamps?",
    answer:
      "Most bootcamps hand you a portfolio project and a certificate of attendance. We staff top performers on real IntelliForge products — you ship to a live repo, get scored by a mentor who watched you work, and receive a verifiable credential at certs.intelliforge.tech with your shipped-product link. Ask any bootcamp for the repo you'll contribute to. We'll show you ours.",
  },
  {
    question: "What is build-alongside?",
    answer:
      "Top performers in the cohort get staffed on a real IntelliForge product and ship contributions to a live repo — tracked on the same system our intern cohort runs. Slots are limited by studio capacity, not marketing. Everyone gets the full curriculum; build-alongside is the premium path for those who earn it.",
  },
  {
    question: "What is the verifiable credential?",
    answer:
      "A public URL issued via certs.intelliforge.tech containing your name, cohort, completion date, the live URL of what you shipped, and your mentor score. Recruiters can click to verify — it's not an 'attended' badge.",
  },
  {
    question: "Do I need prior AI/ML experience?",
    answer:
      "No ML/AI experience required, but you should be comfortable with basic Python programming and have a general understanding of APIs. We start from LLM fundamentals in Week 1 and progressively build up to advanced multi-agent systems.",
  },
  {
    question: "What's the time commitment?",
    answer:
      "Live sessions are on Saturdays and Sundays (4–5 hours per day IST). Plan for an additional 5–8 hours of project work during the week. Total: approximately 15–18 hours per week for 12 weeks.",
  },
  {
    question: "What's the difference between the 2-Week Sprint and 12-Week Bootcamp?",
    answer:
      "The 2-Week Sprint (₹4,999) is a focused gateway — two products deployed in 14 days. The 12-Week Bootcamp (₹49,999 early bird) is the full path with build-alongside eligibility, mentor scoring, and a verifiable credential. Start with the free live demo to see which fits.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Yes — 15-day money-back guarantee. If you attend the first two weekends and feel the bootcamp isn't right for you, we'll refund your full payment.",
  },
  {
    question: "How is content delivered after the bootcamp?",
    answer:
      "All recordings, materials, and project resources are on learning.intelliforge.tech. You get lifetime access, including future curriculum updates.",
  },
];

export const TRUST_SIGNALS = {
  hero: [
    { icon: "User", label: "Founder-taught by Girish" },
    { icon: "GitBranch", label: "Ship to a live repo" },
    { icon: "ShieldCheck", label: "Verifiable credential" },
  ],
  checkout: [
    { icon: "Lock", label: "100% Secure Checkout" },
    { icon: "Shield", label: "15-Day Money-Back Guarantee" },
    { icon: "CreditCard", label: "0% EMI Available" },
  ],
  finalCta: [
    { icon: "Shield", label: "15-day money-back guarantee" },
    { icon: "Video", label: "Live weekend sessions on Zoom" },
    { icon: "Award", label: "Verifiable shipped-product credential" },
  ],
} as const;

export const CTA_MICRO_TRUST = {
  freeDemo: "Live demo · No signup · See the curriculum before you pay",
  sprint:
    "Secure Razorpay checkout · UPI, cards & netbanking · Two products shipped in 14 days",
  bootcamp:
    "Secure checkout · 15-day money-back after first 2 weekends · 0% EMI available",
  freeClass: "No payment · No commitment · Real curriculum preview",
} as const;

export const SPRINT_CONFIG = {
  name: "2-Week AI Sprint",
  priceDisplay: "₹4,999",
  originalPriceDisplay: "₹12,999",
  session1Date: "Saturday, 01/08/2026",
  cohortStartDate: "01/08/2026",
  cohortEndDate: "15/08/2026",
  slug: "ai-sprint-jun-2026",
  href: "/sprint",
  ctaLabel: "Join 2-Week AI Sprint — ₹4,999",
  ctaLabelShort: "Join Sprint — ₹4,999",
  liveScheduleSummary:
    "Live on Zoom every Saturday & Sunday — 9–11 AM & 8–10 PM IST",
};

export const NAV_LINKS = [
  { label: "Build-Alongside", href: "#build-alongside" },
  { label: "Credential", href: "#credential" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Free Demo", href: "#free-preview" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const FUNNEL_STEPS = [
  {
    step: 1,
    label: "Try the free demo",
    description: "Watch a live session — no signup",
    href: FREE_LIVE_DEMO_URL,
    external: true,
  },
  {
    step: 2,
    label: "Join the 2-Week Sprint",
    description: "₹4,999 · two products shipped in 14 days",
    href: SPRINT_CONFIG.href,
    external: false,
  },
  {
    step: 3,
    label: "Share your verified win",
    description: "Graduates post shipped-product links",
    href: SITE_CONFIG.share,
    external: true,
  },
];
