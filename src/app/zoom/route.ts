import { redirectToCohortLink } from "@/lib/cohort-links";

export function GET(req: Request) {
  return redirectToCohortLink(req, "ZOOM_JOIN_URL");
}
