import { NextResponse } from "next/server";
import {
  handleRazorpayWebhookEvent,
  verifyRazorpaySignature,
} from "@/lib/razorpay-webhook";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyRazorpaySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  await handleRazorpayWebhookEvent(event);

  return NextResponse.json({ ok: true });
}
