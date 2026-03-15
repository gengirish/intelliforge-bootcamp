import { NextResponse } from "next/server";
import { sendTestEmail, verifyConnection } from "@/lib/email";

export async function GET() {
  const inboxId = process.env.AGENTMAIL_INBOX || "learning@intelliforge.tech";
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || inboxId;

  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    inbox: inboxId,
    adminNotifyEmail: adminEmail,
    apiKeyPresent: !!process.env.AGENTMAIL_API_KEY,
  };

  try {
    const inboxInfo = await verifyConnection();
    results.connection = "verified";
    results.inboxDetails = {
      inbox_id: inboxInfo.inbox_id,
      display_name: inboxInfo.display_name,
    };
  } catch (err) {
    results.connection = "failed";
    results.connectionError = err instanceof Error ? err.message : String(err);
    return NextResponse.json(results, { status: 500 });
  }

  try {
    const sendResult = await sendTestEmail(adminEmail);
    results.testEmail = {
      sent: true,
      to: adminEmail,
      messageId: sendResult.message_id,
      threadId: sendResult.thread_id,
    };
  } catch (err) {
    results.testEmail = {
      sent: false,
      to: adminEmail,
      error: err instanceof Error ? err.message : String(err),
    };
    return NextResponse.json(results, { status: 500 });
  }

  return NextResponse.json(results);
}
