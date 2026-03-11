import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { getProducts } from "@/lib/shopify";
import { ObjectGrid } from "@/components/objects/object-grid";
import { vinklProduct } from "@/data/products/vinkl";
import type { Locale } from "@/config/i18n";
import type { Product } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "objects" });

  return {
    title: t("title"),
  };
}

export default async function ObjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let products: Product[];

  try {
    products = await getProducts(locale as Locale);
  } catch {
    // Shopify not configured — fall back to static flagship products
    products = [];
  }

  // Always ensure flagship products are visible, even without Shopify
  if (!products.some((p) => p.slug === "vinkl")) {
    products = [vinklProduct, ...products];
  }

  return <ObjectsContent products={products} />;
}

function ObjectsContent({ products }: { products: Product[] }) {
  const t = useTranslations("objects");

  return (
    <section className="px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <h1 className="font-serif text-3xl font-light tracking-tight md:text-4xl">
          {t("title")}
        </h1>

        {products.length > 0 ? (
          <div className="mt-12">
            <ObjectGrid products={products} />
          </div>
        ) : (
          <p className="mt-12 text-ink-secondary">{t("empty")}</p>
        )}
      </div>
    </section>
  );
}
