"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { FREE_LIVE_DEMO_URL } from "@/lib/constants";

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className="relative z-[60] flex w-full items-center justify-center gap-2 py-2 pr-10 text-center text-sm text-foreground"
      style={{
        background:
          "linear-gradient(90deg, var(--primary) 0%, #8B5CF6 50%, var(--primary) 100%)",
      }}
    >
      <span className="shrink-0">
        Cohort 1 open — ship to a live repo, earn a verifiable credential
      </span>
      <a
        href={FREE_LIVE_DEMO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 font-medium underline underline-offset-2 hover:no-underline focus:outline-none focus:ring-2 focus:ring-white rounded"
      >
        Try free demo →
      </a>
      <Link
        href="#pricing"
        className="hidden shrink-0 font-medium underline underline-offset-2 hover:no-underline sm:inline focus:outline-none focus:ring-2 focus:ring-white rounded"
      >
        Enrol →
      </Link>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-foreground/80 hover:bg-white/20 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-white"
      >
        <X size={18} />
      </button>
    </div>
  );
}
