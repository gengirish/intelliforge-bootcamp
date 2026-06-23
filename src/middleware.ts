import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

export default process.env.E2E_BYPASS_CLERK === "1"
  ? () => NextResponse.next()
  : clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
