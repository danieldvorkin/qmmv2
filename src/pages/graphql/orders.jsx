import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
  query GetOrders($statuses: [String!]) {
    orders(statuses: $statuses) {
      id
      status
      total
      submittedAt
      user {
        id
        email
      }
      lineItems {
        quantity
        item {
          id
          name
          price
        }
      }
    }
  }
`;