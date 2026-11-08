"use client";

import { upload } from "@vercel/blob/client";
import { CheckCircle2 } from "lucide-react";
import { startTransition, useActionState, useState } from "react";
import { submitTestimonial, type SubmitState } from "@/app/testimonials/submit/actions";
import {
  CONSENT_TEXT,
  PROVIDER_LABEL,
  TESTIMONIAL_LIMITS,
  type MediaKind,
  type TestimonialProvider,
} from "@/lib/testimonials";
import { cn } from "@/lib/utils";
import { MediaField, type MediaValue } from "./MediaField";
import { TestimonialCard } from "./TestimonialCard";

export interface TestimonialFormProps {
  accounts: { provider: TestimonialProvider; name: string; avatarUrl: string | null }[];
  learnerPrograms: string[];
  mediaEnabled: boolean;
  mediaPrefix: string;
  initial: {
    provider: TestimonialProvider | null;
    headline: string;
    linkedinUrl: string;
    quote: string;
    transcript: string;
    mediaUrl: string | null;
    mediaKind: MediaKind;
  } | null;
}

const EXT: Record<string, string> = {
  "audio/webm": "webm", "audio/ogg": "ogg", "audio/mp4": "m4a", "audio/x-m4a": "m4a",
  "audio/mpeg": "mp3", "audio/wav": "wav", "video/webm": "webm", "video/mp4": "mp4",
  "video/quicktime": "mov",
};

const input =
  "w-full rounded-lg border border-border bg-surface-light px-4 py-3 text-base text-foreground placeholder:text-muted/70 outline-none focus:border-primary-light focus-visible:ring-2 focus-visible:ring-primary-light/40";

