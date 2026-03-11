/**
 * Raw Shopify Storefront API GraphQL response types.
 * These mirror the Shopify schema — never used outside lib/shopify/.
 */

// ── Generic ──

export interface ShopifyConnection<T> {
  edges: { node: T; cursor: string }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

// ── Products ──

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
  productType: string;
  createdAt: string;
  updatedAt: string;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
  };
  images: ShopifyConnection<ShopifyImage>;
  variants: ShopifyConnection<ShopifyProductVariant>;
  seo: {
    title: string | null;
    description: string | null;
  };
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: { name: string; value: string }[];
}

// ── Cart ──

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
    totalTaxAmount: ShopifyMoney | null;
  };
  lines: ShopifyConnection<ShopifyCartLine>;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyMoney;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    product: {
      title: string;
      handle: string;
      featuredImage: ShopifyImage | null;
    };
  };
}

// ── API Responses ──

export interface ShopifyProductsResponse {
  products: ShopifyConnection<ShopifyProduct>;
}

export interface ShopifyProductResponse {
  product: ShopifyProduct | null;
}

export interface ShopifyCartResponse {
  cart: ShopifyCart | null;
}

export interface ShopifyCartCreateResponse {
  cartCreate: {
    cart: ShopifyCart;
    userErrors: { field: string[]; message: string }[];
  };
}

export interface ShopifyCartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart;
    userErrors: { field: string[]; message: string }[];
  };
}

export interface ShopifyCartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart;
    userErrors: { field: string[]; message: string }[];
  };
}

export interface ShopifyCartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart;
    userErrors: { field: string[]; message: string }[];
  };
}
