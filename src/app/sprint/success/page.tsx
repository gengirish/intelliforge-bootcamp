import Link from "next/link";
import { SprintPaymentConfirm } from "@/components/sprint/SprintPaymentConfirm";
import {
  COHORT_2_SPRINTS,
  findCohort2Sprint,
  LMS_SIGNIN_URL,
  LMS_UPSKILL_ROADMAP_URL,
  SPRINT_COHORT_WHATSAPP,
  SPRINT_COHORT_WHATSAPP_URL,
} from "@/lib/constants";

export default async function SprintSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    payment_id?: string;
    order_id?: string;
    sprint?: string;
  }>;
}) {
  const params = await searchParams;
  const sprint = findCohort2Sprint(params.sprint) ?? COHORT_2_SPRINTS[0];

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <SprintPaymentConfirm
        orderId={params.order_id}
        paymentId={params.payment_id}
      />
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 text-6xl" aria-hidden>
          🎉
        </div>
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          You&apos;re in, Cohort 2!
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-muted">
          Payment confirmed. Your seat in Sprint {sprint.number} of 6 is reserved.
          Join <strong>{SPRINT_COHORT_WHATSAPP.name}</strong> on WhatsApp — your
          cohort channel for session links, materials, and updates.
        </p>

        <div className="mb-8 rounded-xl border border-border bg-surface p-6 text-left">
          <h2 className="mb-4 font-semibold text-foreground">What happens next</h2>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">1.</span>
              Join {SPRINT_COHORT_WHATSAPP.name} on WhatsApp using the button below
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">2.</span>
              Sign in to the LMS and open{" "}
              <a
                href={LMS_UPSKILL_ROADMAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                12-Week AI Upskill RoadMap
              </a>
              — auto-provisioned with your checkout email
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">3.</span>
              Live classes every Saturday &amp; Sunday — 7–10 PM IST
              (see schedule on sprint page for PST / EST / CET)
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">4.</span>
              Session 1 is {sprint.firstClass} · Zoom link in WhatsApp
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">5.</span>
              Pre-read: Anthropic Claude API docs + The Illustrated Transformer
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">6.</span>
              Read IF-RES-2026-012 &amp; 013 on the{" "}
              <Link href="/research" className="text-accent hover:underline">
                research hub
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={SPRINT_COHORT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-cta px-8 py-4 text-lg font-semibold text-background transition-colors hover:bg-cta-hover"
          >
            Join {SPRINT_COHORT_WHATSAPP.name} on WhatsApp →
          </a>
          <a
            href={LMS_SIGNIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border bg-surface px-8 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/30"
          >
            Sign in to LMS →
          </a>
          <Link
            href="/sprint"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Back to sprint page
          </Link>
        </div>

        {params.payment_id && (
          <p className="mt-6 text-xs text-muted">
            Payment ID: {params.payment_id}
          </p>
        )}
      </div>
    </main>
  );
}
