"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface BootcampCheckoutButtonProps {
  plan?: "earlyBird";
  label?: string;
  className?: string;
}

export function BootcampCheckoutButtonClerk({
  plan = "earlyBird",
  label = "Enroll Now — Early Bird",
  className,
}: BootcampCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const handleCheckout = async () => {
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/bootcamp/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
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
        description: "AI Bootcamp — Early Bird Enrollment",
        image: "https://upskill.intelliforge.tech/logo.png",
        prefill: {
          name: user?.fullName ?? "",
          email: user?.emailAddresses[0]?.emailAddress ?? "",
          contact: user?.phoneNumbers[0]?.phoneNumber ?? "",
        },
        theme: { color: "#F59E0B" },
        handler: (response: { razorpay_payment_id: string }) => {
          router.push(
            `/enrollment/success?payment_id=${encodeURIComponent(response.razorpay_payment_id)}`
          );
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again or contact support.");
        setLoading(false);
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
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-lg bg-cta px-6 py-4 text-base font-semibold text-background",
          "hover:bg-cta-hover transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70",
          className
        )}
      >
        {loading ? "Opening checkout…" : label}
      </button>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
