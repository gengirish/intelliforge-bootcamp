"use client";

import { useEffect, useState } from "react";
import type { ApiResponse } from "@/lib/api-response";
import { SPRINT_CONFIG } from "@/lib/constants";
import type { SprintSeatCounts } from "@/lib/sprint-seats";

const POLL_MS = 30_000;

export type SprintSeats = SprintSeatCounts;

export function useSprintSeats(initial: SprintSeats): SprintSeats {
  const [seats, setSeats] = useState(initial);

  useEffect(() => {
    let cancelled = false;

    const fetchSeats = async () => {
      try {
        const res = await fetch(`/api/sprint/seats?slug=${SPRINT_CONFIG.slug}`);
        const json = (await res.json()) as ApiResponse<SprintSeats>;
        if (!cancelled && json.success) {
          setSeats((current) => ({ ...current, ...json.data }));
        }
      } catch {
        // Keep last known counts on network errors
      }
    };

    fetchSeats();
    const id = window.setInterval(fetchSeats, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return seats;
}
