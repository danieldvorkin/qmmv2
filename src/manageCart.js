import { createSlice } from '@reduxjs/toolkit';
import { AppToaster } from "./toast";

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
  },
  reducers: {
    add: (state, params) => {
      if(state.cart.length > 0){
        let existingProduct = state.cart.find((item) => item.product?.id === params.payload.product.id);

        if(existingProduct){
          existingProduct.quantity += 1;
        } else {
          state.cart.push({quantity: 1, product: params.payload.product})
        }
      } else {
        state.cart.push({quantity: 1, product: params.payload.product})
      }
      let subtotal = state.cart.map((item) => item.quantity * (item.product.price || item.product.variants[0].price)).reduce((total, curr) => total = total + curr)
      AppToaster.show({ message: "Product successfully added to cart. Your new total is: $" + subtotal})
    },
    remove: (state, params) => {
      if(state.cart.length > 0){
        let existingProduct = state.cart.findIndex((item) => item.product?.id === params.payload);
        
        if(existingProduct > -1){
          state.cart.splice(existingProduct, 1);
        }
      }
    },
    updateQty: (state, params) => {
      let existingProduct = state.cart.find((item) => item.product?.id === params.payload.product_id);
      
      if(existingProduct)
        existingProduct.quantity = params.payload.qty
    }
  },
})

export const { add, remove, updateQty } = cartSlice.actions

export default cartSlice.reducer