/**
 * Shopify integration — public API.
 *
 * This is the ONLY import other files should use:
 *   import { getProducts, getProduct, createCart, addToCart } from "@/lib/shopify";
 *
 * The underlying GraphQL queries, raw types, and mappers are implementation details.
 */

import type { Locale } from "@/config/i18n";
import type { Product } from "@/types";
import type { Cart } from "@/types/cart";
import type {
  ShopifyProductsResponse,
  ShopifyProductResponse,
  ShopifyCartCreateResponse,
  ShopifyCartLinesAddResponse,
  ShopifyCartLinesUpdateResponse,
  ShopifyCartLinesRemoveResponse,
} from "./types";
import { storefront } from "./client";
import { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY } from "./queries";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
} from "./mutations";
import { mapProducts, mapProduct, mapCart } from "./mappers";

// ── Locale → Shopify language code ──

function toShopifyLanguage(locale: Locale): string {
  const map: Record<Locale, string> = {
    de: "DE",
    en: "EN",
  };
  return map[locale];
}

// ── Products ──

export async function getProducts(
  locale: Locale,
  first: number = 20,
): Promise<Product[]> {
  const data = await storefront<ShopifyProductsResponse>(PRODUCTS_QUERY, {
    first,
    language: toShopifyLanguage(locale),
  });

  return mapProducts(data.products);
}

export async function getProduct(
  slug: string,
  locale: Locale,
): Promise<Product | null> {
  const data = await storefront<ShopifyProductResponse>(
    PRODUCT_BY_HANDLE_QUERY,
    {
      handle: slug,
      language: toShopifyLanguage(locale),
    },
  );

  if (!data.product) return null;
  return mapProduct(data.product);
}

// ── Cart ──

export async function createCart(): Promise<Cart> {
  const data = await storefront<ShopifyCartCreateResponse>(
    CART_CREATE_MUTATION,
    { input: {} },
  );

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(
      `Cart creation failed: ${data.cartCreate.userErrors.map((e) => e.message).join(", ")}`,
    );
  }

  return mapCart(data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1,
): Promise<Cart> {
  const data = await storefront<ShopifyCartLinesAddResponse>(
    CART_LINES_ADD_MUTATION,
    {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  );

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(
      `Add to cart failed: ${data.cartLinesAdd.userErrors.map((e) => e.message).join(", ")}`,
    );
  }

  return mapCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const data = await storefront<ShopifyCartLinesUpdateResponse>(
    CART_LINES_UPDATE_MUTATION,
    {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  );

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(
      `Update cart failed: ${data.cartLinesUpdate.userErrors.map((e) => e.message).join(", ")}`,
    );
  }

  return mapCart(data.cartLinesUpdate.cart);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const data = await storefront<ShopifyCartLinesRemoveResponse>(
    CART_LINES_REMOVE_MUTATION,
    { cartId, lineIds },
  );

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(
      `Remove from cart failed: ${data.cartLinesRemove.userErrors.map((e) => e.message).join(", ")}`,
    );
  }

  return mapCart(data.cartLinesRemove.cart);
}
