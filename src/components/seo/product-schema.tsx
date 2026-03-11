import type { Product } from "@/types";
import type { Locale } from "@/config/i18n";

interface ProductSchemaProps {
  product: Product;
  locale: Locale;
}

/**
 * JSON-LD structured data for product pages.
 *
 * Implements Schema.org Product type for rich search results.
 * Includes material, dimensions, weight, and brand info
 * for maximum search visibility.
 *
 * Rendered as a server component — zero client JS.
 *
 * @see https://schema.org/Product
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 */
export function ProductSchema({ product, locale }: ProductSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinkl.com";
  const productUrl = `${siteUrl}/${locale}/objects/${product.slug}`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    url: productUrl,
    image: product.images.length > 0
      ? product.images.map((img) => img.url)
      : [`${siteUrl}/images/vinkl-regal-3.webp`],
    brand: {
      "@type": "Brand",
      name: "VINKL",
    },
    manufacturer: {
      "@type": "Organization",
      name: "VINKL",
      url: siteUrl,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: product.price.currencyCode,
      price: product.price.amount,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "VINKL",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "DE",
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "EUR",
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
      },
    },
  };

  // Add VINKL-specific structured attributes if this is the vinkl product
  if (product.slug === "vinkl") {
    schema.material = "Teak";
    schema.weight = {
      "@type": "QuantitativeValue",
      value: "4.8",
      unitCode: "KGM",
    };
    schema.width = {
      "@type": "QuantitativeValue",
      value: "80",
      unitCode: "CMT",
    };
    schema.depth = {
      "@type": "QuantitativeValue",
      value: "25",
      unitCode: "CMT",
    };
    schema.height = {
      "@type": "QuantitativeValue",
      value: "30",
      unitCode: "CMT",
    };
    schema.additionalProperty = [
      {
        "@type": "PropertyValue",
        name: "Adjustment",
        value: "Stepless, any angle",
      },
      {
        "@type": "PropertyValue",
        name: "Load Capacity",
        value: "15 kg",
      },
      {
        "@type": "PropertyValue",
        name: "Mounting Type",
        value: "Concealed wall mount",
      },
    ];
  }

  if (product.seo.description) {
    schema.disambiguatingDescription = product.seo.description;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
