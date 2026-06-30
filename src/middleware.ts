import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

export default process.env.E2E_BYPASS_CLERK === "1"
  ? () => NextResponse.next()
  : clerkMiddleware();

export const config = {
  matcher: ["/sign-in(.*)", "/sprint/enroll", "/bootcamp/enroll"],
};
