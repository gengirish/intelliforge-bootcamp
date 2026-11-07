/**
 * First-touch lead attribution, kept in the visitor's own browser until they
 * join the waitlist. A visit with UTM tags replaces what was stored, so the
 * campaign that brought someone back gets the credit; a plain visit only
 * records itself when nothing is stored yet. Storage can be unavailable
 * (private windows, blocked site data), so every access is guarded and the
 * form falls back to the current page.
 */

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  landingPath?: string;
};

const KEY = "if_lead_attribution";
const MAX = 200;

function clip(v: string | null | undefined): string | undefined {
  const t = v?.trim();
  return t ? t.slice(0, MAX) : undefined;
}

/** External referrers only: an internal page linking to the form isn't a source. */
function externalReferrer(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const ref = new URL(document.referrer);
    return ref.host === window.location.host ? undefined : clip(ref.host);
  } catch {
    return undefined;
  }
}

export function attributionFromPage(): Attribution {
  const p = new URLSearchParams(window.location.search);
  return {
    utmSource: clip(p.get("utm_source")),
    utmMedium: clip(p.get("utm_medium")),
    utmCampaign: clip(p.get("utm_campaign")),
    referrer: externalReferrer(),
    landingPath: clip(window.location.pathname),
  };
}

export function readAttribution(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

export function recordAttribution(): void {
  const here = attributionFromPage();
  const stored = readAttribution();
  if (stored && !here.utmSource) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(here));
  } catch {
    // Storage blocked: the form falls back to the current page.
  }
}
