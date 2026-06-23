"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
}

const directionClasses = {
  up: "translate-y-10",
  down: "-translate-y-10",
  left: "translate-x-10",
  right: "-translate-x-10",
  none: "",
};

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin: "-80px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, prefersReducedMotion]);

  const isVisible = prefersReducedMotion || visible;

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        !isVisible && "opacity-0",
        !isVisible && directionClasses[direction],
        isVisible && "opacity-100 translate-x-0 translate-y-0",
        className
      )}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
