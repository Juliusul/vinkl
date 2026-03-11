"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Sticky add-to-cart bar — mobile conversion safety net.
 *
 * Appears when the main CTA button scrolls out of view.
 * Fixed to the bottom of the viewport on mobile/tablet.
 * Hidden on desktop where the CTA is always visible
 * in the sticky sidebar region.
 *
 * Uses IntersectionObserver to track the main CTA's visibility.
 */
export function AddToCartBar() {
  const t = useTranslations("vinkl.hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Look for the main add-to-cart button by data attribute
    const mainCta = document.querySelector("[data-product-cta]");
    if (!mainCta) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show bar when main CTA is NOT visible
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(mainCta);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-border-default bg-bg-cream/95 px-5 py-3 backdrop-blur-sm transition-transform duration-[--duration-moderate] ease-[--ease-out] lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[640px] items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-ink-primary">VINKL</span>
          <span className="text-xs text-ink-secondary">{t("price")}</span>
        </div>
        <button className="bg-ink-primary px-6 py-3 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-colors duration-[--duration-fast] ease-[--ease-out] hover:bg-terracotta active:scale-[0.98]">
          {t("addToCart")}
        </button>
      </div>
    </div>
  );
}
