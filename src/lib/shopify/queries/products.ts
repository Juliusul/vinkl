import { PRODUCT_FRAGMENT } from "../fragments";

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int = 20, $language: LanguageCode)
    @inContext(language: $language) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          ...ProductFields
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!, $language: LanguageCode)
    @inContext(language: $language) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;
