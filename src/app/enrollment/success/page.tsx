import Link from "next/link";
import type { Metadata } from "next";
import {
  LMS_REGISTER_URL,
  SITE_CONFIG,
  WHATSAPP_GROUP_URL,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Enrollment Confirmed — IntelliForge AI Bootcamp",
  description: "You're enrolled in the IntelliForge AI Bootcamp. Here's what to do next.",
};

export default async function EnrollmentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 text-6xl" aria-hidden>
          🎉
        </div>
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          You&apos;re enrolled!
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-muted">
          Payment confirmed. Welcome to the IntelliForge AI Bootcamp — your seat
          in the upcoming cohort is reserved.
        </p>

        <div className="mb-8 rounded-xl border border-border bg-surface p-6 text-left">
          <h2 className="mb-4 font-semibold text-foreground">What happens next</h2>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">1.</span>
              Join the WhatsApp cohort group to meet your batchmates and get
              session updates
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">2.</span>
              Register on the LMS to access course materials, recordings, and
              assignments
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">3.</span>
              Live sessions run Saturdays &amp; Sundays (4–5 hours per day) over
              12 weeks — schedule details will be shared in WhatsApp
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-accent">4.</span>
              Check your email for a payment receipt and onboarding instructions
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-cta px-8 py-4 text-lg font-semibold text-background transition-colors hover:bg-cta-hover"
          >
            Join WhatsApp Cohort Group →
          </a>
          <a
            href={LMS_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border bg-surface px-8 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/30"
          >
            Register on LMS →
          </a>
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Back to homepage
          </Link>
        </div>

        {params.payment_id && (
          <p className="mt-6 text-xs text-muted">
            Payment ID: {params.payment_id}
          </p>
        )}

        <p className="mt-8 text-xs text-muted">
          Questions? Email{" "}
          <a
            href={`mailto:${SITE_CONFIG.contact.email}`}
            className="text-accent hover:underline"
          >
            {SITE_CONFIG.contact.email}
          </a>
        </p>
      </div>
    </main>
  );
}
