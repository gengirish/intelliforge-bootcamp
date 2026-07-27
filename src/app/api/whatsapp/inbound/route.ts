import { NextResponse } from "next/server";

/** Receives inbound messages and delivery statuses forwarded from the central WhatsApp hub. */
export async function POST(req: Request) {
  const tenantId = req.headers.get("X-WhatsApp-Hub-Tenant");
  const eventType = req.headers.get("X-WhatsApp-Hub-Event");

  if (tenantId !== (process.env.WHATSAPP_TENANT_ID ?? "bootcamp")) {
    return NextResponse.json({ error: "tenant_mismatch" }, { status: 403 });
  }

  const payload = await req.json().catch(() => null);
  console.info("[whatsapp/inbound]", { tenantId, eventType, payload });

  // Extend here: persist to DB, notify admin, trigger automations.
  return NextResponse.json({ ok: true });
}
