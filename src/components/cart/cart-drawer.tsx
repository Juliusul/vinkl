"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/cart-context";
import { CartLineItem } from "./cart-line-item";
import { CartEmpty } from "./cart-empty";
import { CartSummary } from "./cart-summary";

/**
 * CartDrawer — slide-out panel from the right.
 *
 * Contains cart items, empty state, and checkout summary.
 * Closes via ESC, backdrop click, or X button.
 */
export function CartDrawer() {
  const t = useTranslations("cart");
  const { cart, isOpen, closeCart } = useCart();

  const hasItems = cart && cart.lines.length > 0;

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("cart-open");
    } else {
      document.body.classList.remove("cart-open");
    }
    return () => document.body.classList.remove("cart-open");
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-ink-primary/40 transition-opacity duration-[--duration-moderate] ease-[--ease-out] ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className={`fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[420px] flex-col bg-bg-cream shadow-2xl transition-transform duration-[--duration-moderate] ease-[--ease-out] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
          <h2 className="text-sm font-medium uppercase tracking-widest text-ink-primary">
            {t("title")}
          </h2>
          <button
            onClick={closeCart}
            aria-label={t("close")}
            className="flex h-8 w-8 items-center justify-center text-ink-secondary transition-colors duration-[--duration-fast] hover:text-ink-primary"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {hasItems ? (
          <div className="flex-1 overflow-y-auto">
            {cart.lines.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </div>
        ) : (
          <CartEmpty />
        )}

        {/* Footer */}
        <CartSummary />
      </div>
    </>
  );
}