function Field({
  id, label, hint, error, children,
}: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
      {hint && <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>}
      {children}
      {error && <p id={`${id}-error`} className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export function TestimonialForm({ accounts, learnerPrograms, mediaEnabled, mediaPrefix, initial }: TestimonialFormProps) {
  const [state, formAction, pending] = useActionState<SubmitState, FormData>(submitTestimonial, { status: "idle" });
  const [provider, setProvider] = useState<TestimonialProvider>(
    initial?.provider && accounts.some((a) => a.provider === initial.provider) ? initial.provider : accounts[0].provider
  );
  const [headline, setHeadline] = useState(initial?.headline ?? "");
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [media, setMedia] = useState<MediaValue>(
    initial?.mediaUrl && initial.mediaKind !== "NONE"
      ? { type: "existing", url: initial.mediaUrl, kind: initial.mediaKind }
      : { type: "none" }
  );
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const account = accounts.find((a) => a.provider === provider) ?? accounts[0];
  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};
  const busy = pending || uploadPct !== null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploadError(null);
    const data = new FormData(e.currentTarget);
    data.set("provider", provider);

    if (media.type === "existing") data.set("mediaUrl", media.url);
    if (media.type === "new") {
      try {
        setUploadPct(0);
        const ext = EXT[media.contentType] ?? "bin";
        const blob = await upload(`${mediaPrefix}${media.kind.toLowerCase()}.${ext}`, media.blob, {
          access: "public",
          handleUploadUrl: "/api/testimonials/upload",
          contentType: media.contentType,
          multipart: media.blob.size > 8 * 1024 * 1024,
          onUploadProgress: ({ percentage }) => setUploadPct(Math.round(percentage)),
        });
        data.set("mediaUrl", blob.url);
        // Once uploaded, a resubmit after a validation error reuses the stored file.
        setMedia({ type: "existing", url: blob.url, kind: media.kind });
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed. Try again.");
        setUploadPct(null);
        return;
      }
      setUploadPct(null);
    }
    startTransition(() => formAction(data));
  }

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-green-400" aria-hidden />
        <h2 className="mt-4 text-xl font-semibold text-foreground">Thank you!</h2>
        <p className="mt-2 text-muted">
          Girish reviews every testimonial before it goes live. We&apos;ll publish yours with the
          &ldquo;{PROVIDER_LABEL[account.provider]} verified&rdquo; badge
          {learnerPrograms.length > 0 ? " and your verified learner badge" : ""}. You can come back to
          this page any time to edit it.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <form onSubmit={onSubmit} className="space-y-7" noValidate>
        {accounts.length > 1 && (
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">Show my name and photo from</legend>
            <div className="flex gap-3">
              {accounts.map((a) => (
                <label
                  key={a.provider}
                  className={cn(
                    "cursor-pointer rounded-lg border px-4 py-2 text-sm",
                    provider === a.provider ? "border-primary-light bg-primary/15 text-foreground" : "border-border text-muted"
                  )}
                >
                  <input
                    type="radio" name="providerChoice" value={a.provider} className="sr-only"
                    checked={provider === a.provider} onChange={() => setProvider(a.provider)}
                  />
                  {PROVIDER_LABEL[a.provider]}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <Field id="headline" label="Your role and company" hint="For example: Senior Data Engineer, Infosys" error={errors.headline}>
          <input
            id="headline" name="headline" value={headline} onChange={(e) => setHeadline(e.target.value)}
            maxLength={TESTIMONIAL_LIMITS.headlineMax} required className={input}
            aria-invalid={Boolean(errors.headline)} aria-describedby={errors.headline ? "headline-error" : "headline-hint"}
          />
        </Field>

        <Field
          id="quote" label="Your testimonial"
          hint="What did you build or change at work? Specifics help other professionals decide."
          error={errors.quote}
        >
          <textarea
            id="quote" name="quote" value={quote} onChange={(e) => setQuote(e.target.value)} rows={6}
            maxLength={TESTIMONIAL_LIMITS.quoteMax} required className={input}
            aria-invalid={Boolean(errors.quote)} aria-describedby={errors.quote ? "quote-error" : "quote-hint"}
          />
          <p className="text-right text-xs text-muted" aria-live="polite">
            {quote.length} / {TESTIMONIAL_LIMITS.quoteMax}
          </p>
        </Field>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Add a video or audio message (optional)</p>
          <MediaField value={media} onChange={setMedia} enabled={mediaEnabled} />
        </div>

        {media.type !== "none" && (
          <Field
            id="transcript" label="Transcript (optional)"
            hint="Shown under your recording for people who can't play it. Girish can add one if you skip it."
            error={errors.transcript}
          >
            <textarea
              id="transcript" name="transcript" defaultValue={initial?.transcript} rows={4}
              maxLength={TESTIMONIAL_LIMITS.transcriptMax} className={input}
            />
          </Field>
        )}

        <Field
          id="linkedinUrl" label="LinkedIn profile URL (optional)"
          hint="Adds a 'View on LinkedIn' link. LinkedIn doesn't share this with us at sign-in, so it's shown as provided by you."
          error={errors.linkedinUrl}
        >
          <input
            id="linkedinUrl" name="linkedinUrl" defaultValue={initial?.linkedinUrl} inputMode="url"
            placeholder="linkedin.com/in/your-name" className={input}
            aria-invalid={Boolean(errors.linkedinUrl)}
            aria-describedby={errors.linkedinUrl ? "linkedinUrl-error" : "linkedinUrl-hint"}
          />
        </Field>

        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm text-foreground/90">
            <input
              type="checkbox" name="consent" required
              className="mt-1 h-4 w-4 shrink-0 accent-[#7C3AED]" aria-invalid={Boolean(errors.consent)}
            />
            <span>{CONSENT_TEXT}</span>
          </label>
          {errors.consent && <p className="text-sm text-red-400">{errors.consent}</p>}
        </div>

        {(state.status === "error" || uploadError) && (
          <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {uploadError ?? (state.status === "error" ? state.message : "")}
          </p>
        )}

        <button
          type="submit" disabled={busy}
          className="w-full rounded-lg bg-primary px-6 py-3.5 font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
        >
          {uploadPct !== null ? `Uploading recording… ${uploadPct}%` : pending ? "Submitting…" : initial ? "Update testimonial" : "Submit testimonial"}
        </button>
      </form>

      <aside className="space-y-3 lg:sticky lg:top-8 lg:self-start" aria-label="Preview">
        <p className="text-sm font-medium text-muted">Preview</p>
        <TestimonialCard
          testimonial={{
            id: "preview",
            provider: account.provider,
            name: account.name,
            avatarUrl: account.avatarUrl,
            headline: headline || "Your role and company",
            linkedinUrl: null,
            quote: quote || "Your testimonial will appear here.",
            mediaKind: "NONE",
            mediaUrl: null,
            mediaContentType: null,
            transcript: null,
            verifiedLearner: learnerPrograms.length > 0,
            learnerSprints: learnerPrograms.join(", ") || null,
            featured: false,
          }}
        />
      </aside>
    </div>
  );
}
