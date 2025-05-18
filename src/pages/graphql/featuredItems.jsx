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
      featuredItem
      strainType
      price
      salePrice
      thumbnail
      createdAt
      updatedAt
      category {
        id
        name
        slug
        typeOf
      }
    }
  }
`;