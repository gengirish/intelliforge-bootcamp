import type { Metadata } from "next";
import Link from "next/link";
import { COHORT_2, getWhatsAppUrl } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Enrolled Learners Only · IntelliForge AI",
  robots: { index: false, follow: false },
};

const HELP_URL = getWhatsAppUrl(
  "Hi! I'm enrolled in the IntelliForge AI Bootcamp but can't open my class link."
);

export default function CohortAccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-foreground">
          This link is for enrolled learners
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          We couldn&apos;t find a paid enrolment on this account. If you&apos;ve
          paid, sign in with the email you used at checkout, or message us and
          we&apos;ll send your class links.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href={HELP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-cta px-8 py-4 font-semibold text-background transition-colors hover:bg-cta-hover"
          >
            Message us on WhatsApp
          </a>
          <Link
            href={COHORT_2.waitlistHref}
            className="rounded-lg border border-border bg-surface px-8 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/30"
          >
            Not enrolled? Join the {COHORT_2.name} waitlist
          </Link>
        </div>
      </div>
    </main>
  );
}
