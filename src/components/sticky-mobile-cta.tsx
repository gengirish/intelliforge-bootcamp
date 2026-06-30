"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CTA_MICRO_TRUST, SPRINT_CONFIG, WHATSAPP_DEMO_URL } from "@/lib/constants";

export function StickyMobileCta() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const pricing = document.getElementById("pricing");
    const contact = document.getElementById("contact");

    const checkVisibility = () => {
      const scrollY = window.scrollY;
      const viewportBottom = scrollY + window.innerHeight;

      const nearPricing =
        pricing !== null && viewportBottom > pricing.offsetTop + 120;
      const nearContact =
        contact !== null && scrollY > contact.offsetTop - window.innerHeight * 0.5;

      setIsHidden(nearPricing || nearContact);
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  if (isHidden) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 md:hidden",
        "border-t border-border bg-surface/95 backdrop-blur",
        "pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 px-4"
      )}
    >
      <div className="mx-auto max-w-lg">
        <div className="flex gap-3">
          <a
            href={WHATSAPP_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-light"
          >
            Free Demo
          </a>
          <Link
            href={SPRINT_CONFIG.href}
            className="glow-cta flex flex-1 items-center justify-center rounded-lg bg-cta px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-cta-hover"
          >
            AI Sprint {SPRINT_CONFIG.priceDisplay}
          </Link>
        </div>
        <p className="mt-2 text-center text-[11px] leading-snug text-muted">
          {CTA_MICRO_TRUST.sprint}
        </p>
      </div>
    </div>
  );
}
