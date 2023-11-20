import { gql } from '@apollo/client';

export const GET_COUPONS = gql`
  query GetCoupons {
    coupons {
      id
      amount
      code
      percentage
      limit
      unlimitedUses
      used
      expiration
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_COUPON = gql`
  mutation CreateCoupon(
    $amount: Int
    $percentage: Int
    $limit: Int
    $unlimitedUses: Boolean
    $used: Int
    $expiration: String
  ) {
    createCoupon(
      amount: $amount
      percentage: $percentage
      limit: $limit
      unlimitedUses: $unlimitedUses
      used: $used
      expiration: $expiration
    ) {
      id
      amount
      percentage
      limit
      unlimitedUses
      used
      expiration
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COUPON = gql`
  mutation UpdateCoupon(
    $id: ID!
    $amount: Int
    $percentage: Int
    $limit: Int
    $unlimitedUses: Boolean
    $used: Int
    $expiration: String
  ) {
    updateCoupon(
      id: $id
      amount: $amount
      percentage: $percentage
      limit: $limit
      unlimitedUses: $unlimitedUses
      used: $used
      expiration: $expiration
    ) {
      id
      amount
      percentage
      limit
      unlimitedUses
      used
      expiration
      createdAt
      updatedAt
    }
  }
`;