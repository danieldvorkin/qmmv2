import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories($includeItems: Boolean) {
    categories(includeItems: $includeItems)
  }
`;

export const GET_CATEGORY = gql`
  query GetCategory($slug: String!) {
    category(slug: $slug){
      id
      longDesc
      name
      slug
      sort
      typeOf
      items {
        id
        name
        slug
        featuredItem
        price
        salePrice
        onSale
        inventory
        description
        strainType
        thumbnail
        category {
          id
          name
          slug
          typeOf
        }
      }
    }
  }
`;