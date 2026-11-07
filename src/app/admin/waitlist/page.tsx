import Link from "next/link";
import { isAdminSecretConfigured, isAdminSession } from "@/lib/admin-session";
import { COHORT_2 } from "@/lib/constants";
import {
  findWaitlistEntries,
  getWaitlistStats,
  parseWaitlistFilters,
} from "@/lib/waitlist-admin";
import { adminSignOut } from "../actions";
import { AdminSignIn } from "../admin-sign-in";

export const dynamic = "force-dynamic";

const PAGE_LIMIT = 500;

const MOTIVATION_LABELS: Record<string, string> = Object.fromEntries(
  COHORT_2.motivations.map((m) => [m.value, m.label])
);

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

type SearchParams = Promise<{
  q?: string;
  motivation?: string;
  cohort?: string;
  error?: string;
}>;

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

  const filters = parseWaitlistFilters((k) => params[k as keyof typeof params]);
  const { cohort, q, motivation } = filters;

  let loadError: string | null = null;
  let entries: Awaited<ReturnType<typeof findWaitlistEntries>> = [];
  let stats: Awaited<ReturnType<typeof getWaitlistStats>> = {
    total: 0,
    last7Days: 0,
    byMotivation: {},
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

  const withPhone = entries.filter((e) => e.phone).length;
  const exportQuery = new URLSearchParams({
    cohort,
    ...(q ? { q } : {}),
    ...(motivation ? { motivation } : {}),
  }).toString();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Waitlist</h1>
          <p className="mt-1 text-muted">
            Cohort: <code>{cohort}</code>
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/waitlist/export?${exportQuery}`}
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
            <Stat label="Total signups" value={stats.total} />
            <Stat label="Last 7 days" value={stats.last7Days} />
            {COHORT_2.motivations.map((m) => (
              <Stat
                key={m.value}
                label={m.label}
                value={stats.byMotivation[m.value] ?? 0}
              />
            ))}
          </section>

          <form
            method="get"
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <input type="hidden" name="cohort" value={cohort} />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search name, email or phone"
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-foreground outline-none focus:border-primary"
            />
            <select
              name="motivation"
              defaultValue={motivation}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-foreground"
            >
              <option value="">All motivations</option>
              {COHORT_2.motivations.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-cta px-5 py-2 font-semibold text-background transition-colors hover:bg-cta-hover"
            >
              Filter
            </button>
            {(q || motivation) && (
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
            {entries.length === PAGE_LIMIT ? ` (newest ${PAGE_LIMIT}; CSV has all)` : ""} ·{" "}
            {withPhone} with phone
          </p>

          {entries.length === 0 ? (
            <p className="mt-6 rounded-lg border border-border bg-surface p-8 text-center text-muted">
              No signups{q || motivation ? " match these filters" : " yet"}.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-surface text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Joined (IST)</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Motivation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {entries.map((e) => (
                    <tr key={e.id} className="hover:bg-surface/60">
                      <td className="whitespace-nowrap px-4 py-3 text-muted">
                        {dateFmt.format(e.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium">{e.name}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${e.email}`} className="hover:underline">
                          {e.email}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {e.phone ? (
                          <a href={`tel:${e.phone}`} className="hover:underline">
                            {e.phone}
                          </a>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {MOTIVATION_LABELS[e.motivation] ?? e.motivation}
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}
