import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/api-response";
import {
  getSprintSeatCounts,
  resolveSprintDisplaySeats,
} from "@/lib/sprint-seats";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "ai-sprint-jun-2026";

  const seats = await getSprintSeatCounts(slug);

  if (!seats) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Sprint not found" },
      { status: 404 }
    );
  }

  const display = resolveSprintDisplaySeats(seats);

  return NextResponse.json<
    ApiResponse<{ remaining: number; filled: number; total: number }>
  >(
    {
      success: true,
      data: {
        remaining: display.remaining,
        filled: display.filled,
        total: display.total,
      },
    },
    {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" },
    }
  );
}
