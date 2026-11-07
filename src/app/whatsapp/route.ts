import { redirectToCohortLink } from "@/lib/cohort-links";

export function GET(req: Request) {
  return redirectToCohortLink(req, "WHATSAPP_GROUP_INVITE_URL");
}
