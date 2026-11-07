"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { attributionFromPage, readAttribution } from "@/lib/attribution";
import { COHORT_2 } from "@/lib/constants";

type FormStatus = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-lg border border-border bg-surface-light px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

function ChoiceField({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: readonly { value: string; label: string }[];
}) {
  const id = `waitlist-${name}`;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select id={id} name={name} required defaultValue="" className={inputClass}>
        <option value="" disabled>
          Choose one
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function WaitlistForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          motivation: formData.get("motivation"),
          role: formData.get("role"),
          experience: formData.get("experience"),
          payer: formData.get("payer"),
          consent: formData.get("consent") === "on",
          website: formData.get("website"),
          attribution: readAttribution() ?? attributionFromPage(),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't save your place. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-6 text-foreground sm:p-8"
      >
        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
        <div className="min-w-0 space-y-5">
          <p>
            You&apos;re on the {COHORT_2.name} waitlist. We&apos;ll contact you
            when enrolment opens on {COHORT_2.launchWeekend}.
          </p>

          <div>
            <p className="font-semibold">While you wait</p>
            <ol className="mt-3 space-y-4 text-sm text-muted">
              <li>
                <span className="font-medium text-foreground">
                  1. Set up your machine.
                </span>{" "}
                Work through the free {COHORT_2.prepCourse.name} so you can
                start building from the first class.
                <a
                  href={COHORT_2.prepCourse.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex w-full items-center justify-center rounded-lg bg-cta px-5 py-3 font-semibold text-background transition-colors hover:bg-cta-hover"
                >
                  Start the setup course
                </a>
              </li>
              <li>
                <span className="font-medium text-foreground">
                  2. Say hello on WhatsApp.
                </span>{" "}
                Message Girish directly with any questions about the cohort.
                <a
                  href={COHORT_2.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex w-full items-center justify-center rounded-lg border border-border bg-surface-light px-5 py-3 font-semibold text-foreground transition-colors hover:border-primary/40"
                >
                  Chat on WhatsApp
                </a>
              </li>
            </ol>
          </div>

          <p className="text-sm text-muted">
            We&apos;ve emailed you these links too.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <div>
        <label htmlFor="waitlist-name" className={labelClass}>
          Name
        </label>
        <input
          id="waitlist-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          maxLength={120}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="waitlist-email" className={labelClass}>
          Email
        </label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="waitlist-phone" className={labelClass}>
          WhatsApp number (optional)
        </label>
        <input
          id="waitlist-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={32}
          placeholder="+91 98765 43210"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="waitlist-motivation" className={labelClass}>
          What do you most want from this?
        </label>
        <select
          id="waitlist-motivation"
          name="motivation"
          required
          defaultValue=""
          className={inputClass}
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
      </div>

      <ChoiceField
        name="role"
        label="What's your current role?"
        options={COHORT_2.roles}
      />
      <ChoiceField
        name="experience"
        label="Years of work experience"
        options={COHORT_2.experience}
      />
      <ChoiceField
        name="payer"
        label="Who would pay for the course?"
        options={COHORT_2.payers}
      />

      {/* Honeypot: hidden from people and assistive tech. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="waitlist-website">Website</label>
        <input
          id="waitlist-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex items-start gap-3 text-sm text-muted">
        <input
          id="waitlist-consent"
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        />
        <div>
          <label htmlFor="waitlist-consent">
            Contact me about {COHORT_2.name} by email, and on WhatsApp if I gave
            a number.
          </label>{" "}
          <Link href="/privacy" className="text-accent hover:underline">
            Privacy policy
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-cta px-6 py-3.5 font-semibold text-background transition-colors hover:bg-cta-hover focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 className="h-5 w-5 animate-spin" />}
        {status === "submitting" ? "Saving your place..." : "Join the waitlist"}
      </button>

      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-400"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          {errorMessage}
        </div>
      )}
    </form>
  );
}
