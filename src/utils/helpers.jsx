export const DISCOUNT_SETTINGS = {
  '50': 0, '100': 0, '150': 0,
  '200': 0.05, '300': 0.10, '400': 0.15,
  '600': 0.20, '800': 0.25, '1000': 0.30
}

export const getCartTotal = (items) => {
  let subtotal = 0;
  
  if(items?.length > 0){
    subtotal = items.map((curr) => getItemSubtotal(curr));
    return subtotal.reduce((total, current) => total = total + current);
  }
  
  return subtotal;
}

export const getItemSubtotal = (item) => {
  return item.product.price * item.quantity;
}

export const getVariant = (item) => {
  const { product, variant } = item;
  return product.variants.find((item) => item.quantity === parseFloat(variant));
}

export const getDiscountTotal = (items) => {
  let cartTotal = getCartTotal(items);
  
  if(cartTotal >= 100 && cartTotal < 150){
    return cartTotal * DISCOUNT_SETTINGS['150'];
  } else if(cartTotal >= 150 && cartTotal < 200){
    return cartTotal * DISCOUNT_SETTINGS['200'];
  } else if(cartTotal >= 200 && cartTotal < 300){
    return cartTotal * DISCOUNT_SETTINGS['300'];
  } else if(cartTotal >= 300 && cartTotal < 400){
    return cartTotal * DISCOUNT_SETTINGS['400'];
  } else if(cartTotal >= 400 && cartTotal < 600){
    return cartTotal * DISCOUNT_SETTINGS['600'];
  } else if(cartTotal >= 600 && cartTotal < 800){
    return cartTotal * DISCOUNT_SETTINGS['800'];
  } else if(cartTotal > 799){
    return cartTotal * DISCOUNT_SETTINGS['1000'];
  }

  return 0;
}

export const getGrandTotal = (items) => {
  return getCartTotal(items) - getDiscountTotal(items);
}