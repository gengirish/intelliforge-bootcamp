import { NextResponse } from "next/server";
import { WHATSAPP_GROUP } from "@/lib/constants";

export function GET() {
  return NextResponse.redirect(WHATSAPP_GROUP.inviteUrl, 302);
}
