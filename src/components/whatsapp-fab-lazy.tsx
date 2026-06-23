"use client";

import dynamic from "next/dynamic";

export const WhatsAppFAB = dynamic(
  () =>
    import("@/components/whatsapp-fab").then((m) => ({
      default: m.WhatsAppFAB,
    })),
  { ssr: false }
);
