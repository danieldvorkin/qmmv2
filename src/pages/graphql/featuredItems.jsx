import { gql } from "@apollo/client";

export const GET_FEATURED_ITEMS = gql`
  query GetFeaturedItems {
    featuredItems {
      id
      name
      strainType
      description
      imgSrc
      coverPhoto
      slug
      description
      inventory
      onSale
      strainType
      price
      salePrice
      category {
        id
        name
        slug
        typeOf
      }
    }
  }
`;