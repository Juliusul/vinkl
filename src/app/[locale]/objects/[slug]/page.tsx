import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProduct, getProducts } from "@/lib/shopify";
import { ProductPage } from "@/components/product/product-page";
import { ObjectDetail } from "@/components/objects/object-detail";
import { ProductSchema } from "@/components/seo/product-schema";
import { vinklProduct } from "@/data/products/vinkl";
import type { Locale } from "@/config/i18n";
import type { Product } from "@/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// ── Slugs that get the flagship editorial experience ──

const FLAGSHIP_SLUGS = new Set(["vinkl"]);

// ── Static params: pre-render known product slugs ──

export async function generateStaticParams() {
  const slugs = new Set<string>();

  // Always include flagship products
  FLAGSHIP_SLUGS.forEach((slug) => slugs.add(slug));

  // Add Shopify products if available
  try {
    const products = await getProducts("de");
    products.forEach((p) => slugs.add(p.slug));
  } catch {
    // Shopify not configured — flagship only
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

// ── Resolve product data: Shopify first, static fallback for flagships ──

async function resolveProduct(
  slug: string,
  locale: Locale,
): Promise<Product | null> {
  // Try Shopify first
  try {
    const shopifyProduct = await getProduct(slug, locale);
    if (shopifyProduct) return shopifyProduct;
  } catch {
    // Shopify unavailable — fall through
  }

  // Static fallback for flagship products
  if (slug === "vinkl") return vinklProduct;

  return null;
}

// ── Metadata ──

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await resolveProduct(slug, locale as Locale);

  if (!product) {
    const t = await getTranslations({ locale, namespace: "product" });
    return { title: t("notFound") };
  }

  const seoTitle = product.seo.title ?? `${product.title} — VINKL`;
  const seoDescription = product.seo.description ?? product.description;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: product.images[0]
        ? [
            {
              url: product.images[0].url,
              width: product.images[0].width,
              height: product.images[0].height,
              alt: product.images[0].altText,
            },
          ]
        : [],
    },
  };
}

// ── Page ──

export default async function ObjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await resolveProduct(slug, locale as Locale);

  if (!product) {
    notFound();
  }

  const isFlagship = FLAGSHIP_SLUGS.has(slug);

  return (
    <>
      <ProductSchema product={product} locale={locale as Locale} />
      {isFlagship ? (
        <ProductPage product={product} />
      ) : (
        <ObjectDetail product={product} />
      )}
    </>
  );
}
