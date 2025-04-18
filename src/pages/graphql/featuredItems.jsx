import { gql } from "@apollo/client";

export const GET_FEATURED_ITEMS = gql`
  query GetFeaturedItems {
    featuredItems {
      id
      name
      strainType
      description
      imgSrc
      slug
      description
      inventory
      onSale
      strainType
      price
      salePrice
      thumbnail
      category {
        id
        name
        slug
        typeOf
      }
    }
  }
`;