import {
  SITE_CONFIG,
  SPRINT_CONFIG,
  SPRINT_COHORT_WHATSAPP,
  WHATSAPP_DEMO_URL,
  WHATSAPP_GROUP,
  WHATSAPP_GROUP_URL,
  ZOOM_MEETING,
  ZOOM_URL,
} from "@/lib/constants";

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

export async function sendSprintEnrollmentConfirmation(data: {
  name: string;
  email: string;
  paymentId: string;
}) {
  const displayName = data.name.trim() || "there";

  return agentMailSend({
    to: data.email,
    subject: `You're in — ${SPRINT_COHORT_WHATSAPP.name} · IntelliForge AI Sprint`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1C; color: #E2E8F0; padding: 32px; border-radius: 12px;">
        <h2 style="color: #7C3AED; margin-top: 0;">You're in, Cohort 1!</h2>
        <p>Hi ${displayName},</p>
        <p>Your payment for the <strong>2-Week AI Sprint</strong> is confirmed. Your seat is reserved.</p>
        <p><strong>Step 1 — Join the cohort WhatsApp group now:</strong></p>
        <p style="margin: 24px 0;">
          <a href="${SPRINT_COHORT_WHATSAPP.inviteUrl}" style="display: inline-block; background: #F59E0B; color: #0A0F1C; padding: 14px 24px; border-radius: 8px; font-weight: 600; text-decoration: none;">
            Join ${SPRINT_COHORT_WHATSAPP.name} on WhatsApp →
          </a>
        </p>
        <p>Session 1 is <strong>${SPRINT_CONFIG.session1Date}</strong> · 9:00 AM IST. Zoom link and pre-read materials will be shared in the group.</p>
        <p style="color: #94A3B8; font-size: 13px;">Payment ID: ${data.paymentId}</p>
        <hr style="border: none; border-top: 1px solid #1E293B; margin: 24px 0;" />
        <p style="color: #94A3B8; font-size: 12px;">IntelliForge AI · <a href="${SITE_CONFIG.url}" style="color: #94A3B8;">upskill.intelliforge.tech</a></p>
      </div>
    `,
    reply_to: INBOX_ID,
  });
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
        <li style="margin-bottom: 8px;"><a href="${WHATSAPP_GROUP_URL}" style="color: #06B6D4;">Join our WhatsApp group: ${WHATSAPP_GROUP.name}</a></li>
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
