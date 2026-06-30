"use client";

import { useEffect, useState } from "react";
import type { ApiResponse } from "@/lib/api-response";

const POLL_MS = 30_000;
const SPRINT_SLUG = "ai-sprint-jun-2026";

export interface SprintSeats {
  filled: number;
  total: number;
  remaining: number;
}

export function useSprintSeats(initial: SprintSeats): SprintSeats {
  const [seats, setSeats] = useState(initial);

  useEffect(() => {
    let cancelled = false;

    const fetchSeats = async () => {
      try {
        const res = await fetch(`/api/sprint/seats?slug=${SPRINT_SLUG}`);
        const json = (await res.json()) as ApiResponse<SprintSeats>;
        if (!cancelled && json.success) {
          setSeats(json.data);
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
