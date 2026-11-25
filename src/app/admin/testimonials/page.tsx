import Link from "next/link";
import { isAdminSecretConfigured, isAdminSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import {
  PAYMENT_METHODS,
  PAYMENT_REFERENCE_PATTERN,
  PROVIDER_LABEL,
  normalizeProvider,
} from "@/lib/testimonials";
import { listLearnerPrograms } from "@/lib/testimonials-server";
import { cn } from "@/lib/utils";
import { AdminSignIn } from "../admin-sign-in";
import { adminSignOut } from "../actions";
import {
  clearLearnerPayment,
  deleteTestimonial,
  saveTestimonialTranscript,
  setTestimonialStatus,
  toggleTestimonialFeatured,
  verifyLearnerPayment,
} from "./actions";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "PENDING", label: "To review" },
  { key: "APPROVED", label: "Live" },
  { key: "REJECTED", label: "Rejected" },
] as const;
type Tab = (typeof TABS)[number]["key"];

const dateFmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" });
const field = "rounded-lg border border-border bg-surface-light px-3 py-1.5 text-sm text-foreground";

const btn = "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors";

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  if (!(await isAdminSession())) {
    return (
      <AdminSignIn next="/admin/testimonials" error={params.error === "1"} configured={isAdminSecretConfigured()} />
    );
  }

  const tab: Tab = TABS.some((t) => t.key === params.status) ? (params.status as Tab) : "PENDING";

  let loadError: string | null = null;
  let rows: Awaited<ReturnType<typeof prisma.testimonial.findMany>> = [];
  let counts: Record<string, number> = {};
  let programs: string[] = [];
  try {
    const [list, grouped, programList] = await Promise.all([
      prisma.testimonial.findMany({
        where: { status: tab },
        orderBy: tab === "APPROVED" ? [{ featured: "desc" }, { reviewedAt: "desc" }] : [{ updatedAt: "desc" }],
      }),
      prisma.testimonial.groupBy({ by: ["status"], _count: true }),
      listLearnerPrograms(),
    ]);
    rows = list;
    programs = programList;
    counts = Object.fromEntries(grouped.map((g) => [g.status, g._count]));
  } catch (err) {
    console.error("[Admin testimonials] Load failed:", err);
    loadError = "Couldn't load testimonials. Check DATABASE_URL and that the migration has been deployed.";
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/testimonials" className="text-primary-light hover:underline">Public page</Link>
          <Link href="/admin/waitlist" className="text-primary-light hover:underline">Waitlist</Link>
          <form action={adminSignOut}><button className="text-muted hover:text-foreground">Sign out</button></form>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted">
        Learners submit at <code>/testimonials/submit</code>. Approving publishes to the homepage and{" "}
        <code>/testimonials</code>; featured ones are shown first.
      </p>

      <nav className="mt-6 flex gap-2" aria-label="Status">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/testimonials?status=${t.key}`}
            aria-current={tab === t.key ? "page" : undefined}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm",
              tab === t.key ? "border-primary-light bg-primary/15 text-foreground" : "border-border text-muted hover:text-foreground"
            )}
          >
            {t.label} ({counts[t.key] ?? 0})
          </Link>
        ))}
      </nav>

      {loadError && <p role="alert" className="mt-6 text-red-400">{loadError}</p>}
      {!loadError && rows.length === 0 && <p className="mt-8 text-muted">Nothing here.</p>}

      <ul className="mt-6 space-y-6">
        {rows.map((t) => {
          const provider = normalizeProvider(t.provider);
          return (
            <li key={t.id} className="rounded-xl border border-border bg-surface p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {t.avatarUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.avatarUrl} alt="" width={40} height={40} referrerPolicy="no-referrer" className="h-10 w-10 rounded-full" />
                  )}
                  <div>
                    <p className="font-semibold">{t.name} {t.featured && <span className="ml-1 text-xs text-amber-400">★ Featured</span>}</p>
                    <p className="text-sm text-muted">{t.headline}</p>
                  </div>
                </div>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-muted">
                  <dt>Signed in with</dt><dd className="text-foreground">{provider ? PROVIDER_LABEL[provider] : t.provider}</dd>
                  <dt>Email</dt><dd className="text-foreground">{t.email}</dd>
                  <dt>Paid learner</dt>
                  <dd className={t.verifiedLearner ? "text-green-400" : "text-amber-400"}>
                    {!t.verifiedLearner && "No paid enrolment matched"}
                    {t.verifiedLearner && t.learnerVerifiedVia === "PAYMENT_RECORD" && (
                      <>
                        {t.learnerSprints} · payment confirmed by admin
                        {t.learnerVerifiedAt && ` ${dateFmt.format(t.learnerVerifiedAt)}`}
                        <span className="block text-muted">{t.learnerEvidence}</span>
                      </>
                    )}
                    {t.verifiedLearner && t.learnerVerifiedVia !== "PAYMENT_RECORD" && (
                      <>{t.learnerSprints} · matched enrolment</>
                    )}
                  </dd>
                  <dt>Consent</dt><dd>{t.consentVersion} · {dateFmt.format(t.consentedAt)}</dd>
                  <dt>Updated</dt><dd>{dateFmt.format(t.updatedAt)}</dd>
                </dl>
              </div>

              <blockquote className="mt-4 whitespace-pre-line border-l-2 border-primary-light/40 pl-4 text-foreground/90">
                {t.quote}
              </blockquote>
              {t.linkedinUrl && (
                <p className="mt-2 text-sm">
                  <a href={t.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">
                    {t.linkedinUrl}
                  </a>{" "}
                  <span className="text-muted">(self-reported; check it matches the name)</span>
                </p>
              )}

              {t.mediaUrl && (
                <div className="mt-4 space-y-3">
                  {t.mediaKind === "VIDEO" ? (
                    <video src={t.mediaUrl} controls preload="metadata" className="max-h-80 w-full rounded-lg bg-black" />
                  ) : (
                    <audio src={t.mediaUrl} controls preload="metadata" className="w-full" />
                  )}
                  <form action={saveTestimonialTranscript} className="space-y-2">
                    <input type="hidden" name="id" value={t.id} />
                    <label htmlFor={`tr-${t.id}`} className="block text-sm text-muted">Transcript (shown under the recording)</label>
                    <textarea
                      id={`tr-${t.id}`} name="transcript" defaultValue={t.transcript ?? ""} rows={3}
                      className="w-full rounded-lg border border-border bg-surface-light px-3 py-2 text-sm text-foreground"
                    />
                    <button className={cn(btn, "border-border hover:bg-surface-light")}>Save transcript</button>
                  </form>
                </div>
              )}

              {!t.verifiedLearner && (
                <details className="mt-4 rounded-lg border border-border p-4">
                  <summary className="cursor-pointer text-sm font-medium text-foreground">
                    Paid by UPI or bank transfer? Confirm the payment
                  </summary>
                  <p className="mt-2 text-sm text-muted">
                    Check the payment on your bank or UPI statement first. The reference stays private as an
                    audit note; the public badge shows only the program.
                  </p>
                  <form action={verifyLearnerPayment} className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input type="hidden" name="id" value={t.id} />
                    <label className="grid gap-1 text-sm text-muted">
                      Method
                      <select name="method" required defaultValue="UPI" className={field}>
                        {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                      </select>
                    </label>
                    <label className="grid gap-1 text-sm text-muted">
                      UTR / bank reference
                      <input
                        name="reference" required pattern={PAYMENT_REFERENCE_PATTERN} inputMode="text"
                        autoComplete="off" placeholder="12-digit UTR" className={field}
                        title="6–35 letters and digits, no spaces"
                      />
                    </label>
                    <label className="grid gap-1 text-sm text-muted">
                      Received on
                      <input name="paidOn" type="date" required max={dayFmt.format(new Date())} className={field} />
                    </label>
                    <label className="grid gap-1 text-sm text-muted">
                      Paid for
                      <select name="program" required defaultValue="" className={field}>
                        <option value="" disabled>Choose…</option>
                        {programs.map((p) => <option key={p}>{p}</option>)}
                      </select>
                    </label>
                    <div className="sm:col-span-2">
                      <button className={cn(btn, "border-green-500/40 bg-green-500/10 text-green-300 hover:bg-green-500/20")}>
                        Mark as verified learner
                      </button>
                    </div>
                  </form>
                </details>
              )}
              {t.learnerVerifiedVia === "PAYMENT_RECORD" && (
                <form action={clearLearnerPayment} className="mt-3">
                  <input type="hidden" name="id" value={t.id} />
                  <button className="text-xs text-muted underline hover:text-foreground">
                    Remove payment confirmation
                  </button>
                </form>
              )}

              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                {t.status !== "APPROVED" && (
                  <form action={setTestimonialStatus}>
                    <input type="hidden" name="id" value={t.id} /><input type="hidden" name="status" value="APPROVED" />
                    <button className={cn(btn, "border-green-500/40 bg-green-500/10 text-green-300 hover:bg-green-500/20")}>Approve &amp; publish</button>
                  </form>
                )}
                {t.status === "APPROVED" && (
                  <form action={toggleTestimonialFeatured}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className={cn(btn, "border-amber-500/40 text-amber-300 hover:bg-amber-500/10")}>{t.featured ? "Unfeature" : "Feature"}</button>
                  </form>
                )}
                {t.status !== "REJECTED" && (
                  <form action={setTestimonialStatus}>
                    <input type="hidden" name="id" value={t.id} /><input type="hidden" name="status" value="REJECTED" />
                    <button className={cn(btn, "border-border text-muted hover:text-foreground")}>{t.status === "APPROVED" ? "Unpublish" : "Reject"}</button>
                  </form>
                )}
                <form action={deleteTestimonial} className="ml-auto">
                  <input type="hidden" name="id" value={t.id} />
                  <button className={cn(btn, "border-red-500/40 text-red-300 hover:bg-red-500/10")}>Delete permanently</button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
