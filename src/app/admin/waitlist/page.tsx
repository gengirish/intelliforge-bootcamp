import Link from "next/link";
import { isAdminSecretConfigured, isAdminSession } from "@/lib/admin-session";
import { COHORT_2 } from "@/lib/constants";
import {
  findWaitlistEntries,
  getWaitlistStats,
  leadSource,
  parseWaitlistFilters,
  type WaitlistFilters,
} from "@/lib/waitlist-admin";
import { adminSignOut } from "../actions";
import { AdminSignIn } from "../admin-sign-in";

export const dynamic = "force-dynamic";

const PAGE_LIMIT = 500;

const labels = (opts: readonly { value: string; label: string }[]) =>
  Object.fromEntries(opts.map((o) => [o.value, o.label])) as Record<string, string>;
const MOTIVATION = labels(COHORT_2.motivations);
const ROLE = labels(COHORT_2.roles);
const EXPERIENCE = labels(COHORT_2.experience);
const PAYER = labels(COHORT_2.payers);

const TIERS = [
  { key: "A", label: "Tier A · follow up personally", tone: "border-green-500/40 bg-green-500/10 text-green-400" },
  { key: "B", label: "Tier B · nurture", tone: "border-amber-500/40 bg-amber-500/10 text-amber-400" },
  { key: "C", label: "Tier C · setup course", tone: "border-border bg-surface-light text-muted" },
  { key: "unscored", label: "Unscored (joined before questions)", tone: "border-border bg-surface text-muted" },
] as const;

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

type SearchParams = Promise<Record<string, string | undefined>>;

function queryFor(f: WaitlistFilters, patch: Partial<WaitlistFilters> = {}) {
  const next = { ...f, ...patch };
  const entries = Object.entries({
    cohort: next.cohort,
    q: next.q,
    motivation: next.motivation,
    tier: next.tier,
    source: next.source,
    sort: next.sort === "score" ? "score" : "",
  }).filter(([, v]) => v);
  return new URLSearchParams(entries as [string, string][]).toString();
}

