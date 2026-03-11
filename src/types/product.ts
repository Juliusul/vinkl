/** App-level product type — decoupled from Shopify's shape */
export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  descriptionHtml: string;
  price: Money;
  compareAtPrice: Money | null;
  currency: string;
  available: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  productType: string;
  seo: ProductSeo;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  available: boolean;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: { name: string; value: string }[];
}

export interface ProductImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductSeo {
  title: string | null;
  description: string | null;
}
