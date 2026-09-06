import type { Metadata } from "next";
import { EXAM } from "@/lib/ccarf/blueprint";
import { QuizApp } from "@/components/ccarf/quiz-app";

export const metadata: Metadata = {
  title: "Free CCAR-F Mock Exam — Claude Certified Architect Practice Test",
  description:
    "A free timed mock exam for the Claude Certified Architect, Foundations certification, with untimed practice mode, per-domain scoring, and a documentation link on every explanation.",
  alternates: { canonical: "/claude/quiz" },
  openGraph: {
    title: "Free CCAR-F Mock Exam — Claude Certified Architect",
    description:
      "Timed mock exam and untimed practice for the Claude Certified Architect, Foundations exam. Free, no signup.",
    url: "/claude/quiz",
  },
};

export default function ClaudeQuizPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium uppercase tracking-wider text-accent">
        Claude Certified Architect · Foundations
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Free {EXAM.abbr} mock exam
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        Sit it timed to rehearse the real thing, or work through it untimed with a full
        explanation after every question. Nothing to sign up for and nothing stored on our
        servers — your attempt lives in this browser.
      </p>

      <div className="mt-10">
        <QuizApp />
      </div>
    </main>
  );
}
