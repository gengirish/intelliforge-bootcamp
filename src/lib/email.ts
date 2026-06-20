import { SITE_CONFIG, WHATSAPP_DEMO_URL, ZOOM_MEETING, ZOOM_URL } from "@/lib/constants";

const API_BASE = "https://api.agentmail.to/v0";
const API_KEY = (process.env.AGENTMAIL_API_KEY || "").trim();
const INBOX_ID = (process.env.AGENTMAIL_INBOX || "learning@intelliforge.tech").trim();
const ADMIN_EMAIL = (process.env.ADMIN_NOTIFY_EMAIL || INBOX_ID).trim();

async function agentMailSend(params: {
  to: string | string[];
  subject: string;
  html: string;
  reply_to?: string;
}) {
  const recipients = (Array.isArray(params.to) ? params.to : [params.to]).map(
    (e) => e.trim()
  );

  const res = await fetch(`${API_BASE}/inboxes/${INBOX_ID}/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: recipients,
      subject: params.subject,
      html: params.html,
      ...(params.reply_to ? { reply_to: params.reply_to.trim() } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(`AgentMail API error (${res.status}): ${JSON.stringify(err)}`);
  }

  return res.json();
}

interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function sendEnquiryNotification(data: EnquiryPayload) {
  const adminHtml = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1C; color: #E2E8F0; padding: 32px; border-radius: 12px;">
      <h2 style="color: #7C3AED; margin-top: 0;">New Bootcamp Enquiry</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #94A3B8;">Name</td><td style="padding: 8px 0;">${data.name}</td></tr>
        <tr><td style="padding: 8px 0; color: #94A3B8;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #06B6D4;">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding: 8px 0; color: #94A3B8;">Phone</td><td style="padding: 8px 0;">${data.phone}</td></tr>` : ""}
        <tr><td style="padding: 8px 0; color: #94A3B8; vertical-align: top;">Message</td><td style="padding: 8px 0;">${data.message}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #1E293B; margin: 24px 0;" />
      <p style="color: #94A3B8; font-size: 12px;">Sent from IntelliForge AI Bootcamp — upskill.intelliforge.tech</p>
    </div>
  `;

  const confirmHtml = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1C; color: #E2E8F0; padding: 32px; border-radius: 12px;">
      <h2 style="color: #7C3AED; margin-top: 0;">Thanks for reaching out, ${data.name}!</h2>
      <p>We received your enquiry about the <strong>IntelliForge AI Bootcamp</strong>. Our team will get back to you within 24 hours.</p>
      <p>In the meantime, you can:</p>
      <ul style="padding-left: 20px;">
        <li style="margin-bottom: 8px;"><a href="${ZOOM_URL}" style="color: #06B6D4;">Join our live session: ${ZOOM_MEETING.topic} (${ZOOM_MEETING.time})</a></li>
        <li style="margin-bottom: 8px;"><a href="${SITE_CONFIG.lms}" style="color: #06B6D4;">Try a free class on our LMS</a></li>
        <li style="margin-bottom: 8px;"><a href="${WHATSAPP_DEMO_URL}" style="color: #06B6D4;">Chat with us on WhatsApp</a></li>
      </ul>
      <hr style="border: none; border-top: 1px solid #1E293B; margin: 24px 0;" />
      <p style="color: #94A3B8; font-size: 12px;">IntelliForge AI · Hyderabad, India · <a href="${SITE_CONFIG.url}" style="color: #94A3B8;">upskill.intelliforge.tech</a></p>
    </div>
  `;

  const adminResult = await agentMailSend({
    to: ADMIN_EMAIL,
    subject: `New Bootcamp Enquiry from ${data.name}`,
    html: adminHtml,
  });

  const confirmResult = await agentMailSend({
    to: data.email,
    subject: "We got your enquiry — IntelliForge AI Bootcamp",
    html: confirmHtml,
    reply_to: INBOX_ID,
  });

  return [adminResult, confirmResult];
}

export async function sendTestEmail(to: string) {
  return agentMailSend({
    to,
    subject: "Email Integration Test — IntelliForge Bootcamp",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1C; color: #E2E8F0; padding: 32px; border-radius: 12px;">
        <h2 style="color: #7C3AED; margin-top: 0;">Email Integration Works!</h2>
        <p>This is a test email from the IntelliForge AI Bootcamp platform.</p>
        <p>Sent via AgentMail REST API from <code style="background: #1E293B; padding: 2px 6px; border-radius: 4px;">${INBOX_ID}</code></p>
        <p style="color: #06B6D4;">Timestamp: ${new Date().toISOString()}</p>
        <hr style="border: none; border-top: 1px solid #1E293B; margin: 24px 0;" />
        <p style="color: #94A3B8; font-size: 12px;">IntelliForge AI · upskill.intelliforge.tech</p>
      </div>
    `,
  });
}

export async function verifyConnection() {
  const res = await fetch(`${API_BASE}/inboxes/${INBOX_ID}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  if (!res.ok) {
    throw new Error(`AgentMail API unreachable (${res.status})`);
  }
  return res.json();
}
