"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  /** IntersectionObserver threshold — how much must be visible to trigger */
  threshold?: number;
  as?: "div" | "section" | "article";
}

/**
 * Scroll-triggered reveal wrapper.
 *
 * Adds the `.reveal` class (invisible + shifted) on mount,
 * then `.is-visible` when the element enters the viewport.
 * Fires once — no re-animation on scroll-up.
 *
 * Uses CSS transitions defined in globals.css.
 * Zero JS animation — only class toggling.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  threshold = 0.15,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn("reveal", className)}
      {...(stagger ? { "data-stagger": "" } : {})}
    >
      {children}
    </Tag>
  );
}
