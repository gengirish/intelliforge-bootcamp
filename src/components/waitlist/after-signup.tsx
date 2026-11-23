"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { COHORT_2, WAITLIST_SHARE } from "@/lib/constants";
import { waitlistShareUrl } from "@/lib/waitlist-referral";

const sectionLabel = "text-sm font-medium text-foreground";
const pill =
  "rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-muted disabled:opacity-50";
const textLink = "text-sm text-muted underline underline-offset-4 hover:text-foreground";

/** The question moved out of the signup form. One tap saves it; skipping loses nothing. */
export function FollowUpQuestion({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save(motivation: string) {
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
        <Check className="h-4 w-4" /> Thanks, that helps us plan the sprints.
      </p>
    );
  }

  return (
    <fieldset>
      <legend className={sectionLabel}>What do you most want from this?</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {COHORT_2.motivations.map((m) => (
          <button
            key={m.value}
            type="button"
            disabled={state === "saving"}
            onClick={() => save(m.value)}
            className={pill}
          >
            {m.label}
          </button>
        ))}
      </div>
      {state === "error" && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          We couldn&apos;t save that. Please try again.
        </p>
      )}
    </fieldset>
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
      <h3 id="share-spot-heading" className={sectionLabel}>
        Share your spot
      </h3>
      <p className="mt-1 text-sm text-muted">
        Know a developer who wants to ship AI at work? Send them your link.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={pill}>
          Post on LinkedIn
        </a>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={pill}>
          Share on WhatsApp
        </a>
        <button type="button" onClick={copy} className={pill}>
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
      <p className="mt-2 break-all font-mono text-xs text-muted/70">{copyUrl}</p>
    </section>
  );
}

/** Shown when they said their employer would pay. */
export function SponsorNote() {
  return (
    <p className="text-sm text-muted">
      Employer paying?{" "}
      <Link href={COHORT_2.sponsorHref} className="text-foreground underline underline-offset-4">
        Open the employer one-pager
      </Link>{" "}
      to forward to your manager.
    </p>
  );
}

export function NextSteps() {
  return (
    <section aria-labelledby="next-steps-heading" className="border-t border-border pt-6">
      <h3 id="next-steps-heading" className={sectionLabel}>
        While you wait
      </h3>
      <ul className="mt-3 space-y-2">
        <li>
          <a
            href={COHORT_2.prepCourse.url}
            target="_blank"
            rel="noopener noreferrer"
            className={textLink}
          >
            Start the setup course
          </a>
          <span className="text-sm text-muted/70"> · free, so you can build from the first class</span>
        </li>
        <li>
          <a href={COHORT_2.whatsappUrl} target="_blank" rel="noopener noreferrer" className={textLink}>
            Chat on WhatsApp
          </a>
          <span className="text-sm text-muted/70"> · questions go straight to Girish</span>
        </li>
      </ul>
      <p className="mt-4 text-xs text-muted/70">We&apos;ve emailed you these links too.</p>
    </section>
  );
}
