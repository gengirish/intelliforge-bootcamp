import { BadgeCheck, ExternalLink, GraduationCap, Linkedin } from "lucide-react";
import type { PublicTestimonial } from "@/lib/testimonials-server";
import { PROVIDER_LABEL, normalizeProvider } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

/**
 * One learner testimonial. Badges only state what was checked: the provider
 * badge means the name and photo came from that sign-in; the learner badge
 * means a paid enrolment matched. A LinkedIn link the learner typed is labelled
 * as theirs.
 */
export function TestimonialCard({
  testimonial: t,
  className,
}: {
  testimonial: PublicTestimonial;
  className?: string;
}) {
  const provider = normalizeProvider(t.provider);
  const providerLabel = provider ? PROVIDER_LABEL[provider] : null;

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border border-border bg-surface-light p-6 sm:p-7",
        className
      )}
    >
      <div className="flex flex-wrap gap-2">
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
            title="Matched to a paid IntelliForge enrolment."
          >
            <GraduationCap className="h-3.5 w-3.5" aria-hidden />
            Verified learner{t.learnerSprints ? ` · ${t.learnerSprints}` : ""}
          </span>
        )}
      </div>

      {t.mediaUrl && t.mediaKind === "VIDEO" && (
        <video
          src={t.mediaUrl}
          controls
          playsInline
          preload="metadata"
          className="mt-5 aspect-video w-full rounded-lg bg-black object-contain"
          aria-label={`Video testimonial from ${t.name}`}
        />
      )}
      {t.mediaUrl && t.mediaKind === "AUDIO" && (
        <audio
          src={t.mediaUrl}
          controls
          preload="metadata"
          className="mt-5 w-full"
          aria-label={`Audio testimonial from ${t.name}`}
        />
      )}
      {t.mediaUrl && t.transcript && (
        <details className="mt-3 text-sm text-muted">
          <summary className="cursor-pointer text-primary-light">Read transcript</summary>
          <p className="mt-2 whitespace-pre-line">{t.transcript}</p>
        </details>
      )}

      <blockquote className="mt-5 flex-1 text-foreground/90">
        <p className="whitespace-pre-line">&ldquo;{t.quote}&rdquo;</p>
      </blockquote>

      <footer className="mt-6 flex items-center gap-4 border-t border-border pt-5">
        {t.avatarUrl ? (
          // Provider avatars come from several CDNs; a plain img avoids an image-domain allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.avatarUrl}
            alt=""
            width={48}
            height={48}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary-light"
            aria-hidden
          >
            {initials(t.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{t.name}</p>
          <p className="text-sm text-muted">{t.headline}</p>
        </div>
      </footer>

      {t.linkedinUrl && (
        <a
          href={t.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-4 inline-flex items-center gap-2 text-sm text-primary-light hover:underline"
        >
          <Linkedin className="h-4 w-4" aria-hidden />
          View on LinkedIn
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          <span className="sr-only">(link provided by {t.name})</span>
        </a>
      )}
    </article>
  );
}
