import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/api-response";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "ai-sprint-jun-2026";

  const sprint = await prisma.sprint.findUnique({
    where: { slug },
    select: { seatsTotal: true, seatsFilled: true, isActive: true },
  });

  if (!sprint) {
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
        remaining: sprint.seatsTotal - sprint.seatsFilled,
        filled: sprint.seatsFilled,
        total: sprint.seatsTotal,
      },
    },
    {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" },
    }
  );
}
