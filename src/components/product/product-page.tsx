import type { Product } from "@/types";
import { ProductHero } from "./product-hero";
import { ProductStory } from "./product-story";
import { ProductSpecs } from "./product-specs";
import { ProductUse } from "./product-use";
import { AddToCartBar } from "./add-to-cart-bar";

interface ProductPageProps {
  product: Product;
}

/**
 * Full product page — composed from editorial sections.
 *
 * This is the flagship product experience. Each section
 * is a distinct emotional and informational beat:
 *
 * 1. Hero     → See it, want it, buy it (conversion)
 * 2. Story    → Understand why it exists (emotion)
 * 3. Specs    → Verify the details (confidence)
 * 4. Use      → See where it fits (imagination)
 * 5. CTA Bar  → Never lose the purchase moment (mobile safety net)
 */
export function ProductPage({ product }: ProductPageProps) {
  return (
    <>
      <ProductHero product={product} />
      <ProductStory />
      <ProductSpecs />
      <ProductUse />
      <AddToCartBar />
    </>
  );
}
