"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { WHATSAPP_DEMO_URL } from "@/lib/constants";

export function WhatsAppFAB() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible || dismissed) return;
    const timer = setTimeout(() => setShowTooltip(true), 4000);
    return () => clearTimeout(timer);
  }, [isVisible, dismissed]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {showTooltip && !dismissed && (
        <div
          className={cn(
            "relative mr-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground shadow-xl",
            "animate-in fade-in slide-in-from-bottom-2 duration-300",
            "max-w-[240px]"
          )}
        >
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              setShowTooltip(false);
            }}
            className="absolute -right-1.5 -top-1.5 rounded-full bg-surface-light p-0.5 text-muted hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="font-medium">Have questions?</p>
          <p className="mt-0.5 text-muted">Chat with us on WhatsApp</p>
          <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-b border-r border-border bg-surface" />
        </div>
      )}

      <div className="relative flex h-14 w-14 items-center justify-center">
        <span
          className="absolute inset-0 rounded-full bg-[#25D366]/35 animate-ping"
          aria-hidden
        />
        <a
          href={WHATSAPP_DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className={cn(
            "relative z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg",
            "transition-all duration-200 hover:scale-110 hover:bg-[#20BD5A]",
            "animate-in fade-in zoom-in duration-300"
          )}
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      </div>
    </div>
  );
}
