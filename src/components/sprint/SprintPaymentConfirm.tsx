"use client";

import { useEffect, useRef } from "react";

interface SprintPaymentConfirmProps {
  orderId?: string;
  paymentId?: string;
}

export function SprintPaymentConfirm({
  orderId,
  paymentId,
}: SprintPaymentConfirmProps) {
  const confirmed = useRef(false);

  useEffect(() => {
    if (!orderId || !paymentId || confirmed.current) return;
    confirmed.current = true;

    fetch("/api/sprint/confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, paymentId }),
    }).catch((err) => {
      console.error("[Sprint success] Payment confirm failed:", err);
      confirmed.current = false;
    });
  }, [orderId, paymentId]);

  return null;
}
