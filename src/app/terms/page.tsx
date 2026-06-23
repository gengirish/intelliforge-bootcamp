import Link from "next/link";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service — IntelliForge AI Bootcamp",
  description: "Terms of service, enrollment policies, and refund policy for IntelliForge AI Bootcamp.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-6">
          <Link
            href="/"
            className="text-lg font-semibold transition-opacity hover:opacity-90"
          >
            <span className="gradient-text">{SITE_CONFIG.name}</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold">Terms of Service</h1>
        <p className="mb-10 text-sm text-muted">Last updated: June 2026</p>

        <div className="space-y-8 text-muted">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Enrollment &amp; Payment
            </h2>
            <p className="leading-relaxed">
              By enrolling in the IntelliForge AI Bootcamp or 2-Week AI Sprint,
              you agree to pay the listed fee at checkout via Razorpay. Enrollment
              is confirmed upon successful payment. Seat availability is limited
              and allocated on a first-come, first-served basis.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Refund Policy
            </h2>
            <p className="leading-relaxed">
              We offer a 15-day money-back guarantee for the 12-week AI Bootcamp.
              If you attend the first two weekends and feel the program isn&apos;t
              right for you, contact us within 15 days of your enrollment date for
              a full refund — no questions asked. Sprint enrollments are
              non-refundable after the cohort start date unless otherwise stated
              at the time of purchase.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Program Access
            </h2>
            <p className="leading-relaxed">
              Bootcamp participants receive lifetime access to course materials on
              our LMS at {SITE_CONFIG.lms}. Live session recordings, community
              access, and mentorship are included as described at the time of
              enrollment. We reserve the right to update curriculum content to
              reflect current industry practices.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Code of Conduct
            </h2>
            <p className="leading-relaxed">
              Participants are expected to engage respectfully in live sessions,
              WhatsApp groups, and community forums. Harassment, spam, or sharing
              of paid course materials without permission may result in removal
              from the program without refund.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              IntelliForge provides education and mentorship. We do not guarantee
              employment, income, or specific business outcomes. Our liability is
              limited to the amount paid for the program.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Contact
            </h2>
            <p className="leading-relaxed">
              For questions about these terms, email{" "}
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="text-accent hover:underline"
              >
                {SITE_CONFIG.contact.email}
              </a>
              .
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-muted">
          <Link href="/" className="text-accent hover:underline">
            ← Back to homepage
          </Link>
          {" · "}
          <Link href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
        </p>
      </main>
    </div>
  );
}
