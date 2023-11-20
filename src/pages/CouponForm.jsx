import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_COUPON, UPDATE_COUPON } from './graphql/coupons';

const CouponForm = ({ initialValues, onCancel, onCompleted }) => {
  const [couponData, setCouponData] = useState({
    code: initialValues ? initialValues.code : '',
    discount: initialValues ? initialValues.discount : 0,
    // Add other fields as needed
  });

  const [createCoupon] = useMutation(CREATE_COUPON, {
    onCompleted: (data) => {
      console.log('Coupon created:', data.createCoupon);
      onCompleted();
    },
  });

  const [updateCoupon] = useMutation(UPDATE_COUPON, {
    onCompleted: (data) => {
      console.log('Coupon updated:', data.updateCoupon);
      onCompleted();
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const variables = {
      // Pass the necessary variables based on your mutation
      code: couponData.code,
      discount: couponData.discount,
      // Add other variables as needed
    };

    if (initialValues) {
      // If initialValues exist, it's an update
      variables.id = initialValues.id;
      await updateCoupon({ variables });
    } else {
      // Otherwise, it's a create
      await createCoupon({ variables });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Code:
        <input type="text" name="code" value={couponData.code} onChange={handleInputChange} />
      </label>
      <label>
        Discount:
        <input
          type="number"
          name="discount"
          value={couponData.discount}
          onChange={handleInputChange}
        />
      </label>
      {/* Add other form fields as needed */}
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default CouponForm;