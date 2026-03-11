import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/cart-context";

/**
 * CartSummary — subtotal, shipping note, checkout button.
 *
 * Checkout redirects to Shopify Hosted Checkout.
 */
export function CartSummary() {
  const t = useTranslations("cart");
  const { cart } = useCart();

  if (!cart || cart.lines.length === 0) return null;

  const subtotal = `${parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)} ${cart.cost.subtotalAmount.currencyCode === "EUR" ? "\u20AC" : cart.cost.subtotalAmount.currencyCode}`;

  function handleCheckout() {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
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
        className="mt-4 w-full bg-ink-primary px-6 py-3.5 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-colors duration-[--duration-fast] ease-[--ease-out] hover:bg-terracotta active:scale-[0.98]"
      >
        {t("checkout")}
      </button>
    </div>
  );
}
