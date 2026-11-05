export const SITE_CONFIG = {
  name: "IntelliForge AI Bootcamp",
  tagline: "Ship proof before your interview.",
  description:
    "Interview in weeks, not months? Ship two live AI products in 14 days and earn a recruiter-checkable credential — founder-taught by Girish. Based in Hyderabad, India.",
  url: "https://upskill.intelliforge.tech",
  mainSite: "https://www.intelliforge.tech",
  lms: "https://learning.intelliforge.tech",
  certs: "https://certs.intelliforge.tech",
  share: "https://share.intelliforge.tech",
  contact: {
    email: "alerts@intelliforge.tech",
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
  name: "BootCamp-UpSkill-Cohort-01",
  inviteUrl: "https://chat.whatsapp.com/IHnaZegZOWsK37jg8OaB5P",
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
    name: "LocalFlash",
    description: "Local-first flash storage and sync for edge deployments.",
    href: "https://localflash.shop",
    icon: "Zap",
  },
  {
    name: "Maidaan",
    description: "Sports venue booking and academy engagement platform.",
    href: "https://maidaan.academy",
    icon: "GraduationCap",
  },
  {
    name: "InkDown",
    description: "AI-assisted writing and markdown publishing workflows.",
    href: "https://inkdown.intelliforge.tech",
    icon: "FileText",
  },
  {
    name: "Vettd",
    description: "Vetting and verification workflows for hiring and compliance.",
    href: "https://vettd-app.com",
    icon: "ShieldCheck",
  },
  {
    name: "ForgeAhead",
    description:
      "The AI operating system for your job search — strategy through placement.",
    href: "https://forgeahead.intelliforge.tech",
    icon: "Briefcase",
  },
  {
    name: "Chronicle",
    description:
      "Multi-agent market sizing with cited TAM/SAM/SOM reports founders can defend.",
    href: "https://deep-research.intelliforge.tech",
    icon: "BarChart3",
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
    sprints: "Sprints 1–2",
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
    sprints: "Sprints 3–4",
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
    sprints: "Sprints 5–6",
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

/** Learner testimonials — LinkedIn-verified participants. */
export const LEARNER_TESTIMONIALS = [
  {
    name: "Harish Hooli",
    role: "Director of Engineering, Tiger Analytics",
    initials: "HH",
    linkedin: "https://www.linkedin.com/in/harish-hooli/",
    quote:
      "The sessions cut through AI hype. You work on patterns Girish uses in production — agents, RAG, and deployment — not toy notebooks.",
  },
  {
    name: "Prasad Kancharla",
    role: "Technology & Security Professional",
    initials: "PK",
    linkedin: "https://www.linkedin.com/in/prasad-kancharla/",
    quote:
      "Clear structure from fundamentals to shipping. The live format made it easy to ask questions and stay accountable week over week.",
  },
  {
    name: "Rohini Devan",
    role: "Senior Cloud Application Administrator, Ellucian",
    initials: "RD",
    linkedin: "https://www.linkedin.com/in/rohini-devan-1b068590/",
    quote:
      "As someone in cloud operations, I wanted practical AI skills I could apply at work. This was hands-on from day one.",
  },
  {
    name: "Reshma Jabeen",
    role: "Technology Professional",
    initials: "RJ",
    linkedin: "https://www.linkedin.com/in/reshma-jabeen-b8aa7a103/",
    quote:
      "Founder-led teaching makes a difference. You see real repos, real trade-offs, and what it takes to ship.",
  },
  {
    name: "Shreya Rajasekar",
    role: "Technology Professional",
    initials: "SR",
    linkedin: "https://www.linkedin.com/in/shreya-rajasekar-5344b897/",
    quote:
      "The sprint format pushed me to deploy — not just watch. Leaving with working projects changed how I approach AI at work.",
  },
];

export const PRICING = {
  perSprint: {
    name: "Per sprint",
    price: "₹4,999",
    unit: "per 2-week sprint",
    features: [
      "Live weekend sessions (Sat & Sun, 7–10 PM IST)",
      "Something deployed to production by the end of every sprint",
      "Full course access on learning.intelliforge.tech",
      "Direct founder mentorship from Girish",
      "Pay as you go: no commitment beyond the sprint you buy",
    ],
  },
  fullProgramme: {
    name: "All 6 sprints",
    price: "₹29,994",
    unit: "6 × ₹4,999, paid one sprint at a time",
    features: [
      "Everything in each sprint, across all 12 weeks",
      "Build-alongside eligibility on live IntelliForge products",
      "Verifiable credential with shipped-product link",
      "Mentor score on your shipped work",
      "Lifetime LMS access and community membership",
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
      "Live sessions are on Saturdays and Sundays, 7:00–10:00 PM IST (3 hours per day). Plan for an additional 5–8 hours of project work during the week. Total: approximately 11–14 hours per week for 12 weeks.",
  },
  {
    question: "How does the 12-week bootcamp relate to the sprints?",
    answer:
      "The 12-week bootcamp is six 2-week sprints, and you pay ₹4,999 per sprint, ₹29,994 in all. Stop whenever you like. Finish all six to earn the verifiable credential, mentor score, and build-alongside eligibility. Start with the free live demo to see if it fits.",
  },
  {
    question: "What's the refund policy?",
    answer:
      "Each sprint is refundable in full until its first class. After that, that sprint's payment is non-refundable. You only ever pay for one sprint at a time.",
  },
  {
    question: "How is content delivered after the bootcamp?",
    answer:
      "All recordings, materials, and project resources are on learning.intelliforge.tech. You get lifetime access, including future curriculum updates.",
  },
];

export const TRUST_SIGNALS = {
  hero: [
    { icon: "Clock", label: "2 live URLs in 14 days" },
    { icon: "ShieldCheck", label: "Recruiter-checkable credential" },
    { icon: "User", label: "Founder-taught by Girish" },
  ],
  finalCta: [
    { icon: "Shield", label: "Refundable until each sprint's first class" },
    { icon: "Video", label: "Live weekend sessions on Zoom" },
    { icon: "Award", label: "Verifiable shipped-product credential" },
  ],
} as const;

/** Cohort 2 launch details. Enrolment opens on launch weekend; the waitlist hears first. */
export const COHORT_2 = {
  slug: "cohort-2",
  name: "Cohort 2",
  waitlistHref: "/waitlist",
  launchWeekend: "5–6 December 2026",
  launchWeekendShort: "5–6 Dec",
  firstClass: "Saturday, 9 January 2027",
  firstClassShort: "9 Jan 2027",
  format:
    "Six 2-week sprints over 12 weeks, live on Zoom every Saturday and Sunday, 7–10 PM IST.",
  motivations: [
    { value: "ship-at-work", label: "Ship AI in my current job" },
    { value: "job-move", label: "Prepare for interviews or a job move" },
    { value: "own-product", label: "Build my own product" },
    { value: "other", label: "Something else" },
  ],
} as const;

/**
 * Whether the site sells seats. Set by hand, not by date: turn it on for the
 * launch weekend, once the seed has run and SPRINT_COHORT_WHATSAPP points at the
 * Cohort 2 group. While closed, every sprint CTA points at the waitlist.
 */
const SPRINT_ENROLLMENT_OPEN: boolean = false;

/**
 * The Cohort 2 programme: six 2-week sprints, one Razorpay checkout each. A slug
 * here must have a Sprint row (prisma/seed.ts) with the same price and dates.
 * Classes are Sat & Sun, 7:00 PM IST (13:30 UTC). startIso is the first class and
 * endIso the last.
 */
export const COHORT_2_SPRINTS = [
  {
    number: 1,
    slug: "ai-sprint-c2-s1",
    title: "Chatbot + RAG",
    weeks: "Weeks 1–2",
    ships: "A Claude chatbot and a RAG system, both deployed to production.",
    dates: "9–17 Jan 2027",
    firstClass: "Saturday, 09/01/2027",
    startIso: "2027-01-09T13:30:00.000Z",
    endIso: "2027-01-17T13:30:00.000Z",
  },
  {
    number: 2,
    slug: "ai-sprint-c2-s2",
    title: "Tool Calling & Agent Workflows",
    weeks: "Weeks 3–4",
    ships: "A working AI agent with tool calling on a live endpoint.",
    dates: "23–31 Jan 2027",
    firstClass: "Saturday, 23/01/2027",
    startIso: "2027-01-23T13:30:00.000Z",
    endIso: "2027-01-31T13:30:00.000Z",
  },
  {
    number: 3,
    slug: "ai-sprint-c2-s3",
    title: "Multi-Agent Systems & Integration",
    weeks: "Weeks 5–6",
    ships: "A multi-agent system wired into enterprise integration patterns.",
    dates: "6–14 Feb 2027",
    firstClass: "Saturday, 06/02/2027",
    startIso: "2027-02-06T13:30:00.000Z",
    endIso: "2027-02-14T13:30:00.000Z",
  },
  {
    number: 4,
    slug: "ai-sprint-c2-s4",
    title: "Production & Workflow Automation",
    weeks: "Weeks 7–8",
    ships: "A production deployment and an automated AI workflow.",
    dates: "20–28 Feb 2027",
    firstClass: "Saturday, 20/02/2027",
    startIso: "2027-02-20T13:30:00.000Z",
    endIso: "2027-02-28T13:30:00.000Z",
  },
  {
    number: 5,
    slug: "ai-sprint-c2-s5",
    title: "Vibe Coding & Your Micro-SaaS",
    weeks: "Weeks 9–10",
    ships: "The first working version of your own AI micro-SaaS.",
    dates: "6–14 Mar 2027",
    firstClass: "Saturday, 06/03/2027",
    startIso: "2027-03-06T13:30:00.000Z",
    endIso: "2027-03-14T13:30:00.000Z",
  },
  {
    number: 6,
    slug: "ai-sprint-c2-s6",
    title: "Launch & Demo Day",
    weeks: "Weeks 11–12",
    ships: "Your launched product, plus Demo Day and credential issuance.",
    dates: "20–28 Mar 2027",
    firstClass: "Saturday, 20/03/2027",
    startIso: "2027-03-20T13:30:00.000Z",
    endIso: "2027-03-28T13:30:00.000Z",
  },
] as const;

/** The closed Cohort 1 run. Kept so its orders still confirm and fulfil. */
export const COHORT_1_SPRINT_SLUG = "ai-sprint-jun-2026";

export const SPRINT_PRICE_IN_PAISE = 499900;

export function findCohort2Sprint(slug: string | null | undefined) {
  return COHORT_2_SPRINTS.find((sprint) => sprint.slug === slug);
}

export const CTA_MICRO_TRUST = {
  freeDemo: "Live demo · No signup · See the curriculum before you pay",
  sprint: SPRINT_ENROLLMENT_OPEN
    ? "Two live deploy URLs in 14 days · Razorpay checkout · Built for interview deadlines"
    : `Enrolment opens ${COHORT_2.launchWeekendShort} · First class ${COHORT_2.firstClassShort} · Free to join`,
  freeClass: "No payment · No commitment · Real curriculum preview",
} as const;

export const SPRINT_CONFIG = {
  name: "2-Week AI Sprint",
  priceDisplay: "₹4,999",
  session1Date: COHORT_2_SPRINTS[0].firstClass,
  cohortStartDate: "09/01/2027",
  cohortEndDate: "17/01/2027",
  /** The sprint /sprint sells. Other sprints are bought from /sprint/all. */
  slug: COHORT_2_SPRINTS[0].slug,
  seatsTotal: 30,
  href: "/sprint",
  enrollmentOpen: SPRINT_ENROLLMENT_OPEN,
  ctaHref: SPRINT_ENROLLMENT_OPEN ? "/sprint" : COHORT_2.waitlistHref,
  ctaLabel: SPRINT_ENROLLMENT_OPEN
    ? "Ship Proof in 14 Days — ₹4,999"
    : `Join the ${COHORT_2.name} waitlist`,
  ctaLabelShort: SPRINT_ENROLLMENT_OPEN
    ? "Ship in 14 Days — ₹4,999"
    : "Join the waitlist",
  urgencyLine:
    "Built for interviews, client pitches, and performance reviews with a deadline — not 'someday' learners.",
  liveScheduleSummary:
    "Live on Zoom every Saturday & Sunday — 7–10 PM IST",
};

export const NAV_LINKS = [
  { label: "Build-Alongside", href: "#build-alongside" },
  { label: "Credential", href: "#credential" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Free Demo", href: "#free-preview" },
  { label: "CCAR-F Prep", href: "/claude" },
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
    label: SPRINT_CONFIG.enrollmentOpen
      ? "Join the 2-Week Sprint"
      : SPRINT_CONFIG.ctaLabel,
    description: SPRINT_CONFIG.enrollmentOpen
      ? "₹4,999 · two live URLs before your interview"
      : `Enrolment opens ${COHORT_2.launchWeekendShort}`,
    href: SPRINT_CONFIG.ctaHref,
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
