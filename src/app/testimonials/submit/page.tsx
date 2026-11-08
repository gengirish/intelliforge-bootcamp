import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";
import { prisma } from "@/lib/prisma";
import { mediaPrefixFor, normalizeProvider } from "@/lib/testimonials";
import {
  findPaidPrograms,
  getSubmitterIdentity,
  isTestimonialMediaConfigured,
} from "@/lib/testimonials-server";

export const dynamic = "force-dynamic";

const SELF = "/testimonials/submit";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← IntelliForge AI
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Share your testimonial
        </h1>
        {children}
      </div>
    </main>
  );
}

export default async function SubmitTestimonialPage() {
  // Clerk isn't running under the E2E bypass, so tests see a stub.
  if (process.env.NEXT_PUBLIC_E2E_BYPASS === "1") {
    return <Shell>{null}</Shell>;
  }

  const identity = await getSubmitterIdentity();
  if (!identity) redirect(`/sign-in?redirect_url=${encodeURIComponent(SELF)}`);

  if (identity.accounts.length === 0) {
    return (
      <Shell>
        <div className="mt-8 max-w-xl rounded-xl border border-border bg-surface p-6">
          <p className="text-foreground">
            Testimonials are verified through Google or LinkedIn, so readers can trust the name
            and photo are really yours. You&apos;re signed in another way.
          </p>
          <p className="mt-3 text-muted">
            Sign out, then sign back in with Google or LinkedIn.
          </p>
          <SignOutButton redirectUrl={`/sign-in?redirect_url=${encodeURIComponent(SELF)}`}>
            <button className="mt-5 rounded-lg bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary/90">
              Sign out and switch account
            </button>
          </SignOutButton>
        </div>
      </Shell>
    );
  }

  const [existing, programs] = await Promise.all([
    prisma.testimonial.findUnique({ where: { clerkUserId: identity.userId } }),
    findPaidPrograms(identity.userId, identity.verifiedEmails).catch(() => [] as string[]),
  ]);

  return (
    <Shell>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Tell other professionals what the bootcamp was like. Your name and photo come from your{" "}
        {identity.accounts.map((a) => (a.provider === "google" ? "Google" : "LinkedIn")).join(" or ")}{" "}
        account, and Girish reviews every testimonial before it goes live.
      </p>
      {existing && (
        <p className="mt-4 max-w-2xl rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
          {existing.status === "APPROVED"
            ? "Your testimonial is live. Saving changes sends it back for review, and the current version comes down until it is approved again."
            : existing.status === "REJECTED"
              ? "Your last version wasn't published. You can edit and resubmit it below."
              : "Your testimonial is waiting for review. You can still edit it."}
        </p>
      )}
      <div className="mt-10">
        <TestimonialForm
          accounts={identity.accounts.map(({ provider, name, avatarUrl }) => ({ provider, name, avatarUrl }))}
          learnerPrograms={programs}
          mediaEnabled={isTestimonialMediaConfigured()}
          mediaPrefix={mediaPrefixFor(identity.userId)}
          initial={
            existing && {
              provider: normalizeProvider(existing.provider),
              headline: existing.headline,
              linkedinUrl: existing.linkedinUrl ?? "",
              quote: existing.quote,
              transcript: existing.transcript ?? "",
              mediaUrl: existing.mediaUrl,
              mediaKind: existing.mediaKind,
            }
          }
        />
      </div>
    </Shell>
  );
}
