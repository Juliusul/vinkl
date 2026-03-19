"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useCart } from "@/contexts/cart-context";

export function CartSummary() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { cart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  if (!cart || cart.lines.length === 0) return null;

  const subtotal = `${parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)} ${cart.cost.subtotalAmount.currencyCode === "EUR" ? "\u20AC" : cart.cost.subtotalAmount.currencyCode}`;
  const totalQty = cart.lines.reduce((sum, l) => sum + l.quantity, 0);

  async function handleCheckout() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: totalQty, locale }),
      });

      if (!res.ok) throw new Error("Checkout failed");

      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <div className="border-t border-border-default px-6 py-5">
      {/* Subtotal */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-secondary">{t("subtotal")}</span>
        <span className="text-sm font-medium tabular-nums text-ink-primary">
          {subtotal}
        </span>
      </div>

      {/* Shipping note */}
      <p className="mt-2 text-xs text-ink-tertiary">{t("shipping")}</p>

      {/* Checkout button */}
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className="mt-4 w-full bg-ink-primary px-6 py-3.5 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-colors duration-[--duration-fast] ease-[--ease-out] hover:bg-terracotta active:scale-[0.98] disabled:opacity-60"
      >
        {isLoading ? "..." : t("checkout")}
      </button>
    </div>
  );
}
