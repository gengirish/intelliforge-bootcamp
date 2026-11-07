import {
  LMS_SIGNIN_URL,
  LMS_UPSKILL_ROADMAP_URL,
  SITE_CONFIG,
  findCohort2Sprint,
  SPRINT_COHORT_WHATSAPP,
  SPRINT_COHORT_WHATSAPP_URL,
  WHATSAPP_DEMO_URL,
  WHATSAPP_GROUP_URL,
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
  sprintSlug: string;
}) {
  const displayName = data.name.trim() || "there";
  // Undefined for a late Cohort 1 confirmation, which must not quote Cohort 2 dates.
  const sprint = findCohort2Sprint(data.sprintSlug);

  return agentMailSend({
    to: data.email,
    subject: `You're in — ${SPRINT_COHORT_WHATSAPP.name} · IntelliForge AI Sprint`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1C; color: #E2E8F0; padding: 32px; border-radius: 12px;">
        <h2 style="color: #7C3AED; margin-top: 0;">You're in${sprint ? ", Cohort 2" : ""}!</h2>
        <p>Hi ${displayName},</p>
        <p>Your payment for <strong>${sprint ? `Sprint ${sprint.number} of 6: ${sprint.title}` : "the 2-Week AI Sprint"}</strong> is confirmed. Your seat is reserved.</p>
        <p><strong>Step 1 — Join the cohort WhatsApp group now:</strong></p>
        <p style="margin: 24px 0;">
          <a href="${SPRINT_COHORT_WHATSAPP_URL}" style="display: inline-block; background: #F59E0B; color: #0A0F1C; padding: 14px 24px; border-radius: 8px; font-weight: 600; text-decoration: none;">
            Join ${SPRINT_COHORT_WHATSAPP.name} on WhatsApp →
          </a>
        </p>
        <p><strong>Step 2 — Open your course on the LMS:</strong></p>
        <p>Your LMS account is ready — it was auto-provisioned with <strong>${data.email}</strong>. Start with the <strong>12-Week AI Upskill RoadMap</strong> (IF-RES-2026-012 curriculum).</p>
        <p style="margin: 24px 0;">
          <a href="${LMS_UPSKILL_ROADMAP_URL}" style="display: inline-block; background: #1E293B; color: #E2E8F0; padding: 14px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; border: 1px solid #334155;">
            Open 12-Week RoadMap →
          </a>
        </p>
        <p style="font-size: 13px; color: #94A3B8;">Or <a href="${LMS_SIGNIN_URL}" style="color: #06B6D4;">sign in to LMS</a> first if prompted.</p>
        <p>${sprint ? `Session 1 is <strong>${sprint.firstClass}</strong>. ` : ""}Live classes run every <strong>Saturday &amp; Sunday</strong> — <strong>7:00–10:00 PM IST</strong>. Zoom links and pre-read materials will be shared in the group.</p>
        <p style="color: #94A3B8; font-size: 13px;">Payment ID: ${data.paymentId}</p>
        <hr style="border: none; border-top: 1px solid #1E293B; margin: 24px 0;" />
        <p style="color: #94A3B8; font-size: 12px;">IntelliForge AI · <a href="${SITE_CONFIG.url}" style="color: #94A3B8;">upskill.intelliforge.tech</a></p>
      </div>
    `,
    reply_to: INBOX_ID,
  });
}

const BOOTCAMP_PLAN_LABELS: Record<string, string> = {
  earlyBird: "Early Bird",
};

export async function sendBootcampEnrollmentConfirmation(data: {
  name: string;
  email: string;
  paymentId: string;
  plan: "earlyBird" | "regular" | string;
}) {
  const displayName = data.name.trim() || "there";
  const planLabel = BOOTCAMP_PLAN_LABELS[data.plan] ?? data.plan;

  return agentMailSend({
    to: data.email,
    subject: `You're enrolled — IntelliForge AI Bootcamp (${planLabel})`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1C; color: #E2E8F0; padding: 32px; border-radius: 12px;">
        <h2 style="color: #7C3AED; margin-top: 0;">You're enrolled!</h2>
        <p>Hi ${displayName},</p>
        <p>Your payment for the <strong>IntelliForge AI Bootcamp</strong> (${planLabel}) is confirmed. Your seat in the upcoming cohort is reserved.</p>
        <p><strong>Step 1 — Join the WhatsApp cohort group:</strong></p>
        <p style="margin: 24px 0;">
          <a href="${WHATSAPP_GROUP_URL}" style="display: inline-block; background: #F59E0B; color: #0A0F1C; padding: 14px 24px; border-radius: 8px; font-weight: 600; text-decoration: none;">
            Join WhatsApp Cohort Group →
          </a>
        </p>
        <p><strong>Step 2 — Open your course on the LMS:</strong></p>
        <p>Your LMS account is ready — it was auto-provisioned with <strong>${data.email}</strong>. Access the <strong>12-Week AI Upskill RoadMap</strong> for course materials, recordings, and assignments.</p>
        <p style="margin: 24px 0;">
          <a href="${LMS_UPSKILL_ROADMAP_URL}" style="display: inline-block; background: #1E293B; color: #E2E8F0; padding: 14px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; border: 1px solid #334155;">
            Open 12-Week RoadMap →
          </a>
        </p>
        <p style="font-size: 13px; color: #94A3B8;">Or <a href="${LMS_SIGNIN_URL}" style="color: #06B6D4;">sign in to LMS</a> first if prompted.</p>
        <p>Live sessions run every <strong>Saturday &amp; Sunday</strong>, <strong>7:00–10:00 PM IST</strong> (3 hours per day) over 12 weeks. Schedule details will be shared in WhatsApp.</p>
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
        <tr><td style="padding: 8px 0; color: #94A3B8;">Name</td><td style="padding: 8px 0;">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding: 8px 0; color: #94A3B8;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #06B6D4;">${escapeHtml(data.email)}</a></td></tr>
        ${data.phone ? `<tr><td style="padding: 8px 0; color: #94A3B8;">Phone</td><td style="padding: 8px 0;">${escapeHtml(data.phone)}</td></tr>` : ""}
        <tr><td style="padding: 8px 0; color: #94A3B8; vertical-align: top;">Message</td><td style="padding: 8px 0;">${escapeHtml(data.message)}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #1E293B; margin: 24px 0;" />
      <p style="color: #94A3B8; font-size: 12px;">Sent from IntelliForge AI Bootcamp — upskill.intelliforge.tech</p>
    </div>
  `;

  const confirmHtml = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1C; color: #E2E8F0; padding: 32px; border-radius: 12px;">
      <h2 style="color: #7C3AED; margin-top: 0;">Thanks for reaching out, ${escapeHtml(data.name)}!</h2>
      <p>We received your enquiry about the <strong>IntelliForge AI Bootcamp</strong>. Our team will get back to you within 24 hours.</p>
      <p>In the meantime, you can:</p>
      <ul style="padding-left: 20px;">
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Tells the admin about a new waitlist entry. */
export async function sendWaitlistNotification(data: {
  cohortName: string;
  name: string;
  email: string;
  phone?: string;
  motivation: string;
}) {
  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Motivation", data.motivation],
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding: 8px 0; color: #94A3B8;">${label}</td><td style="padding: 8px 0;">${escapeHtml(value as string)}</td></tr>`
    )
    .join("");

  await agentMailSend({
    to: ADMIN_EMAIL,
    subject: `${data.cohortName} waitlist: ${data.name.replace(/[\r\n]+/g, " ")}`,
    html: `<div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1C; color: #E2E8F0; padding: 32px; border-radius: 12px;"><h2 style="color: #7C3AED; margin-top: 0;">New ${data.cohortName} waitlist entry</h2><table style="width: 100%; border-collapse: collapse;">${rows}</table></div>`,
  });
}

/**
 * Welcome email to someone who joined a waitlist: confirms their place, points
 * them at the free setup course, and gives them a direct WhatsApp line.
 */
export async function sendWaitlistConfirmation(data: {
  name: string;
  email: string;
  cohortName: string;
  launchWeekend: string;
  firstClass: string;
  prepCourseName: string;
  prepCourseUrl: string;
  whatsappUrl: string;
}) {
  const firstName = escapeHtml(data.name.trim().split(/\s+/)[0] || "there");
  const button = (href: string, label: string, primary: boolean) =>
    `<a href="${escapeHtml(href)}" style="display: inline-block; padding: 12px 22px; border-radius: 8px; font-weight: 600; text-decoration: none; ${
      primary
        ? "background: #7C3AED; color: #FFFFFF;"
        : "background: #1E293B; color: #E2E8F0; border: 1px solid #334155;"
    }">${label}</a>`;

  return agentMailSend({
    to: data.email,
    subject: `You're on the ${data.cohortName} waitlist: two things to do now`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1C; color: #E2E8F0; padding: 32px; border-radius: 12px; line-height: 1.6;">
        <h2 style="color: #7C3AED; margin-top: 0;">You're on the ${escapeHtml(data.cohortName)} waitlist</h2>
        <p>Hi ${firstName},</p>
        <p>Thanks for joining. Enrolment opens on <strong>${escapeHtml(data.launchWeekend)}</strong>, and the first class is on <strong>${escapeHtml(data.firstClass)}</strong>. You'll hear from us first.</p>

        <h3 style="color: #E2E8F0; margin-bottom: 4px;">1. Set up your machine</h3>
        <p style="margin-top: 0;">Work through the free <strong>${escapeHtml(data.prepCourseName)}</strong> before the cohort starts, so you can build from the first class instead of installing tools.</p>
        <p>${button(data.prepCourseUrl, "Start the setup course", true)}</p>

        <h3 style="color: #E2E8F0; margin-bottom: 4px;">2. Say hello on WhatsApp</h3>
        <p style="margin-top: 0;">Message me directly with any questions about the cohort.</p>
        <p>${button(data.whatsappUrl, "Chat on WhatsApp", false)}</p>

        <p style="margin-top: 28px;">See you soon,<br />Girish<br /><span style="color: #94A3B8;">IntelliForge AI</span></p>
        <hr style="border: none; border-top: 1px solid #1E293B; margin: 24px 0;" />
        <p style="color: #94A3B8; font-size: 12px;">You're getting this because you joined the ${escapeHtml(data.cohortName)} waitlist at ${SITE_CONFIG.url}/waitlist. Reply to this email if you'd like to be removed.</p>
      </div>
    `,
  });
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
