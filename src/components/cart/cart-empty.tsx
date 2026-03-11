import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/cart-context";

/**
 * CartEmpty — empty state for the cart drawer.
 *
 * Minimal message + continue shopping link.
 */
export function CartEmpty() {
  const t = useTranslations("cart");
  const { closeCart } = useCart();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16">
      <p className="text-sm text-ink-secondary">{t("empty")}</p>
      <button
        onClick={closeCart}
        className="mt-6 text-xs font-medium uppercase tracking-widest text-ink-primary transition-colors duration-[--duration-fast] hover:text-terracotta"
      >
        {t("continueShopping")}
      </button>
    </div>
  );
}
