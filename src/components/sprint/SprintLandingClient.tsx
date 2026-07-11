"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Bot,
  Briefcase,
  Check,
  Clock,
  Code2,
  Database,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { SprintCheckoutButton } from "@/components/sprint/SprintCheckoutButton";
import { SprintCountdown } from "@/components/sprint/SprintCountdown";
import { SprintLiveSchedule } from "@/components/sprint/SprintLiveSchedule";
import { SprintSeatMap } from "@/components/sprint/SprintSeatMap";
import { useSprintSeats } from "@/components/sprint/use-sprint-seats";
import { formatISTDate, formatRupee } from "@/lib/sprint-format";
import { SITE_CONFIG, SPRINT_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SprintLandingClientProps {
  remaining: number;
  seatsFilled: number;
  seatsTotal: number;
  priceInPaise: number;
  originalPriceInPaise: number;
  startDate: string;
  isActive: boolean;
}

const WEEK_ONE = [
  "Claude API fundamentals & prompt engineering",
  "Build a production chatbot with streaming responses",
  "Function calling & tool use patterns",
  "Deploy to Vercel with environment secrets",
];

const WEEK_TWO = [
  "RAG pipeline: embeddings, chunking, vector search",
  "Document Q&A system with ChromaDB / Pinecone",
  "Evaluation metrics & quality guardrails",
  "Ship your capstone: live demo on Day 14",
];

const OUTCOMES = [
  {
    icon: Bot,
    title: "Claude API Chatbot",
    description: "Streaming responses, tool calling, deployed to Vercel.",
  },
  {
    icon: Database,
    title: "RAG Document Q&A",
    description: "Vector search pipeline with real document ingestion.",
  },
  {
    icon: Rocket,
    title: "Deployed AI Product",
    description: "Not a notebook — a live URL you can share on LinkedIn.",
  },
];

const PAIN_SIGNALS = [
  {
    icon: Briefcase,
    text: "Recruiter or hiring manager asked for shipped AI work — your GitHub has tutorials, not live deploys.",
  },
  {
    icon: Clock,
    text: "Interview loop starts in 2–4 weeks and you're still planning to 'build something soon.'",
  },
  {
    icon: AlertTriangle,
    text: "Layoff, role change, or performance review — you need proof you ship, not another course certificate.",
  },
  {
    icon: Target,
    text: "Client or internal demo is on the calendar — you have slides, not a URL you can send today.",
  },
];

const BEFORE_AFTER = {
  before: [
    "Completed courses — no live URL to send in an application",
    "Can explain RAG in theory — can't demo it in an interview",
    "LinkedIn says \"AI enthusiast\" — recruiter can't click to verify",
    "Interview in weeks — portfolio still 'in progress'",
  ],
  after: [
    "Live Claude chatbot on Vercel — share the URL in Week 1",
    "Production RAG system with real documents — demo in Week 2",
    "Two deploy links for interviews, client pitches, and reviews",
    "Proof you ship — recruiters click, not just read claims",
  ],
};

export function SprintLandingClient({
  remaining,
  seatsFilled,
  seatsTotal,
  priceInPaise,
  originalPriceInPaise,
  startDate,
  isActive,
}: SprintLandingClientProps) {
  const liveSeats = useSprintSeats({
    filled: seatsFilled,
    total: seatsTotal,
    remaining,
  });
  const { filled, total, remaining: liveRemaining } = liveSeats;

  const price = formatRupee(priceInPaise);
  const originalPrice = formatRupee(originalPriceInPaise);
  const startLabel = formatISTDate(startDate);
  const soldOut = !isActive || liveRemaining <= 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 bg-background/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-foreground font-bold text-lg">
            IntelliForge AI
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden sm:inline text-sm text-muted transition-colors hover:text-foreground"
            >
              Full 12-Week Bootcamp →
            </Link>
            <span
              className={cn(
                "text-sm font-medium",
                liveRemaining <= 5 ? "text-amber-400" : "text-green-400"
              )}
            >
              {soldOut ? "Sold out" : `${liveRemaining} seats left`}
            </span>
            {!soldOut && (
              <SprintCheckoutButton
                priceInPaise={priceInPaise}
                className="!py-2 !px-5 !text-sm"
              />
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pt-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 text-sm text-accent mb-6">
            <Sparkles className="w-4 h-4" />
            Cohort 1 · Starts {startLabel} · Live Sat &amp; Sun
          </div>

          <SprintCountdown startDate={startDate} className="mb-8 max-w-xl mx-auto" />

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Interview in 3 weeks?{" "}
            <span className="gradient-text">Ship two live AI products in 14 days.</span>
          </h1>

          <p className="text-xl text-muted mb-4 max-w-2xl mx-auto leading-relaxed">
            Claude chatbot + RAG system — deployed to Vercel. URLs you paste into
            your application, send to recruiters, or demo in the room. Not
            certificates. Not slide decks.
          </p>

          <p className="text-base text-amber-400/90 mb-8 max-w-xl mx-auto font-medium">
            Cohort 1 starts {startLabel}. Every week you wait, someone else
            shows up with live deploys — and you show up with plans.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <div className="text-4xl font-bold text-foreground">{price}</div>
            <div className="text-xl text-muted line-through">{originalPrice}</div>
            <div className="bg-green-500/20 text-green-400 text-sm font-semibold px-3 py-1 rounded-full">
              Save {formatRupee(originalPriceInPaise - priceInPaise)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {soldOut ? (
              <button
                disabled
                className="bg-surface-light text-muted font-bold py-4 px-8 rounded-lg text-lg cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : (
              <SprintCheckoutButton
                priceInPaise={priceInPaise}
                label={`Enroll Now — ${price}`}
                className="!py-4 !px-10"
              />
            )}
            <Link
              href="/"
              className="text-muted hover:text-foreground text-sm transition-colors"
            >
              Full 12-Week Bootcamp →
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted mb-10">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Max {total} seats
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Sat &amp; Sun · 9–11 AM &amp; 8–10 PM IST
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Zero-risk guarantee
            </span>
          </div>

          <SprintSeatMap
            filled={filled}
            total={total}
            bookedNames={SPRINT_CONFIG.bookedSeatNames}
          />
        </div>
      </section>

      <SprintLiveSchedule startDate={startDate} />

      <section className="px-6 py-14 border-b border-border/50 bg-surface/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Is This You Right Now?
          </h2>
          <p className="text-muted mb-10">
            This sprint is for people with an interview, client pitch, or review
            on the calendar — not people &quot;thinking about learning AI
            someday.&quot;
          </p>
          <ul className="grid sm:grid-cols-2 gap-4 text-left">
            {PAIN_SIGNALS.map((item) => (
              <li
                key={item.text}
                className="flex gap-3 bg-surface border border-border rounded-xl p-4 text-sm text-foreground"
              >
                <item.icon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">
            14 Days From Stuck to Shipped
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface border border-red-500/20 rounded-xl p-8">
              <h3 className="text-lg font-semibold text-red-400 mb-6 flex items-center gap-2">
                <X className="w-5 h-5" /> Where you are today
              </h3>
              <ul className="space-y-3">
                {BEFORE_AFTER.before.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-muted"
                  >
                    <X className="w-4 h-4 text-red-400/70 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface border border-green-500/20 rounded-xl p-8">
              <h3 className="text-lg font-semibold text-green-400 mb-6 flex items-center gap-2">
                <Check className="w-5 h-5" /> Where you&apos;ll be on Day 14
              </h3>
              <ul className="space-y-3">
                {BEFORE_AFTER.after.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-foreground"
                  >
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-surface/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">
            What You&apos;ll Ship
          </h2>
          <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
            Two production AI systems — not toy demos. Real APIs, real deployment,
            real portfolio pieces.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {OUTCOMES.map((item) => (
              <div
                key={item.title}
                className="bg-surface border border-border rounded-xl p-6"
              >
                <item.icon className="w-8 h-8 text-primary-light mb-4" />
                <h3 className="text-foreground font-semibold mb-2">{item.title}</h3>
                <p className="text-muted text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-surface border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="w-6 h-6 text-violet-400" />
              <h3 className="text-xl font-bold text-foreground">Week 1 — Claude API</h3>
            </div>
            <ul className="space-y-3">
              {WEEK_ONE.map((topic) => (
                <li key={topic} className="flex gap-3 text-sm text-foreground">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-foreground">Week 2 — RAG System</h3>
            </div>
            <ul className="space-y-3">
              {WEEK_TWO.map((topic) => (
                <li key={topic} className="flex gap-3 text-sm text-foreground">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-gradient-to-t from-surface to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {liveRemaining <= 5 && !soldOut
              ? `Only ${liveRemaining} seats left — act before ${startLabel}`
              : "Stop planning. Start shipping."}
          </h2>
          <p className="text-muted mb-8">
            {price} one-time · Two live products in 14 days · Live Zoom on Sat
            &amp; Sun (9–11 AM &amp; 8–10 PM IST) · Zero-risk guarantee
          </p>
          <SprintSeatMap
            filled={filled}
            total={total}
            bookedNames={SPRINT_CONFIG.bookedSeatNames}
            className="mb-8"
          />
          {!soldOut && (
            <SprintCheckoutButton
              priceInPaise={priceInPaise}
              label={`Secure My Seat — ${price}`}
              className="!py-4 !px-10 w-full sm:w-auto"
            />
          )}
          <p className="text-xs text-muted mt-6">
            100% secure checkout via Razorpay · UPI, cards, netbanking accepted
          </p>
        </div>
      </section>

      <footer className="border-t border-border/50 px-6 py-8 text-center text-sm text-muted">
        <Link
          href="/"
          className="inline-block mb-4 text-muted transition-colors hover:text-foreground"
        >
          Full 12-Week Bootcamp →
        </Link>
        <p>
          IntelliForge AI · {SITE_CONFIG.contact.email} ·{" "}
          {SITE_CONFIG.contact.location}
        </p>
      </footer>
    </div>
  );
}
