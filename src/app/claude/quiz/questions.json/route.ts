import { QUESTIONS } from "@/lib/ccarf/bank";

/**
 * The question bank, served as a static JSON asset so the quiz page ships a small
 * bundle and the bank can grow without affecting it. Prerendered at build time.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(QUESTIONS, {
    headers: { "Cache-Control": "public, max-age=0, must-revalidate" },
  });
}
