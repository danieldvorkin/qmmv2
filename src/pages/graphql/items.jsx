import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts {
    items {
      id
      name
      createdAt
      inventory
      slug
      description
      salePrice
      price
      onSale
      updatedAt
    }
  }
`;