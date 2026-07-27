import { NextResponse } from "next/server";
import { z } from "zod";
import {
  isWhatsAppHubConfigured,
  normalizePhoneE164,
  optInWhatsApp,
  pingWhatsAppHub,
  sendWhatsAppTemplate,
} from "@/lib/whatsapp-hub";

function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  const adminSecret = process.env.ADMIN_SECRET;
  return Boolean(adminSecret && token === adminSecret);
}

const testSchema = z.object({
  phone: z.string().min(8),
  templateName: z.string().min(1).optional(),
  bodyParams: z.array(z.string()).optional(),
});

export async function GET() {
  if (!isWhatsAppHubConfigured()) {
    return NextResponse.json({ ok: false, error: "hub_not_configured" }, { status: 503 });
  }
  const health = await pingWhatsAppHub();
  return NextResponse.json({ ok: health.ok, configured: true });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isWhatsAppHubConfigured()) {
    return NextResponse.json({ error: "hub_not_configured" }, { status: 503 });
  }

  const parsed = testSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const phone = normalizePhoneE164(parsed.data.phone);
  if (!phone) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }

  await optInWhatsApp(phone);

  const templateName =
    parsed.data.templateName ?? process.env.WHATSAPP_WELCOME_TEMPLATE ?? "cohort_session_reminder";

  const result = await sendWhatsAppTemplate({
    to: phone,
    templateName,
    languageCode: "en",
    bodyParams: parsed.data.bodyParams ?? ["IntelliForge AI Bootcamp", "Test from upskill.intelliforge.tech"],
  });

  return NextResponse.json({ ok: true, phone, ...result });
}
