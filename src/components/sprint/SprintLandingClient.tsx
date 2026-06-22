"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Check,
  Clock,
  Code2,
  Database,
  Rocket,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { SprintCheckoutButton } from "@/components/sprint/SprintCheckoutButton";
import { formatISTDate, formatRupee } from "@/lib/sprint-format";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SprintLandingClientProps {
  remaining: number;
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

export function SprintLandingClient({
  remaining,
  priceInPaise,
  originalPriceInPaise,
  startDate,
  isActive,
}: SprintLandingClientProps) {
  const [liveRemaining, setLiveRemaining] = useState(remaining);
  const price = formatRupee(priceInPaise);
  const originalPrice = formatRupee(originalPriceInPaise);
  const startLabel = formatISTDate(startDate);
  const soldOut = !isActive || liveRemaining <= 0;

  useEffect(() => {
    setLiveRemaining(remaining);
  }, [remaining]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await fetch("/api/sprint/seats?slug=ai-sprint-jun-2026");
        const json = await res.json();
        if (json.success) {
          setLiveRemaining(json.data.remaining);
        }
      } catch {
        // keep server-rendered value
      }
    };
    fetchSeats();
    const interval = setInterval(fetchSeats, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-200">
      <header className="border-b border-[#1E3A5F]/50 bg-[#0A0F1E]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">
            IntelliForge AI
          </Link>
          <div className="flex items-center gap-4">
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
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#111827] border border-[#1E3A5F] rounded-full px-4 py-1.5 text-sm text-blue-300 mb-8">
            <Sparkles className="w-4 h-4" />
            Cohort 1 · Starts {startLabel} · 9:00 AM IST
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ship Your First AI Product in{" "}
            <span className="gradient-text">14 Days</span>
          </h1>

          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Claude API chatbot + RAG system — built live, deployed to Vercel.
            Not notes. Not slides. Deployed code.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <div className="text-4xl font-bold text-white">{price}</div>
            <div className="text-xl text-slate-500 line-through">{originalPrice}</div>
            <div className="bg-green-500/20 text-green-400 text-sm font-semibold px-3 py-1 rounded-full">
              Save {formatRupee(originalPriceInPaise - priceInPaise)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {soldOut ? (
              <button
                disabled
                className="bg-slate-700 text-slate-400 font-bold py-4 px-8 rounded-lg text-lg cursor-not-allowed"
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
            <a
              href={SITE_CONFIG.url}
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              View full 12-week bootcamp →
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Max 30 seats
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> 2 weeks · Live sessions
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Zero-risk guarantee
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-[#111827]/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            What You&apos;ll Ship
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Two production AI systems — not toy demos. Real APIs, real deployment,
            real portfolio pieces.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {OUTCOMES.map((item) => (
              <div
                key={item.title}
                className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-6"
              >
                <item.icon className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="w-6 h-6 text-violet-400" />
              <h3 className="text-xl font-bold text-white">Week 1 — Claude API</h3>
            </div>
            <ul className="space-y-3">
              {WEEK_ONE.map((topic) => (
                <li key={topic} className="flex gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Week 2 — RAG System</h3>
            </div>
            <ul className="space-y-3">
              {WEEK_TWO.map((topic) => (
                <li key={topic} className="flex gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-gradient-to-t from-[#111827] to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {liveRemaining <= 5 && !soldOut
              ? `Only ${liveRemaining} seats left`
              : "Ready to ship?"}
          </h2>
          <p className="text-slate-400 mb-8">
            {price} one-time · Starts {startLabel} · Live Zoom sessions every
            weekend
          </p>
          {!soldOut && (
            <SprintCheckoutButton
              priceInPaise={priceInPaise}
              label={`Secure My Seat — ${price}`}
              className="!py-4 !px-10 w-full sm:w-auto"
            />
          )}
          <p className="text-xs text-slate-600 mt-6">
            100% secure checkout via Razorpay · UPI, cards, netbanking accepted
          </p>
        </div>
      </section>

      <footer className="border-t border-[#1E3A5F]/50 px-6 py-8 text-center text-sm text-slate-600">
        <p>
          IntelliForge AI · {SITE_CONFIG.contact.email} ·{" "}
          {SITE_CONFIG.contact.location}
        </p>
      </footer>
    </div>
  );
}
