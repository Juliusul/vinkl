import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductGallery } from "./product-gallery";
import { AddToCartButton } from "./add-to-cart-button";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
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
  const tWaitlist = useTranslations("waitlist");

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
            <h1 className="mt-3 font-heading text-[clamp(2.25rem,4vw,3.5rem)] font-normal leading-none tracking-tight text-ink-primary">
              {t("name")}
            </h1>

            {/* Tagline */}
            <p className="mt-4 text-base leading-relaxed text-ink-secondary md:text-lg">
              {t("tagline")}
            </p>

            {/* Divider */}
            <div className="my-6 h-px bg-border-default lg:my-8" />

            {/* Price + why it costs what it costs */}
            <p className="font-serif text-2xl font-light tracking-tight text-ink-primary md:text-3xl">
              {t("price")}
            </p>
            <p className="mt-1.5 text-sm text-ink-secondary">{t("priceNote")}</p>

            {/* Availability — first edition, pre-launch */}
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-terracotta">
              <span className="h-1.5 w-1.5 bg-terracotta" aria-hidden="true" />
              {t("availability")}
            </p>

            {/* Add to cart */}
            <AddToCartButton
              variantId={product.variants[0]?.id ?? ""}
              available={product.available}
              className="mt-6 w-full bg-ink-primary px-8 py-4 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-[background-color,transform] duration-[--duration-normal] ease-[--ease-out] hover:bg-terracotta active:translate-y-px active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink-primary"
            >
              {t("addToCart")}
            </AddToCartButton>

            {/* Shipping + mounting reassurance */}
            <p className="mt-4 text-center text-xs text-ink-tertiary">
              {t("shipping")}
            </p>
            <p className="mt-1.5 text-center text-xs text-ink-tertiary">
              {t("mounting")}
            </p>

            {/* Trust signals — value reads first, caption underneath */}
            <dl className="mt-8 flex items-stretch gap-6 border-t border-border-default pt-6 lg:mt-10 lg:pt-8">
              {[
                { value: t("trust.adjustableValue"), label: t("trust.adjustableLabel") },
                { value: t("trust.materialValue"), label: t("trust.materialLabel") },
                { value: t("trust.loadValue"), label: t("trust.loadLabel") },
              ].map((signal, i) => (
                <div key={signal.label} className="flex items-stretch gap-6">
                  {i > 0 && <div className="w-px self-stretch bg-border-default" aria-hidden="true" />}
                  <div className="flex flex-col">
                    <dt className="order-2 mt-1 text-[11px] uppercase tracking-[0.12em] text-ink-tertiary">
                      {signal.label}
                    </dt>
                    <dd className="order-1 text-sm font-medium tracking-tight text-ink-primary">
                      {signal.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            {/* Pre-launch capture — the email is the sale until August */}
            <div className="mt-8 border-t border-border-default pt-6 lg:mt-10 lg:pt-8">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
                {tWaitlist("label")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                {tWaitlist("body")}
              </p>
              <div className="mt-4">
                <WaitlistForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
