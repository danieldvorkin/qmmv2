import { gql } from '@apollo/client';

export const GET_COUPONS = gql`
  query GetCoupons {
    coupons {
      id
      amount
      code
      active
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

export const GET_COUPON = gql`
  query GetCoupon($id: ID!){
    coupon(id: $id){
      id
      code
      amount
      limit
      percentage
      expiration
      unlimitedUses
      active
      used
    }
  }
`;

export const CREATE_COUPON = gql`
  mutation CreateCoupon(
    $code: String!
    $amount: Float!
    $percentage: Boolean!
    $limit: Int!
    $unlimitedUses: Boolean!
    $expiration: ISO8601Date!
  ) {
    createCoupon(
      code: $code
      amount: $amount
      percentage: $percentage
      limit: $limit
      unlimitedUses: $unlimitedUses
      expiration: $expiration
      active: true
    ) {
      id
      code
      amount
      percentage
      limit
      unlimitedUses
      used
      active
      expiration
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COUPON = gql`
  mutation UpdateCoupon(
    $id: ID!
    $code: String!
    $amount: Float!
    $percentage: Boolean!
    $limit: Int!
    $unlimitedUses: Boolean!
    $expiration: ISO8601Date!
    $active: Boolean!
  ) {
    updateCoupon(
      id: $id
      code: $code
      amount: $amount
      percentage: $percentage
      limit: $limit
      unlimitedUses: $unlimitedUses
      expiration: $expiration
      active: $active
    ) {
      id
      amount
      code
      percentage
      limit
      unlimitedUses
      active
      used
      expiration
      createdAt
      updatedAt
    }
  }
`;

export const DEACTIVATE_COUPON = gql`
  mutation DeactivateCoupon($id: ID!) {
    deactivateCoupon(id: $id){
      id
    }
  }
`;

export const REACTIVATE_COUPON = gql`
  mutation ReactivateCoupon($id: ID!){
    reactivateCoupon(id: $id){
      id
    }
  }
`;

export const DELETE_COUPON = gql`
  mutation DeleteCoupon($id: ID!){
    destroyCoupon(id: $id){
      id
    }
  }
`;