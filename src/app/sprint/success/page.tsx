import Link from "next/link";
import {
  LMS_SIGNIN_URL,
  SPRINT_CONFIG,
  SPRINT_COHORT_WHATSAPP,
  SPRINT_COHORT_WHATSAPP_URL,
} from "@/lib/constants";

export default async function SprintSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; order_id?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 text-6xl" aria-hidden>
          🎉
        </div>
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          You&apos;re in, Cohort 1!
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-muted">
          Payment confirmed. Your seat in the 2-Week AI Sprint is reserved.
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
              Sign in to the LMS — your account is auto-provisioned with the
              email you used at checkout
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">3.</span>
              Live classes every Saturday &amp; Sunday — 9–11 AM IST &amp;
              8–10 PM IST (see schedule on sprint page for PST / EST / CET)
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">4.</span>
              Session 1 is {SPRINT_CONFIG.session1Date} · Zoom link in WhatsApp
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">5.</span>
              Pre-read: Anthropic Claude API docs + The Illustrated Transformer
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">6.</span>
              Your research docs (IF-RES-2026-012 + 013) will be shared in the
              group
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
