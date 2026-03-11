import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils/format-price";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import type { Product } from "@/types";
import type { Locale } from "@/config/i18n";

interface ObjectDetailProps {
  product: Product;
}

export function ObjectDetail({ product }: ObjectDetailProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const tActions = useTranslations("common.actions");
  const image = product.images[0];

  return (
    <section className="px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Back link */}
        <Link
          href="/objects"
          className="inline-block text-xs font-medium uppercase tracking-widest text-ink-secondary transition-colors duration-[--duration-fast] hover:text-ink-primary"
        >
          &larr; {tActions("backToObjects")}
        </Link>

        {/* Product layout: 7/5 split */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Image — 7 columns */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden bg-bg-warm">
              {image ? (
                <Image
                  src={image.url}
                  alt={image.altText || product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-xs text-ink-tertiary">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Info — 5 columns */}
          <div className="flex flex-col justify-center lg:col-span-5">
            {product.productType && (
              <p className="text-xs font-medium uppercase tracking-widest text-ink-tertiary">
                {product.productType}
              </p>
            )}

            <h1 className="mt-2 font-serif text-3xl font-light tracking-tight md:text-4xl">
              {product.title}
            </h1>

            <p className="mt-4 text-lg text-ink-secondary">
              {formatPrice(product.price, locale)}
            </p>

            {/* Description */}
            <div
              className="mt-6 text-sm leading-relaxed text-ink-secondary"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />

            {/* Variants — minimal display */}
            {product.variants.length > 1 && (
              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-widest text-ink-tertiary">
                  {t("details")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <span
                      key={variant.id}
                      className="border border-border-default px-3 py-1.5 text-xs text-ink-primary"
                    >
                      {variant.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <AddToCartButton
              variantId={product.variants[0]?.id ?? ""}
              available={product.available}
              className="mt-8 w-full bg-ink-primary px-6 py-3.5 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-colors duration-[--duration-fast] ease-[--ease-out] hover:bg-terracotta disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink-primary lg:w-auto"
            >
              {product.available ? t("addToCart") : t("soldOut")}
            </AddToCartButton>
          </div>
        </div>
      </div>
    </section>
  );
}
