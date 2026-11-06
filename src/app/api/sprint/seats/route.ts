import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/api-response";
import { SPRINT_CONFIG } from "@/lib/constants";
import { getSprintSeatCounts } from "@/lib/sprint-seats";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? SPRINT_CONFIG.slug;

  const seats = await getSprintSeatCounts(slug);

  if (!seats) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Sprint not found" },
      { status: 404 }
    );
  }

  return NextResponse.json<
    ApiResponse<{ remaining: number; filled: number; total: number }>
  >(
    {
      success: true,
      data: {
        remaining: seats.remaining,
        filled: seats.filled,
        total: seats.total,
      },
    },
    {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" },
    }
  );
}
