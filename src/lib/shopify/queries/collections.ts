import { PRODUCT_FRAGMENT } from "../fragments";

export const COLLECTION_BY_HANDLE_QUERY = /* GraphQL */ `
  query CollectionByHandle(
    $handle: String!
    $first: Int = 20
    $language: LanguageCode
  ) @inContext(language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;
