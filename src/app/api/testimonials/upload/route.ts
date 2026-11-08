import { auth } from "@clerk/nextjs/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import {
  AUDIO_TYPES,
  TESTIMONIAL_LIMITS,
  VIDEO_TYPES,
  mediaPrefixFor,
} from "@/lib/testimonials";
import { isTestimonialMediaConfigured } from "@/lib/testimonials-server";

/**
 * Issues short-lived Vercel Blob tokens so the browser can upload audio or
 * video straight to storage (function bodies are capped at 4.5 MB). A token
 * only allows a path under the signed-in user's own prefix, and the submit
 * action re-checks the uploaded file before saving it.
 */
export async function POST(request: Request) {
  if (!isTestimonialMediaConfigured()) {
    return NextResponse.json({ error: "Media uploads are not enabled." }, { status: 503 });
  }

  const userId =
    process.env.E2E_BYPASS_CLERK === "1" ? null : (await auth()).userId;
  if (!userId) {
    return NextResponse.json({ error: "Sign in to upload." }, { status: 401 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(mediaPrefixFor(userId))) {
          throw new Error("Upload path does not belong to this user.");
        }
        return {
          allowedContentTypes: [...AUDIO_TYPES, ...VIDEO_TYPES],
          maximumSizeInBytes: TESTIMONIAL_LIMITS.videoBytes,
          addRandomSuffix: true,
          validUntil: Date.now() + 15 * 60 * 1000,
        };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
