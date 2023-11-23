import { createSlice } from '@reduxjs/toolkit';
import { AppToaster, ErrorToaster } from "./toast";

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
    isLoggedIn: false,
    user: null,
    token: null,
    activeCoupon: {}
  },
  reducers: {
    add: (state, params) => {
      if(state.cart.length > 0){
        let existingProduct = state.cart.find((item) => {
          return item.product?.id === params.payload.product.id
        });

        if(existingProduct){
          existingProduct.quantity += params.payload.quantity
        } else {
          state.cart.push({
            quantity: params.payload.quantity,
            product: params.payload.product
          })
        }
      } else {
        state.cart.push({
          quantity: params.payload.quantity,
          product: params.payload.product
        })
      }

      AppToaster.show({ message: "Product successfully added to cart."})
    },
    remove: (state, params) => {
      if(state.cart.length > 0){
        let existingProduct = state.cart.findIndex((item) => item.product?.id === params.payload.id);
        
        if(existingProduct > -1){
          state.cart.splice(existingProduct, 1);
        }
      }
    },
    updateQty: (state, params) => {
      let existingProduct = state.cart.find((item) => item.product?.id === params.payload.product_id);
      
      if(existingProduct)
        existingProduct.quantity = params.payload.qty
    },
    login: (state, response) => {
      if(response.payload.data.success){
        state.isLoggedIn = true
        state.user = response.payload.data.user
        state.token = response.payload.data.token
        AppToaster.show({ message: "You have successfully logged in."})
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      
      AppToaster.show({ message: "You have successfully logged out."})
    },
    loginError: (state, errors) => {
      ErrorToaster.show({ message: "Login attempt failed" });
    },
    finalizeOrder: (state, params) => {
      state.cart = [];
    },
    manageActiveCoupon: (state, params) => {
      if(params.payload.valid){
        state.activeCoupon = params.payload.coupon;
        AppToaster.show({ message: "Coupon successfully added to cart."})
      } else {
        state.activeCoupon = {};
        
      }
    },
    removeCoupon: (state, params) => {
      if(state.activeCoupon?.code?.length > 0){
        state.activeCoupon = {}
        AppToaster.show({ message: "Coupon removed" })
      }
    }
  },
})


export const { add, remove, updateQty, login, loginError, logout, finalizeOrder, manageActiveCoupon, removeCoupon } = cartSlice.actions
export const selectActiveCoupon = (state) => state.cart.activeCoupon
export default cartSlice.reducer