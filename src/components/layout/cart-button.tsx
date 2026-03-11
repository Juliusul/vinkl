"use client";

import { useCart } from "@/contexts/cart-context";
import { useTranslations } from "next-intl";

/**
 * Cart icon button for the header.
 *
 * Minimal bag icon with quantity badge.
 * Badge appears only when cart has items.
 */
export function CartButton() {
  const { cart, openCart } = useCart();
  const t = useTranslations("common.nav");
  const totalQuantity = cart?.totalQuantity ?? 0;

  return (
    <button
      onClick={openCart}
      aria-label={t("cart")}
      className="relative flex items-center justify-center transition-colors duration-[--duration-fast] hover:text-terracotta"
    >
      {/* Bag icon — 18×18, stroke-based */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4.5 5L3 16.5h12L13.5 5H4.5z" />
        <path d="M6.5 5V4a2.5 2.5 0 0 1 5 0v1" />
      </svg>

      {/* Badge */}
      {totalQuantity > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-medium leading-none text-ink-inverse">
          {totalQuantity}
        </span>
      )}
    </button>
  );
}
