"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { SPRINT_CONFIG } from "@/lib/constants";

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
        🔥 2-Week AI Sprint — starts {SPRINT_CONFIG.cohortStartDate} ·{" "}
        {SPRINT_CONFIG.priceDisplay}
      </span>
      <Link
        href={SPRINT_CONFIG.href}
        className="shrink-0 font-medium underline underline-offset-2 hover:no-underline"
      >
        Enroll now →
      </Link>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-foreground/80 hover:bg-white/20 hover:text-foreground transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}
