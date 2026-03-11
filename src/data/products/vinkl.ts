import type { Product } from "@/types";

/**
 * Static fallback data for the VINKL shelf.
 *
 * Used when Shopify is not yet configured or the product
 * hasn't been synced. Provides enough data for the page
 * to render fully — including SEO schema.
 *
 * Once Shopify is live, this is overridden by real product data.
 */
export const vinklProduct: Product = {
  id: "gid://shopify/Product/vinkl-shelf-001",
  slug: "vinkl",
  title: "VINKL",
  description:
    "Corner wall shelf in solid teak with continuously adjustable angle mechanism. Adapts to any wall angle.",
  descriptionHtml:
    "<p>Corner wall shelf in solid teak with continuously adjustable angle mechanism. Adapts to any wall angle.</p>",
  price: {
    amount: "299.00",
    currencyCode: "EUR",
  },
  compareAtPrice: null,
  currency: "EUR",
  available: true,
  images: [
    {
      url: "/images/vinkl-regal-3.webp",
      altText: "VINKL teak corner shelf styled with books",
      width: 1920,
      height: 1920,
    },
    {
      url: "/images/vinkl-regal-2.webp",
      altText: "VINKL floating corner shelf interior styling",
      width: 1400,
      height: 1600,
    },
    {
      url: "/images/vinkl-regal-1.webp",
      altText: "VINKL teak corner shelf front view with books and plant",
      width: 800,
      height: 800,
    },
    {
      url: "/images/vinkl-regal-4.webp",
      altText: "VINKL shelves mounted at various wall angles",
      width: 1600,
      height: 1600,
    },
    {
      url: "/images/vinkl-regal-5.webp",
      altText: "VINKL corner shelf detail view",
      width: 1600,
      height: 1600,
    },
  ],
  variants: [
    {
      id: "gid://shopify/ProductVariant/vinkl-default",
      title: "Default",
      available: true,
      price: {
        amount: "299.00",
        currencyCode: "EUR",
      },
      compareAtPrice: null,
      selectedOptions: [{ name: "Size", value: "80 × 25 × 30 cm" }],
    },
  ],
  tags: ["shelf", "teak", "corner", "wall-mount", "adjustable"],
  productType: "Corner Wall Shelf",
  seo: {
    title: "VINKL — Adjustable Teak Corner Shelf",
    description:
      "Solid teak corner wall shelf with stepless invisible angle adjustment. Designed for real rooms.",
  },
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};
