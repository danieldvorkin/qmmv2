import { createSlice } from '@reduxjs/toolkit';
import { AppToaster, ErrorToaster } from "./toast";

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
    isLoggedIn: false,
    user: null,
    token: null
  },
  reducers: {
    add: (state, params) => {
      if(state.cart.length > 0){
        let existingProduct = state.cart.find((item) => {
          return item.product?.id === params.payload.product.id &&
            item.variant == (params.payload.variant || params.payload.quantity)
        });

        if(existingProduct){
          existingProduct.quantity += 1
        } else {
          state.cart.push({
            quantity: 1,
            variant: params.payload.quantity, 
            product: params.payload.product
          })
        }
      } else {
        state.cart.push({
          quantity: 1,
          variant: params.payload.quantity, 
          product: params.payload.product
        })
      }

      AppToaster.show({ message: "Product successfully added to cart."})
    },
    remove: (state, params) => {
      if(state.cart.length > 0){
        let existingProduct = state.cart.findIndex((item) => item.product?.id === params.payload.id && item.variant == params.payload.variant);
        
        if(existingProduct > -1){
          state.cart.splice(existingProduct, 1);
        }
      }
    },
    updateQty: (state, params) => {
      let existingProduct = state.cart.find((item) => item.product?.id === params.payload.product_id && item.variant == params.payload.variant);
      
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
    loginError: (state, errors) => {
      ErrorToaster.show({ message: "Login attempt failed" });
    },
    logout: (state, params) => {
      state.isLoggedIn = false
      state.user = null
      state.token = null
    },
    finalizeOrder: (state, params) => {
      state.cart = []
    }
  },
})


export const { add, remove, updateQty, login, loginError, logout, finalizeOrder } = cartSlice.actions

export default cartSlice.reducer