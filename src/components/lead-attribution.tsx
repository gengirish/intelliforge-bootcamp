"use client";

import { useEffect } from "react";
import { recordAttribution } from "@/lib/attribution";

/** Records how this visitor first arrived, for the waitlist form to send. */
export function LeadAttribution() {
  useEffect(() => {
    recordAttribution();
  }, []);
  return null;
}
