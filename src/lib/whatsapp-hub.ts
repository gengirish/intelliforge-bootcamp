/**
 * Thin HTTP client for the central WhatsApp hub (whatsapp.intelliforge.tech).
 * Standalone copy — bootcamp is outside the intelliforge-otp monorepo.
 */

export class WhatsAppHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: Record<string, unknown>
  ) {
    super(message);
    this.name = "WhatsAppHubError";
  }
}

function getHubConfig() {
  const baseUrl = process.env.WHATSAPP_HUB_URL?.replace(/\/$/, "");
  const apiKey = process.env.WHATSAPP_HUB_API_KEY;
  const tenantId = process.env.WHATSAPP_TENANT_ID ?? "bootcamp";
  if (!baseUrl || !apiKey) return null;
  return { baseUrl, apiKey, tenantId };
}

async function hubRequest<T>(path: string, init: RequestInit): Promise<T> {
  const cfg = getHubConfig();
  if (!cfg) {
    throw new Error("WhatsApp hub is not configured (WHATSAPP_HUB_URL / WHATSAPP_HUB_API_KEY)");
  }

  const res = await fetch(`${cfg.baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      "Content-Type": "application/json",
      "X-Tenant-Id": cfg.tenantId,
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  const body = (await res.json().catch(() => ({}))) as T & Record<string, unknown>;
  if (!res.ok) {
    throw new WhatsAppHubError(
      (typeof body.error === "string" ? body.error : undefined) ??
        `WhatsApp hub error (${res.status})`,
      res.status,
      body as Record<string, unknown>
    );
  }
  return body;
}

export function isWhatsAppHubConfigured(): boolean {
  return getHubConfig() !== null;
}

/** Normalize Indian 10-digit or +91 numbers to E.164. */
export function normalizePhoneE164(phone: string | null | undefined): string | null {
  if (!phone?.trim()) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (phone.startsWith("+") && /^\+[1-9]\d{7,14}$/.test(phone)) return phone;
  return null;
}

export async function optInWhatsApp(phoneE164: string): Promise<void> {
  await hubRequest("/v1/contacts/opt-in", {
    method: "POST",
    body: JSON.stringify({ phone: phoneE164 }),
  });
}

export async function sendWhatsAppTemplate(input: {
  to: string;
  templateName: string;
  languageCode?: string;
  bodyParams?: string[];
}): Promise<{ waMessageId?: string }> {
  return hubRequest("/v1/messages/template", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function pingWhatsAppHub(): Promise<{ ok: boolean }> {
  const cfg = getHubConfig();
  if (!cfg) return { ok: false };
  const res = await fetch(`${cfg.baseUrl}/health`);
  const body = (await res.json().catch(() => ({}))) as { ok?: boolean };
  return { ok: res.ok && body.ok === true };
}
