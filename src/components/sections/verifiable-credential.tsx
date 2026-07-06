import { Check, ExternalLink, X } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { VERIFIABLE_CREDENTIAL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function VerifiableCredential() {
  return (
    <section
      id="credential"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      aria-labelledby="credential-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center sm:mb-16">
          <h2
            id="credential-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            A Credential Recruiters Can{" "}
            <span className="gradient-text">Actually Verify</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Your credential is a public URL — not a PDF you email yourself.
            Recruiters click, confirm, and move on.
          </p>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <FadeIn delay={0.1}>
            <div
              className={cn(
                "rounded-xl border border-border bg-surface-light p-6 sm:p-8"
              )}
            >
              <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                What&apos;s on your credential
              </h3>
              <p className="mt-2 text-sm text-muted">
                Issued via{" "}
                <a
                  href={VERIFIABLE_CREDENTIAL.issuerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded"
                >
                  certs.intelliforge.tech
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              </p>
              <ul className="mt-6 space-y-3">
                {VERIFIABLE_CREDENTIAL.fields.map((field) => (
                  <li
                    key={field}
                    className="flex items-start gap-3 text-muted"
                  >
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                      aria-hidden
                    />
                    <span>{field}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="space-y-4">
              <article
                className={cn(
                  "rounded-xl border border-border bg-surface p-6 sm:p-8",
                  "opacity-70"
                )}
              >
                <div className="mb-3 flex items-center gap-2">
                  <X className="h-5 w-5 text-muted" aria-hidden />
                  <span className="text-sm font-medium uppercase tracking-wider text-muted">
                    Typical bootcamp badge
                  </span>
                </div>
                <p className="text-foreground/80">
                  {VERIFIABLE_CREDENTIAL.contrastAttended}
                </p>
              </article>

              <article
                className={cn(
                  "rounded-xl border border-accent/30 bg-accent/5 p-6 sm:p-8",
                  "border-l-4 border-l-accent"
                )}
              >
                <div className="mb-3 flex items-center gap-2">
                  <Check className="h-5 w-5 text-accent" aria-hidden />
                  <span className="text-sm font-medium uppercase tracking-wider text-accent">
                    IntelliForge credential
                  </span>
                </div>
                <p className="font-medium text-foreground">
                  {VERIFIABLE_CREDENTIAL.contrastShipped}
                </p>
              </article>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
