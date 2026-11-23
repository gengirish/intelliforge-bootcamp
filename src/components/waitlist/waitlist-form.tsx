"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { attributionFromPage, readAttribution } from "@/lib/attribution";
import { COHORT_2 } from "@/lib/constants";
import { FollowUpQuestion, NextSteps, ShareYourSpot, SponsorNote } from "./after-signup";

type FormStatus = "idle" | "submitting" | "success" | "error";
type JoinResult = { token: string; referralCode: string } | null;

const fieldClass =
  "w-full rounded-md border border-border bg-transparent px-3.5 py-2.5 text-foreground placeholder:text-muted/50 transition-colors focus:border-muted focus:outline-none";
const labelClass = "mb-1.5 block text-sm text-muted";

/** Visual required marker; assistive tech reads `required` instead. */
function Req() {
  return (
    <span aria-hidden="true" className="ml-0.5">
      *
    </span>
  );
}

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
    <div className="min-w-0">
      <label htmlFor={id} className={labelClass}>
        {label}
        <Req />
      </label>
      <select id={id} name={name} required defaultValue="" className={`${fieldClass} bg-background`}>
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
  const [joined, setJoined] = useState<JoinResult>(null);
  const [employerPays, setEmployerPays] = useState(false);

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
      setJoined(data.data ?? null);
      setEmployerPays(formData.get("payer") === "employer");
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
      <div role="status" className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            You&apos;re on the {COHORT_2.name} waitlist.
          </h2>
          <p className="mt-2 text-muted">
            We&apos;ll email you when enrolment opens on {COHORT_2.launchWeekend}.
          </p>
        </div>

        {joined && <FollowUpQuestion token={joined.token} />}
        <ShareYourSpot referralCode={joined?.referralCode} />
        {employerPays && <SponsorNote />}
        <NextSteps />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="waitlist-name" className={labelClass}>
            Name
            <Req />
          </label>
          <input
            id="waitlist-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            className={fieldClass}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="waitlist-email" className={labelClass}>
            Email
            <Req />
          </label>
          <input
            id="waitlist-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            className={fieldClass}
          />
        </div>
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
          className={fieldClass}
        />
      </div>

      <ChoiceField name="role" label="What's your current role?" options={COHORT_2.roles} />

      <div className="grid gap-5 sm:grid-cols-2">
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
      </div>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="waitlist-website">Website</label>
        <input id="waitlist-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-start gap-3 pt-1 text-sm text-muted">
        <input
          id="waitlist-consent"
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-cta"
        />
        <div>
          <label htmlFor="waitlist-consent">
            Contact me about {COHORT_2.name} by email, and on WhatsApp if I gave a number.
            <Req />
          </label>{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            Privacy policy
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-cta px-6 py-3 font-semibold text-background transition-colors hover:bg-cta-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "submitting" ? "Saving your place..." : "Join the waitlist"}
      </button>

      <p className="text-center text-xs text-muted">
        * Required. Joining is free and you don&apos;t have to enrol.
      </p>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}

      <p className="pt-5 text-sm text-muted">
        Employer paying?{" "}
        <Link
          href={COHORT_2.sponsorHref}
          className="underline underline-offset-4 hover:text-foreground"
        >
          Send them the one-page summary
        </Link>
        .
      </p>
    </form>
  );
}
