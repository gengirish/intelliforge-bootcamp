import { isAdminSession } from "@/lib/admin-session";
import {
  findWaitlistEntries,
  leadSource,
  parseWaitlistFilters,
} from "@/lib/waitlist-admin";

export const dynamic = "force-dynamic";

/** Quote a CSV cell, and neutralise leading =+-@ so spreadsheets don't run it as a formula. */
function cell(value: string | null | undefined): string {
  let v = value ?? "";
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return `"${v.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  if (!(await isAdminSession())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filters = parseWaitlistFilters((k) => searchParams.get(k));
  const entries = await findWaitlistEntries(filters);

  const header = [
    "created_at", "tier", "score", "name", "email", "phone", "role", "experience",
    "payer", "motivation", "source", "utm_source", "utm_medium", "utm_campaign",
    "referrer", "landing_path", "consented_at", "cohort",
  ];
  const rows = entries.map((e) =>
    [
      e.createdAt.toISOString(),
      e.tier,
      e.score?.toString(),
      e.name,
      e.email,
      e.phone,
      e.role,
      e.experience,
      e.payer,
      e.motivation,
      leadSource(e),
      e.utmSource,
      e.utmMedium,
      e.utmCampaign,
      e.referrer,
      e.landingPath,
      e.consentedAt.toISOString(),
      e.cohort,
    ]
      .map(cell)
      .join(",")
  );

  const body = "﻿" + [header.join(","), ...rows].join("\r\n") + "\r\n";
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waitlist-${filters.cohort}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
