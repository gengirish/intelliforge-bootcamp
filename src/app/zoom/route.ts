import { NextResponse } from "next/server";
import { ZOOM_MEETING } from "@/lib/constants";

export function GET() {
  return NextResponse.redirect(ZOOM_MEETING.joinUrl, 302);
}
