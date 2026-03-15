"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LMS_REGISTER_URL, WHATSAPP_DEMO_URL } from "@/lib/constants";

const headlineLines = [
  { text: "Build ", highlight: "AI Agents." },
  { text: "Ship ", highlight: "AI Products." },
  { text: "Own Your ", highlight: "AI Future." },
];

const trustBadges = [
  "Aligned with Bharat AI Mission",
  "13+ Years Fortune 500 DNA",
];

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]"
          aria-hidden
        />
        <div
          className="absolute -right-40 top-1/2 h-80 w-80 rounded-full bg-accent/15 blur-[100px]"
          aria-hidden
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[80px]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Headline with staggered animation */}
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          {headlineLines.map((line, i) => (
            <motion.span
              key={i}
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {line.text}
              <span className="gradient-text">{line.highlight}</span>
            </motion.span>
          ))}
        </h1>

        {/* Subheading */}
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          Most bootcamps teach you to build for someone else. We teach you to
          build, ship & monetize your own AI-powered products — in 12 weeks.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <a
            href={WHATSAPP_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-lg bg-cta px-8 py-4 text-base font-semibold text-background",
              "hover:bg-cta-hover transition-colors shadow-lg"
            )}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Book Free Demo Class
          </a>
          <Link
            href="#curriculum"
            className={cn(
              "inline-flex items-center justify-center rounded-lg border-2 border-border px-8 py-4 text-base font-semibold text-foreground",
              "hover:bg-surface-light hover:border-surface-light transition-colors"
            )}
          >
            View Curriculum
          </Link>
        </motion.div>
        <motion.div
          className="mt-4 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 1.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <a
            href={LMS_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-2 hover:underline"
          >
            Or try a free class first →
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {trustBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-border bg-surface/50 px-4 py-2 text-xs text-muted sm:text-sm"
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
