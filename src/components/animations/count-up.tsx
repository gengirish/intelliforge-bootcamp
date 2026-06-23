"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({ end, suffix = "", duration = 2, className }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);
  const hasAnimated = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || hasAnimated.current || prefersReducedMotion) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration, prefersReducedMotion]);

  const displayCount = prefersReducedMotion && isInView ? end : count;

  return (
    <span ref={ref} className={className}>
      {displayCount}
      {suffix}
    </span>
  );
}
