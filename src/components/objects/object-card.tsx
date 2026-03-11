import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils/format-price";
import type { Product } from "@/types";
import type { Locale } from "@/config/i18n";

interface ObjectCardProps {
  product: Product;
}

export function ObjectCard({ product }: ObjectCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("objects");
  const image = product.images[0];

  return (
    <Link href={`/objects/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-warm">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-opacity duration-[--duration-normal] ease-[--ease-out] group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-ink-tertiary">No image</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-ink-primary">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-ink-secondary">
          {t("from")} {formatPrice(product.price, locale)}
        </p>
      </div>
    </Link>
  );
}