export default async function AdminWaitlistPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  if (!(await isAdminSession())) {
    return (
      <AdminSignIn
        next="/admin/waitlist"
        error={params.error === "1"}
        configured={isAdminSecretConfigured()}
      />
    );
  }

  const filters = parseWaitlistFilters((k) => params[k]);
  const { cohort, q, motivation, tier, source, sort } = filters;
  const filtered = Boolean(q || motivation || tier || source);

  let loadError: string | null = null;
  let entries: Awaited<ReturnType<typeof findWaitlistEntries>> = [];
  let stats: Awaited<ReturnType<typeof getWaitlistStats>> = {
    total: 0,
    last7Days: 0,
    byTier: {},
    bySource: [],
  };

  try {
    [entries, stats] = await Promise.all([
      findWaitlistEntries(filters, PAGE_LIMIT),
      getWaitlistStats(cohort),
    ]);
  } catch (err) {
    console.error("[Admin] Failed to load waitlist:", err);
    loadError =
      "Couldn't read the waitlist. Check DATABASE_URL and that migrations have been deployed (npm run db:deploy).";
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Waitlist leads</h1>
          <p className="mt-1 text-muted">
            Cohort: <code>{cohort}</code> · scored against the Cohort 2 ICP
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/waitlist/export?${queryFor(filters)}`}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40"
          >
            Download CSV
          </a>
          <form action={adminSignOut}>
            <button
              type="submit"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {loadError ? (
        <p role="alert" className="mt-8 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm">
          {loadError}
        </p>
      ) : (
        <>
          <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Stat label="Total leads" value={stats.total} />
            <Stat label="Last 7 days" value={stats.last7Days} />
            {TIERS.map((t) => (
              <Link
                key={t.key}
                href={`/admin/waitlist?${queryFor(filters, { tier: tier === t.key ? "" : t.key })}`}
                className={`rounded-lg border p-4 transition-colors hover:border-primary/40 ${t.tone} ${tier === t.key ? "ring-2 ring-primary" : ""}`}
              >
                <div className="text-2xl font-bold tabular-nums">
                  {stats.byTier[t.key] ?? 0}
                </div>
                <div className="mt-1 text-xs">{t.label}</div>
              </Link>
            ))}
          </section>

          {stats.bySource.length > 0 && (
            <section className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted">Sources:</span>
              {stats.bySource.map(([s, n]) => (
                <Link
                  key={s}
                  href={`/admin/waitlist?${queryFor(filters, { source: source === s ? "" : s })}`}
                  className={`rounded-full border px-3 py-1 transition-colors hover:border-primary/40 ${source === s ? "border-primary bg-primary/10" : "border-border bg-surface"}`}
                >
                  {s} <span className="tabular-nums text-muted">{n}</span>
                </Link>
              ))}
            </section>
          )}

          <form method="get" className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
            <input type="hidden" name="cohort" value={cohort} />
            {source && <input type="hidden" name="source" value={source} />}
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search name, email or phone"
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-foreground outline-none focus:border-primary"
            />
            <select name="tier" defaultValue={tier} className={selectClass}>
              <option value="">All tiers</option>
              {TIERS.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.key === "unscored" ? "Unscored" : `Tier ${t.key}`}
                </option>
              ))}
            </select>
            <select name="motivation" defaultValue={motivation} className={selectClass}>
              <option value="">All motivations</option>
              {COHORT_2.motivations.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select name="sort" defaultValue={sort} className={selectClass}>
              <option value="newest">Newest first</option>
              <option value="score">Best fit first</option>
            </select>
            <button
              type="submit"
              className="rounded-lg bg-cta px-5 py-2 font-semibold text-background transition-colors hover:bg-cta-hover"
            >
              Apply
            </button>
            {filtered && (
              <Link
                href={`/admin/waitlist?cohort=${encodeURIComponent(cohort)}`}
                className="text-sm text-muted hover:text-foreground"
              >
                Clear
              </Link>
            )}
          </form>

          <p className="mt-4 text-sm text-muted">
            Showing {entries.length}
            {entries.length === PAGE_LIMIT ? ` (first ${PAGE_LIMIT}; CSV has all)` : ""}
            {source ? ` from ${source}` : ""}
          </p>

          {entries.length === 0 ? (
            <p className="mt-6 rounded-lg border border-border bg-surface p-8 text-center text-muted">
              No leads{filtered ? " match these filters" : " yet"}.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-surface text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Fit</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Experience</th>
                    <th className="px-4 py-3 font-medium">Pays</th>
                    <th className="px-4 py-3 font-medium">Wants</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Joined (IST)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {entries.map((e) => (
                    <tr key={e.id} className="align-top hover:bg-surface/60">
                      <td className="whitespace-nowrap px-4 py-3">
                        <TierBadge tier={e.tier} score={e.score} />
                      </td>
                      <td className="px-4 py-3 font-medium">{e.name}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${e.email}`} className="block hover:underline">
                          {e.email}
                        </a>
                        {e.phone && (
                          <a href={`tel:${e.phone}`} className="block text-muted hover:underline">
                            {e.phone}
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3">{e.role ? ROLE[e.role] ?? e.role : <Dash />}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {e.experience ? EXPERIENCE[e.experience] ?? e.experience : <Dash />}
                      </td>
                      <td className="px-4 py-3">{e.payer ? PAYER[e.payer] ?? e.payer : <Dash />}</td>
                      <td className="px-4 py-3">{MOTIVATION[e.motivation] ?? e.motivation}</td>
                      <td className="px-4 py-3">
                        {leadSource(e)}
                        {e.utmCampaign && (
                          <span className="block text-xs text-muted">{e.utmCampaign}</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted">
                        {dateFmt.format(e.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}

const selectClass =
  "rounded-lg border border-border bg-surface px-4 py-2 text-foreground";

function Dash() {
  return <span className="text-muted">—</span>;
}

function TierBadge({ tier, score }: { tier: string | null; score: number | null }) {
  if (!tier) return <span className="text-xs text-muted">Unscored</span>;
  const tone = TIERS.find((t) => t.key === tier)?.tone ?? "";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tone}`}>
      {tier}
      <span className="font-normal tabular-nums">{score}</span>
    </span>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}
