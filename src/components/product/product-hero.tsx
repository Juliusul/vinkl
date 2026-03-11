import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductGallery } from "./product-gallery";
import { AddToCartButton } from "./add-to-cart-button";
import type { Product } from "@/types";

interface ProductHeroProps {
  product: Product;
}

/**
 * Product Hero — the purchase moment.
 *
 * 7/5 asymmetric split. Gallery dominates the left.
 * Right panel: type label, name, tagline, price, CTA.
 */
export function ProductHero({ product }: ProductHeroProps) {
  const t = useTranslations("vinkl.hero");
  const tProduct = useTranslations("product");

  return (
    <section className="px-5 pb-16 pt-6 md:px-10 md:pb-20 md:pt-8 lg:px-16 lg:pb-24 lg:pt-10">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Back link */}
        <Link
          href="/objects"
          className="inline-block text-xs font-medium uppercase tracking-widest text-ink-tertiary transition-colors duration-[--duration-fast] hover:text-ink-primary"
        >
          &larr; {tProduct("backToObjects")}
        </Link>

        {/* Hero grid: 7/5 split */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Gallery — 7 columns */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.title}
            />
          </div>

          {/* Purchase panel — 5 columns */}
          <div className="flex flex-col justify-center lg:col-span-5">
            {/* Product type */}
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
              {t("type")}
            </p>

            {/* Product name */}
            <h1 className="mt-3 font-serif text-[clamp(2.25rem,4vw,3.5rem)] font-light leading-none tracking-tight text-ink-primary">
              {t("name")}
            </h1>

            {/* Tagline */}
            <p className="mt-4 text-base leading-relaxed text-ink-secondary md:text-lg">
              {t("tagline")}
            </p>

            {/* Divider */}
            <div className="my-6 h-px bg-border-default lg:my-8" />

            {/* Price */}
            <p className="font-serif text-2xl font-light tracking-tight text-ink-primary md:text-3xl">
              {t("price")}
            </p>

            {/* Add to cart */}
            <AddToCartButton
              variantId={product.variants[0]?.id ?? ""}
              available={product.available}
              className="mt-6 w-full bg-ink-primary px-8 py-4 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-colors duration-[--duration-fast] ease-[--ease-out] hover:bg-terracotta active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink-primary"
            >
              {t("addToCart")}
            </AddToCartButton>

            {/* Shipping note */}
            <p className="mt-4 text-center text-xs text-ink-tertiary">
              {t("shipping")}
            </p>

            {/* Trust signals */}
            <div className="mt-8 flex items-center gap-6 border-t border-border-default pt-6 lg:mt-10 lg:pt-8">
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-widest text-ink-tertiary">
                  Stufenlos
                </span>
                <span className="mt-0.5 text-[11px] text-ink-tertiary">
                  Jeder Winkel
                </span>
              </div>
              <div className="h-6 w-px bg-border-default" />
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-widest text-ink-tertiary">
                  Teak
                </span>
                <span className="mt-0.5 text-[11px] text-ink-tertiary">
                  Massiv
                </span>
              </div>
              <div className="h-6 w-px bg-border-default" />
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-widest text-ink-tertiary">
                  15 kg
                </span>
                <span className="mt-0.5 text-[11px] text-ink-tertiary">
                  Tragkraft
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
