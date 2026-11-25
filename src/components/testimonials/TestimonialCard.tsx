import { BadgeCheck, ExternalLink, GraduationCap, Linkedin, Quote } from "lucide-react";
import type { PublicTestimonial } from "@/lib/testimonials-server";
import { PROVIDER_LABEL, displayName, normalizeProvider } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function TestimonialAvatar({
  testimonial: t,
  size = "md",
  className,
}: {
  testimonial: Pick<PublicTestimonial, "avatarUrl" | "name">;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box = { sm: "h-10 w-10 text-xs", md: "h-12 w-12 text-sm", lg: "h-16 w-16 text-base" }[size];
  const px = { sm: 40, md: 48, lg: 64 }[size];
  if (t.avatarUrl) {
    return (
      // Provider avatars come from several CDNs; a plain img avoids an image-domain allowlist.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={t.avatarUrl}
        alt=""
        width={px}
        height={px}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={cn(box, "shrink-0 rounded-full object-cover ring-2 ring-surface-light", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        box,
        "flex shrink-0 items-center justify-center rounded-full bg-primary/20 font-semibold text-primary-light ring-2 ring-surface-light",
        className
      )}
      aria-hidden
    >
      {initials(t.name)}
    </div>
  );
}

/**
 * One learner testimonial. Badges only state what was checked: the provider
 * badge means the name and photo came from that sign-in; the learner badge
 * means a paid enrolment matched, or an admin checked an off-platform payment. A LinkedIn link the learner typed is labelled
 * as theirs.
 *
 * `featured` lays the same content out larger, for the lead story on /testimonials.
 */
export function TestimonialCard({
  testimonial: t,
  featured = false,
  className,
}: {
  testimonial: PublicTestimonial;
  featured?: boolean;
  className?: string;
}) {
  const provider = normalizeProvider(t.provider);
  const providerLabel = provider ? PROVIDER_LABEL[provider] : null;
  const name = displayName(t.name);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-light/60 transition-colors hover:border-primary/40",
        featured ? "p-7 sm:p-10" : "p-6 sm:p-7",
        className
      )}
    >
      {featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
        />
      )}

      <Quote
        aria-hidden
        className={cn(
          "shrink-0 fill-primary-light/15 text-primary-light/60",
          featured ? "h-10 w-10" : "h-7 w-7"
        )}
      />

      {t.mediaUrl && t.mediaKind === "VIDEO" && (
        <video
          src={t.mediaUrl}
          controls
          playsInline
          preload="metadata"
          className="mt-5 aspect-video w-full rounded-lg bg-black object-contain"
          aria-label={`Video testimonial from ${name}`}
        />
      )}
      {t.mediaUrl && t.mediaKind === "AUDIO" && (
        <audio
          src={t.mediaUrl}
          controls
          preload="metadata"
          className="mt-5 w-full"
          aria-label={`Audio testimonial from ${name}`}
        />
      )}
      {t.mediaUrl && t.transcript && (
        <details className="mt-3 text-sm text-muted">
          <summary className="cursor-pointer text-primary-light">Read transcript</summary>
          <p className="mt-2 whitespace-pre-line">{t.transcript}</p>
        </details>
      )}

      <blockquote
        className={cn(
          "relative mt-4 flex-1 leading-relaxed text-foreground/90",
          featured ? "text-lg sm:text-xl sm:leading-relaxed" : "text-[15px]"
        )}
      >
        <p className="whitespace-pre-line">{t.quote}</p>
      </blockquote>

      <footer className="relative mt-7 border-t border-border pt-5">
        <div className="flex items-center gap-4">
          <TestimonialAvatar testimonial={t} size={featured ? "lg" : "md"} />
          <div className="min-w-0 flex-1">
            <p className={cn("font-semibold text-foreground", featured && "text-lg")}>{name}</p>
            <p className="text-sm text-muted">{t.headline}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {providerLabel && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-1 text-xs font-medium text-sky-300"
              title={`Name and photo come from their ${providerLabel} account, confirmed when they signed in.`}
            >
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              {providerLabel} verified
            </span>
          )}
          {t.verifiedLearner && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-400/10 px-2.5 py-1 text-xs font-medium text-green-300"
              title={
                t.learnerVerifiedVia === "PAYMENT_RECORD"
                  ? "Paid by UPI or bank transfer; IntelliForge checked the payment against its records."
                  : "Matched to a paid IntelliForge enrolment."
              }
            >
              <GraduationCap className="h-3.5 w-3.5" aria-hidden />
              Verified learner{t.learnerSprints ? ` · ${t.learnerSprints}` : ""}
            </span>
          )}
          {t.linkedinUrl && (
            <a
              href={t.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-primary-light transition-colors hover:border-primary-light/40 hover:text-foreground"
            >
              <Linkedin className="h-3.5 w-3.5" aria-hidden />
              LinkedIn profile
              <ExternalLink className="h-3 w-3" aria-hidden />
              <span className="sr-only">(link provided by {name})</span>
            </a>
          )}
        </div>
      </footer>
    </article>
  );
}
