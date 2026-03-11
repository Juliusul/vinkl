"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/cart-context";

interface AddToCartButtonProps {
  variantId: string;
  available: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * AddToCartButton — Client Component island for add-to-cart actions.
 *
 * Drop into any Server Component to make its CTA functional.
 * Handles loading state and disabled/sold-out display.
 */
export function AddToCartButton({
  variantId,
  available,
  className,
  children,
}: AddToCartButtonProps) {
  const { addItem, isAdding } = useCart();
  const t = useTranslations("cart");

  async function handleClick() {
    if (!available || isAdding) return;
    await addItem(variantId);
  }

  return (
    <button
      onClick={handleClick}
      disabled={!available || isAdding}
      data-product-cta
      data-variant-id={variantId}
      className={className}
    >
      {isAdding ? t("adding") : children}
    </button>
  );
}
