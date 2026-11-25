"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { attributionFromPage, readAttribution } from "@/lib/attribution";
import { COHORT_2, HOME } from "@/lib/constants";
import { NextSteps, ShareYourSpot, SponsorNote } from "@/components/waitlist/after-signup";

type Status = "idle" | "submitting" | "success" | "error";
type Choice = "role" | "experience" | "motivation" | "payer";
type Values = Record<"name" | "email" | Choice, string>;

const EMPTY: Values = { name: "", email: "", role: "", experience: "", motivation: "", payer: "" };

const PHRASES: Record<Choice, Record<string, string>> = {
  role: HOME.sentence.roles,
  experience: HOME.sentence.experience,
  motivation: HOME.sentence.motivations,
  payer: HOME.sentence.payers,
};

/** Order the blanks are checked in, so the first gap is the one focused. */
const ORDER = ["name", "role", "experience", "motivation", "payer", "email"] as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function blankClass(filled: boolean, flagged: boolean) {
  return [
    "border-b-2 border-dashed transition-colors",
    filled ? "border-cta/40 text-cta" : "border-muted/50 text-muted/60",
    flagged && "border-red-400 text-red-300",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * A select drawn as a blank in the sentence. The visible text is a span, and
 * the native select sits invisibly on top of it, so the blank is as wide as the
 * chosen phrase in every browser and phones still get the native picker.
 */
function Blank({
  name,
  label,
  placeholder,
  value,
  flagged,
  onChange,
}: {
  name: Choice;
  label: string;
  placeholder: string;
  value: string;
  flagged: boolean;
  onChange: (v: string) => void;
}) {
  const phrases = PHRASES[name];
  return (
    <span className="relative inline-block rounded-sm focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-cta">
      <span aria-hidden="true" className={blankClass(value !== "", flagged)}>
        {value ? phrases[value] : placeholder}
      </span>
      <select
        name={name}
        aria-label={label}
        aria-invalid={flagged || undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {Object.entries(phrases).map(([v, phrase]) => (
          <option key={v} value={v}>
            {phrase}
          </option>
        ))}
      </select>
    </span>
  );
}

function TextBlank({
  name,
  label,
  placeholder,
  value,
  flagged,
  type = "text",
  autoComplete,
  maxLength,
  onChange,
}: {
  name: "name" | "email";
  label: string;
  placeholder: string;
  value: string;
  flagged: boolean;
  type?: "text" | "email";
  autoComplete: string;
  maxLength: number;
  onChange: (v: string) => void;
}) {
  return (
    <input
      id={`home-${name}`}
      name={name}
      type={type}
      aria-label={label}
      aria-invalid={flagged || undefined}
      autoComplete={autoComplete}
      maxLength={maxLength}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      // field-sizing hugs the text; `size` is the fallback where it's unsupported.
      size={Math.max(placeholder.length, value.length + 1)}
      style={{ fieldSizing: "content", minWidth: `${Math.min(placeholder.length, 8)}ch` } as React.CSSProperties}
      className={`${blankClass(value !== "", flagged)} m-0 max-w-full rounded-none bg-transparent p-0 align-baseline leading-tight ${flagged ? "placeholder:text-red-300/80" : "placeholder:text-muted/60"} focus:outline-2 focus:outline-offset-4 focus:outline-cta`}
    />
  );
}

export function SentenceSignup({ enrollmentOpen }: { enrollmentOpen: boolean }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [consent, setConsent] = useState(false);
  const [showGaps, setShowGaps] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState<{ referralCode: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (key: keyof Values) => (v: string) => {
    setValues((s) => ({ ...s, [key]: v }));
    // The red marks stay live; the message only describes the last attempt.
    if (status === "error") setStatus("idle");
  };
  const isFilled = (key: keyof Values) =>
    key === "email" ? EMAIL.test(values.email.trim()) : values[key].trim() !== "";
  const gap = (key: keyof Values) => showGaps && !isFilled(key);
  const firstName = values.name.trim().split(/\s+/)[0] ?? "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const missing = ORDER.find((k) => !isFilled(k));
    if (missing || !consent) {
      setShowGaps(true);
      setError(
        missing
          ? "Fill in the blanks marked in red, then try again."
          : "Tick the box so we're allowed to email you."
      );
      setStatus("error");
      const target = missing ?? "consent";
      formRef.current?.querySelector<HTMLElement>(`[name="${target}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setError("");
    const website = new FormData(e.currentTarget).get("website");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          name: values.name.trim(),
          email: values.email.trim(),
          consent: true,
          website,
          attribution: readAttribution() ?? attributionFromPage(),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setJoined(data.data ?? null);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
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
          <p className="text-3xl font-semibold leading-snug tracking-tight sm:text-4xl">
            You&apos;re on the list, <span className="text-cta">{firstName}</span>.
          </p>
          <p className="mt-3 text-lg text-muted">
            {enrollmentOpen
              ? `We'll email ${values.email.trim()} with the details.`
              : `We'll email ${values.email.trim()} when enrolment opens on ${COHORT_2.launchWeekend}.`}
          </p>
        </div>
        <ShareYourSpot referralCode={joined?.referralCode} />
        {values.payer === "employer" && <SponsorNote />}
        <NextSteps />
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label={`Join the ${COHORT_2.name} waitlist`}>
      <p className="text-2xl leading-[1.9] tracking-tight text-foreground sm:text-3xl sm:leading-[1.8]">
        I&apos;m{" "}
        <TextBlank
          name="name"
          label="Your name"
          placeholder="your name"
          value={values.name}
          flagged={gap("name")}
          autoComplete="name"
          maxLength={120}
          onChange={set("name")}
        />{" "}
        and I work in{" "}
        <Blank
          name="role"
          label="What you work in"
          placeholder="your field"
          value={values.role}
          flagged={gap("role")}
          onChange={set("role")}
        />{" "}
        with{" "}
        <Blank
          name="experience"
          label="Years of work experience"
          placeholder="how many years"
          value={values.experience}
          flagged={gap("experience")}
          onChange={set("experience")}
        />{" "}
        of experience. I want to{" "}
        <Blank
          name="motivation"
          label="What you want from the course"
          placeholder="what you want"
          value={values.motivation}
          flagged={gap("motivation")}
          onChange={set("motivation")}
        />
        , and{" "}
        <Blank
          name="payer"
          label="Who would pay"
          placeholder="who would pay"
          value={values.payer}
          flagged={gap("payer")}
          onChange={set("payer")}
        />
        . Email me at{" "}
        <TextBlank
          name="email"
          type="email"
          label="Your email"
          placeholder="you@email.com"
          value={values.email}
          flagged={gap("email")}
          autoComplete="email"
          maxLength={254}
          onChange={set("email")}
        />{" "}
        {enrollmentOpen ? "with the details." : `when ${COHORT_2.name} opens.`}
      </p>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="home-website">Website</label>
        <input id="home-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <label
          className={`flex max-w-sm items-start gap-3 text-sm ${
            showGaps && !consent ? "text-red-300" : "text-muted"
          }`}
        >
          <input
            name="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (status === "error") setStatus("idle");
            }}
            className="mt-0.5 h-4 w-4 shrink-0 accent-cta"
          />
          <span>
            You can email me about {COHORT_2.name}.{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              Privacy
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-cta px-7 py-3.5 font-semibold text-background transition-colors hover:bg-cta-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving your place…
            </>
          ) : (
            <>
              {firstName ? `Count me in, ${firstName}` : "Count me in"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>

      <p className="mt-4 text-sm text-muted">Free to join. You don&apos;t have to enrol.</p>

      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}
