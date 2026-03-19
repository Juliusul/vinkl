import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
  return Array.from(FLAGSHIP_SLUGS).map((slug) => ({ slug }));
}

// ── Resolve product from static data ──

function resolveProduct(slug: string, _locale: Locale): Product | null {
  if (slug === "vinkl") return vinklProduct;
  return null;
}

// ── Metadata ──

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = resolveProduct(slug, locale as Locale);

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

  const product = resolveProduct(slug, locale as Locale);

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
