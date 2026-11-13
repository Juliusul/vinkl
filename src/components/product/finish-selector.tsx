"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AddToCartButton } from "./add-to-cart-button";
import type { ProductVariant } from "@/types";

type FinishKey = "natural" | "oiled";

function finishOf(variant: ProductVariant): FinishKey | null {
  const value = variant.selectedOptions.find((o) => o.name === "finish")?.value;
  return value === "natural" || value === "oiled" ? value : null;
}

interface FinishSelectorProps {
  variants: ProductVariant[];
  available: boolean;
}

/**
 * FinishSelector — surface choice (untreated vs. oiled teak) + add to cart.
 *
 * Client island: holds the selected finish so the CTA always adds
 * the matching variant. The description below the toggle swaps with
 * the selection; the care note only appears for the oiled finish.
 */
export function FinishSelector({ variants, available }: FinishSelectorProps) {
  const t = useTranslations("vinkl.hero");
  const [selected, setSelected] = useState<FinishKey>("natural");

  const variantFor = (key: FinishKey) =>
    variants.find((v) => finishOf(v) === key) ?? variants[0];

  const selectedVariant = variantFor(selected);

  return (
    <div className="mt-6">
      {/* Label */}
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
        {t("finish.label")}
      </p>

      {/* Why untreated teak works at all */}
      <p className="mt-2 text-xs leading-relaxed text-ink-tertiary">
        {t("finish.intro")}
      </p>

      {/* Toggle */}
      <div
        role="radiogroup"
        aria-label={t("finish.label")}
        className="mt-3 grid grid-cols-2 gap-2"
      >
        {(["natural", "oiled"] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={selected === key}
            onClick={() => setSelected(key)}
            className={`border px-4 py-3 text-xs font-medium uppercase tracking-widest transition-colors duration-[--duration-fast] ${
              selected === key
                ? "border-ink-primary bg-ink-primary text-ink-inverse"
                : "border-border-default text-ink-secondary hover:border-ink-primary hover:text-ink-primary"
            }`}
          >
            {t(`finish.${key}.name`)}
          </button>
        ))}
      </div>

      {/* Description of the selected finish */}
      <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
        {t(`finish.${selected}.description`)}
      </p>
      {selected === "oiled" && (
        <p className="mt-2 text-xs leading-relaxed text-ink-tertiary">
          {t("finish.care")}
        </p>
      )}

      {/* Add to cart — always adds the selected finish */}
      <AddToCartButton
        variantId={selectedVariant?.id ?? ""}
        available={available}
        className="mt-6 w-full bg-ink-primary px-8 py-4 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-[background-color,transform] duration-[--duration-normal] ease-[--ease-out] hover:bg-terracotta active:translate-y-px active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink-primary"
      >
        {t("addToCart")}
      </AddToCartButton>
    </div>
  );
}
