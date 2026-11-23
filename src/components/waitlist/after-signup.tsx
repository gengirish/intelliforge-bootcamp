"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Check, Copy, Linkedin, Loader2, MessageCircle } from "lucide-react";
import { COHORT_2, WAITLIST_SHARE } from "@/lib/constants";
import { waitlistShareUrl } from "@/lib/waitlist-referral";

const selectClass =
  "w-full rounded-lg border border-border bg-surface-light px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const shareButton =
  "flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-light px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40";

/** The question moved out of the signup form. Optional: skipping it loses nothing. */
export function FollowUpQuestion({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const motivation = new FormData(e.currentTarget).get("motivation");
    setState("saving");
    try {
      const res = await fetch("/api/waitlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, motivation }),
      });
      const data = await res.json();
      setState(data.success ? "saved" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "saved") {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Check className="h-4 w-4 text-green-400" /> Thanks, that helps us plan the sprints.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface-light/50 p-4">
      <label htmlFor="waitlist-motivation" className="mb-1.5 block text-sm font-medium">
        One more question: what do you most want from this?
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          id="waitlist-motivation"
          name="motivation"
          required
          defaultValue=""
          className={selectClass}
        >
          <option value="" disabled>
            Choose one
          </option>
          {COHORT_2.motivations.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={state === "saving"}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {state === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
          Save answer
        </button>
      </div>
      {state === "error" && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          We couldn&apos;t save that. Please try again.
        </p>
      )}
    </form>
  );
}

/** Shown when they said their employer would pay. */
export function SponsorNote() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
      <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" />
      <p className="text-muted">
        <span className="font-medium text-foreground">Getting your employer to pay?</span>{" "}
        Forward them the one-page summary of what the cohort covers, what you&apos;ll ship and what
        it costs.{" "}
        <Link href={COHORT_2.sponsorHref} className="font-medium text-accent hover:underline">
          Open the employer one-pager
        </Link>
      </p>
    </div>
  );
}

/** "Share your spot": the learner's personal link, with a prefilled LinkedIn post. */
export function ShareYourSpot({ referralCode }: { referralCode?: string | null }) {
  const [copied, setCopied] = useState(false);

  const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
    WAITLIST_SHARE.linkedinPost(waitlistShareUrl(referralCode, "linkedin"))
  )}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    WAITLIST_SHARE.whatsappMessage(waitlistShareUrl(referralCode, "whatsapp"))
  )}`;
  const copyUrl = waitlistShareUrl(referralCode);

  async function copy() {
    try {
      await navigator.clipboard.writeText(copyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the link is shown in full so it can be selected by hand.
    }
  }

  return (
    <section aria-labelledby="share-spot-heading">
      <p id="share-spot-heading" className="font-semibold">
        Share your spot
      </p>
      <p className="mt-1 text-sm text-muted">
        Know a developer who wants to ship AI at work? Send them your personal link. The LinkedIn
        post is written for you, and you can edit it before posting.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={shareButton}>
          <Linkedin className="h-4 w-4" /> Post on LinkedIn
        </a>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={shareButton}>
          <MessageCircle className="h-4 w-4" /> Share on WhatsApp
        </a>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-surface-light px-3 py-2">
        <code className="min-w-0 flex-1 truncate text-xs text-muted" title={copyUrl}>
          {copyUrl}
        </code>
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-foreground hover:bg-surface"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </section>
  );
}
