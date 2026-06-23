"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SprintCheckoutButtonProps {
  sprintSlug?: string;
  priceInPaise: number;
  label?: string;
  className?: string;
}

/** E2E stub — no Clerk; always redirects unauthenticated users to sign-in. */
export function SprintCheckoutButtonStub({
  label = "Enroll Now",
  className,
}: SprintCheckoutButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/sign-in?redirect_url=/sprint")}
      className={className}
    >
      {label}
    </Button>
  );
}
