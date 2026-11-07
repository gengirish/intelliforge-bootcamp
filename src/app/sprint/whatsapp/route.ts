import { redirectToCohortLink } from "@/lib/cohort-links";

export function GET(req: Request) {
  return redirectToCohortLink(req, "SPRINT_WHATSAPP_INVITE_URL");
}
