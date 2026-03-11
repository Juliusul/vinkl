/**
 * Shared GraphQL fragments for Shopify Storefront API.
 * Reused across queries and mutations for consistency.
 */

export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

export const MONEY_FRAGMENT = /* GraphQL */ `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`;

export const PRODUCT_VARIANT_FRAGMENT = /* GraphQL */ `
  fragment ProductVariantFields on ProductVariant {
    id
    title
    availableForSale
    price {
      ...MoneyFields
    }
    compareAtPrice {
      ...MoneyFields
    }
    selectedOptions {
      name
      value
    }
  }
  ${MONEY_FRAGMENT}
`;

export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    tags
    productType
    createdAt
    updatedAt
    priceRange {
      minVariantPrice {
        ...MoneyFields
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFields
      }
    }
    images(first: 10) {
      edges {
        node {
          ...ImageFields
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          ...ProductVariantFields
        }
      }
    }
    seo {
      title
      description
    }
  }
  ${IMAGE_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`;

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...MoneyFields
      }
      totalAmount {
        ...MoneyFields
      }
      totalTaxAmount {
        ...MoneyFields
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              ...MoneyFields
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                title
                handle
                featuredImage {
                  ...ImageFields
                }
              }
            }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;
