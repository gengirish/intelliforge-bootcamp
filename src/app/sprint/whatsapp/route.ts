import { NextResponse } from "next/server";
import { SPRINT_COHORT_WHATSAPP } from "@/lib/constants";

export function GET() {
  return NextResponse.redirect(SPRINT_COHORT_WHATSAPP.inviteUrl, 302);
}
