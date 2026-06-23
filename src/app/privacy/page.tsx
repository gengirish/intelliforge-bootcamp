import Link from "next/link";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy — IntelliForge AI Bootcamp",
  description: "How IntelliForge collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
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
        <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
        <p className="mb-10 text-sm text-muted">Last updated: June 2026</p>

        <div className="space-y-8 text-muted">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Overview
            </h2>
            <p className="leading-relaxed">
              IntelliForge AI (&quot;we&quot;, &quot;us&quot;) operates
              upskill.intelliforge.tech and related services. This policy
              explains what personal data we collect, how we use it, and your
              rights regarding that data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Data We Collect
            </h2>
            <ul className="list-disc space-y-2 pl-5 leading-relaxed">
              <li>
                <strong className="text-foreground">Contact form:</strong> Name,
                email, phone number, and message content when you reach out via
                our website contact form.
              </li>
              <li>
                <strong className="text-foreground">Sprint authentication:</strong>{" "}
                When you sign up for the 2-Week AI Sprint, we use Clerk to
                manage authentication. Clerk may collect your name, email
                address, and profile information you provide during sign-in.
              </li>
              <li>
                <strong className="text-foreground">Payments:</strong> Payment
                processing is handled by Razorpay. We receive confirmation of
                successful payments (payment ID, order ID) but do not store your
                full card or bank details on our servers.
              </li>
              <li>
                <strong className="text-foreground">Usage data:</strong> Standard
                server logs and analytics may include IP address, browser type,
                and pages visited to improve our services.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              How We Use Your Data
            </h2>
            <ul className="list-disc space-y-2 pl-5 leading-relaxed">
              <li>Process enrollments and confirm your seat in a cohort</li>
              <li>Send onboarding instructions, session reminders, and course updates</li>
              <li>Provide access to the LMS and community resources</li>
              <li>Respond to support requests and refund inquiries</li>
              <li>Improve our website and program offerings</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              WhatsApp Communications
            </h2>
            <p className="leading-relaxed">
              By enrolling, you consent to receiving cohort-related messages via
              WhatsApp, including group invitations, session links, schedule
              updates, and pre-read materials. You may leave the WhatsApp group
              at any time. For direct support, you can also reach us at{" "}
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="text-accent hover:underline"
              >
                {SITE_CONFIG.contact.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Third-Party Services
            </h2>
            <p className="leading-relaxed">
              We use trusted third parties to deliver our services, including
              Razorpay (payments), Clerk (authentication for sprint), and our
              learning platform at {SITE_CONFIG.lms}. Each provider has its own
              privacy policy governing how they handle your data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Data Retention &amp; Your Rights
            </h2>
            <p className="leading-relaxed">
              We retain enrollment and payment records as required for accounting
              and support purposes. You may request access to, correction of, or
              deletion of your personal data by contacting{" "}
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="text-accent hover:underline"
              >
                {SITE_CONFIG.contact.email}
              </a>
              . We will respond within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Contact
            </h2>
            <p className="leading-relaxed">
              IntelliForge AI · {SITE_CONFIG.contact.location}
              <br />
              Email:{" "}
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="text-accent hover:underline"
              >
                {SITE_CONFIG.contact.email}
              </a>
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-muted">
          <Link href="/" className="text-accent hover:underline">
            ← Back to homepage
          </Link>
          {" · "}
          <Link href="/terms" className="text-accent hover:underline">
            Terms of Service
          </Link>
        </p>
      </main>
    </div>
  );
}
