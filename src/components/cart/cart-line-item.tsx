import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/cart-context";
import type { CartLine } from "@/types/cart";

interface CartLineItemProps {
  line: CartLine;
}

/**
 * CartLineItem — single product row in the cart drawer.
 *
 * Displays image, product name, quantity controls, and price.
 */
export function CartLineItem({ line }: CartLineItemProps) {
  const t = useTranslations("cart");
  const { updateItem, removeItem, isUpdating } = useCart();

  const image = line.merchandise.product.featuredImage;
  const productTitle = line.merchandise.product.title;
  const linePrice = `${parseFloat(line.cost.totalAmount.amount).toFixed(2)} ${line.cost.totalAmount.currencyCode === "EUR" ? "\u20AC" : line.cost.totalAmount.currencyCode}`;

  return (
    <div className="flex gap-4 border-b border-border-default px-6 py-5">
      {/* Product image */}
      <div className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden bg-bg-warm">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || productTitle}
            fill
            sizes="72px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[10px] text-ink-tertiary">VINKL</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-ink-primary">{productTitle}</p>
            {line.merchandise.title !== "Default" && (
              <p className="mt-0.5 text-xs text-ink-tertiary">
                {line.merchandise.title}
              </p>
            )}
          </div>
          <p className="text-sm tabular-nums text-ink-primary">{linePrice}</p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center border border-border-default">
            <button
              onClick={() =>
                line.quantity > 1
                  ? updateItem(line.id, line.quantity - 1)
                  : removeItem(line.id)
              }
              disabled={isUpdating}
              aria-label="Decrease quantity"
              className="flex h-7 w-7 items-center justify-center text-xs text-ink-secondary transition-colors hover:text-ink-primary disabled:opacity-40"
            >
              &minus;
            </button>
            <span className="flex h-7 w-7 items-center justify-center text-xs tabular-nums text-ink-primary">
              {line.quantity}
            </span>
            <button
              onClick={() => updateItem(line.id, line.quantity + 1)}
              disabled={isUpdating}
              aria-label="Increase quantity"
              className="flex h-7 w-7 items-center justify-center text-xs text-ink-secondary transition-colors hover:text-ink-primary disabled:opacity-40"
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeItem(line.id)}
            disabled={isUpdating}
            className="text-xs text-ink-tertiary transition-colors hover:text-terracotta disabled:opacity-40"
          >
            {t("remove")}
          </button>
        </div>
      </div>
    </div>
  );
}
