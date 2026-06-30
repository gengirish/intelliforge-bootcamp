"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BootcampCheckoutButtonProps {
  plan?: "earlyBird";
  label?: string;
  className?: string;
}

/** E2E stub — no Clerk; always redirects unauthenticated users to sign-in. */
export function BootcampCheckoutButtonStub({
  label = "Enroll Now — Early Bird",
  className,
}: BootcampCheckoutButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/sign-in?redirect_url=/")}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-lg bg-cta px-6 py-4 text-base font-semibold text-background",
        "hover:bg-cta-hover transition-colors duration-200",
        className
      )}
    >
      {label}
    </button>
  );
}
