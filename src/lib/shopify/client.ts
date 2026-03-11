/**
 * Shopify Storefront API client.
 *
 * Single point of contact with the Storefront GraphQL API.
 * All queries and mutations go through this function.
 */

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;
const API_VERSION = "2024-10";

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

interface StorefrontResponse<T> {
  data: T;
  errors?: { message: string; locations?: { line: number; column: number }[] }[];
}

export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(
      `Shopify Storefront API error: ${response.status} ${response.statusText}`,
    );
  }

  const json: StorefrontResponse<T> = await response.json();

  if (json.errors) {
    throw new Error(
      `Shopify GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`,
    );
  }

  return json.data;
}
