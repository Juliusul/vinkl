/**
 * Mappers: Shopify raw types → App domain types.
 *
 * This is the boundary layer. If Shopify ever changes its API shape
 * or we switch providers, only this file needs updating.
 */

import type { Product, ProductVariant, ProductImage, Money } from "@/types";
import type {
  ShopifyProduct,
  ShopifyProductVariant,
  ShopifyImage,
  ShopifyMoney,
  ShopifyCart,
  ShopifyConnection,
} from "./types";
import type { Cart, CartLine } from "@/types/cart";

// ── Helpers ──

function extractNodes<T>(connection: ShopifyConnection<T>): T[] {
  return connection.edges.map((edge) => edge.node);
}

function mapMoney(money: ShopifyMoney): Money {
  return {
    amount: money.amount,
    currencyCode: money.currencyCode,
  };
}

function mapImage(image: ShopifyImage): ProductImage {
  return {
    url: image.url,
    altText: image.altText ?? "",
    width: image.width,
    height: image.height,
  };
}

// ── Product mappers ──

function mapVariant(variant: ShopifyProductVariant): ProductVariant {
  return {
    id: variant.id,
    title: variant.title,
    available: variant.availableForSale,
    price: mapMoney(variant.price),
    compareAtPrice: variant.compareAtPrice
      ? mapMoney(variant.compareAtPrice)
      : null,
    selectedOptions: variant.selectedOptions,
  };
}

export function mapProduct(shopifyProduct: ShopifyProduct): Product {
  const images = extractNodes(shopifyProduct.images).map(mapImage);
  const variants = extractNodes(shopifyProduct.variants).map(mapVariant);

  return {
    id: shopifyProduct.id,
    slug: shopifyProduct.handle,
    title: shopifyProduct.title,
    description: shopifyProduct.description,
    descriptionHtml: shopifyProduct.descriptionHtml,
    price: mapMoney(shopifyProduct.priceRange.minVariantPrice),
    compareAtPrice:
      parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount) > 0
        ? mapMoney(shopifyProduct.compareAtPriceRange.minVariantPrice)
        : null,
    currency: shopifyProduct.priceRange.minVariantPrice.currencyCode,
    available: shopifyProduct.availableForSale,
    images,
    variants,
    tags: shopifyProduct.tags,
    productType: shopifyProduct.productType,
    seo: {
      title: shopifyProduct.seo.title,
      description: shopifyProduct.seo.description,
    },
    createdAt: shopifyProduct.createdAt,
    updatedAt: shopifyProduct.updatedAt,
  };
}

export function mapProducts(
  connection: ShopifyConnection<ShopifyProduct>,
): Product[] {
  return extractNodes(connection).map(mapProduct);
}

// ── Cart mappers ──

export function mapCart(shopifyCart: ShopifyCart): Cart {
  const lines: CartLine[] = extractNodes(shopifyCart.lines).map((line) => ({
    id: line.id,
    quantity: line.quantity,
    cost: {
      totalAmount: mapMoney(line.cost.totalAmount),
    },
    merchandise: {
      id: line.merchandise.id,
      title: line.merchandise.title,
      selectedOptions: line.merchandise.selectedOptions,
      product: {
        title: line.merchandise.product.title,
        slug: line.merchandise.product.handle,
        featuredImage: line.merchandise.product.featuredImage
          ? mapImage(line.merchandise.product.featuredImage)
          : null,
      },
    },
  }));

  return {
    id: shopifyCart.id,
    checkoutUrl: shopifyCart.checkoutUrl,
    totalQuantity: shopifyCart.totalQuantity,
    cost: {
      subtotalAmount: mapMoney(shopifyCart.cost.subtotalAmount),
      totalAmount: mapMoney(shopifyCart.cost.totalAmount),
      totalTaxAmount: shopifyCart.cost.totalTaxAmount
        ? mapMoney(shopifyCart.cost.totalTaxAmount)
        : null,
    },
    lines,
  };
}
