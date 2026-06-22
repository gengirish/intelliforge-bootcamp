"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface SprintCheckoutButtonProps {
  sprintSlug?: string;
  priceInPaise: number;
  label?: string;
  className?: string;
}

export function SprintCheckoutButton({
  sprintSlug = "ai-sprint-jun-2026",
  priceInPaise: _priceInPaise,
  label = "Enroll Now",
  className,
}: SprintCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const handleCheckout = async () => {
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/sprint");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/sprint/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sprintSlug }),
      });
      const json = await res.json();
      if (!json.success) {
        alert(json.error);
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
        description: "2-Week AI Sprint — Cohort 1",
        image: "https://upskill.intelliforge.tech/logo.png",
        prefill: {
          name: user?.fullName ?? "",
          email: user?.emailAddresses[0]?.emailAddress ?? "",
          contact: user?.phoneNumbers[0]?.phoneNumber ?? "",
        },
        theme: { color: "#3B82F6" },
        handler: (response: { razorpay_payment_id: string }) => {
          router.push(
            `/sprint/success?payment_id=${response.razorpay_payment_id}&order_id=${orderId}`
          );
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading} className={className}>
      {loading ? "Opening checkout..." : label}
    </Button>
  );
}
