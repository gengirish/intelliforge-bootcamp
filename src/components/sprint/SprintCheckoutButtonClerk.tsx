"use client";

import { findCohort2Sprint, SPRINT_CONFIG } from "@/lib/constants";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import type { RazorpayPaymentResponse } from "@/types/razorpay";
import { cn } from "@/lib/utils";

interface SprintCheckoutButtonProps {
  sprintSlug?: string;
  priceInPaise: number;
  label?: string;
  className?: string;
}

export function SprintCheckoutButtonClerk({
  sprintSlug = SPRINT_CONFIG.slug,
  label = "Enroll Now",
  className,
}: SprintCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const handleCheckout = async () => {
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/sprint");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/sprint/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sprintSlug }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Enrollment failed. Please try again.");
        return;
      }

      const { orderId, amount, currency } = json.data;

      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
          document.body.appendChild(script);
        });
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        order_id: orderId,
        amount,
        currency,
        name: "IntelliForge AI",
        description: findCohort2Sprint(sprintSlug)
          ? `Sprint ${findCohort2Sprint(sprintSlug)?.number} of 6 — Cohort 2`
          : SPRINT_CONFIG.name,
        image: "https://upskill.intelliforge.tech/logo.png",
        prefill: {
          name: user?.fullName ?? "",
          email: user?.emailAddresses[0]?.emailAddress ?? "",
          contact: user?.phoneNumbers[0]?.phoneNumber ?? "",
        },
        theme: { color: "#F59E0B" },
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            await fetch("/api/sprint/confirm-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
          } catch (err) {
            console.error("[Sprint checkout] Payment confirm failed:", err);
          }

          router.push(
            `/sprint/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&sprint=${sprintSlug}`
          );
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleCheckout}
        disabled={loading}
        className={cn("bg-cta hover:bg-cta-hover", className)}
      >
        {loading ? "Opening checkout..." : label}
      </Button>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
