export const DISCOUNT_SETTINGS = {
  '50': 0, '100': 0, '150': 0,
  '200': 0.05, '300': 0.10, '400': 0.15,
  '600': 0.20, '800': 0.25, '1000': 0.30
}

export const getOrderTotal = (items) => {
  if(items && items.length > 0){
    let totals = items.map((item) => {
      if(Boolean(item.item.price)){
        let price = item.item.on_sale ? item.item.sale_price : item.item.price;

        return parseFloat(price) * parseFloat(item.quantity)
      } else {
        let variant = item.item.variants.filter((v) => v.quantity === item.quantity)[0];

        if(variant){
          return parseFloat(variant.price) * parseFloat(item.quantity)
        } else {
          return 0
        }
      }
    });

    let finalTotal = totals.reduce((tot, cur) => tot = tot + cur);
    if(finalTotal < 100){
      return finalTotal + 10;
    }

    return finalTotal;
  } else {
    return 0;
  }
}

export const getOrderDiscount = (items, coupon) => {
  if(items && items.length > 0) {
    let orderTotal = getOrderTotal(items);
    
    if(coupon && Object.keys(coupon).length > 0){
      if(coupon.percentage){
        return orderTotal * (coupon.amount / 100);
      } else {
        return orderTotal - coupon.amount;
      }
    } else {
      if(orderTotal >= 100 && orderTotal < 150){
        return orderTotal * DISCOUNT_SETTINGS['150'];
      } else if(orderTotal >= 150 && orderTotal < 200){
        return orderTotal * DISCOUNT_SETTINGS['200'];
      } else if(orderTotal >= 200 && orderTotal < 300){
        return orderTotal * DISCOUNT_SETTINGS['300'];
      } else if(orderTotal >= 300 && orderTotal < 400){
        return orderTotal * DISCOUNT_SETTINGS['400'];
      } else if(orderTotal >= 400 && orderTotal < 600){
        return orderTotal * DISCOUNT_SETTINGS['600'];
      } else if(orderTotal >= 600 && orderTotal < 800){
        return orderTotal * DISCOUNT_SETTINGS['800'];
      } else if(orderTotal > 799){
        return orderTotal * DISCOUNT_SETTINGS['1000'];
      }  
    }
  }

  return 0;
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
  if(item.product.price){
    if(item.product?.on_sale || item.product?.onSale){
      return (item.product.sale_price || item.product.salePrice) * item.quantity;
    } else {
      return item.product.price * item.quantity;
    }
  } else {
    let variants = item.product.variants.filter((v) => v.quantity === item.quantity);

    if(variants.length > 0){
      return variants[0].price;
    } else {
      return 0;
    }
  }
}

export const getVariant = (item) => {
  const { product, variant } = item;
  return product.variants.find((item) => item.quantity === parseFloat(variant));
}

export const getDiscountTotal = (items, activeCoupon) => {
  let cartTotal = getCartTotal(items);

  if(activeCoupon && Object.keys(activeCoupon).length > 0){
    if(activeCoupon.percentage){
      return cartTotal * (activeCoupon.amount / 100);
    } else {
      return cartTotal - activeCoupon.amount;
    }
  } else {
    if(cartTotal >= 100 && cartTotal < 150){
      return DISCOUNT_SETTINGS['150'];
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
  }

  return 0;
}

export const getDiscountPercent = (items) => {
  let cartTotal = getCartTotal(items);
  
  if(cartTotal >= 100 && cartTotal < 150){
    return DISCOUNT_SETTINGS['150'];
  } else if(cartTotal >= 150 && cartTotal < 200){
    return DISCOUNT_SETTINGS['200'];
  } else if(cartTotal >= 200 && cartTotal < 300){
    return DISCOUNT_SETTINGS['300'];
  } else if(cartTotal >= 300 && cartTotal < 400){
    return DISCOUNT_SETTINGS['400'];
  } else if(cartTotal >= 400 && cartTotal < 600){
    return DISCOUNT_SETTINGS['600'];
  } else if(cartTotal >= 600 && cartTotal < 800){
    return DISCOUNT_SETTINGS['800'];
  } else if(cartTotal > 799){
    return DISCOUNT_SETTINGS['1000'];
  }

  return null;
}

export const getItemDiscount = (item, items) => {
  const discount = getDiscountPercent(items);
  const newTotal = getItemSubtotal(item) - (getItemSubtotal(item) * discount);
  
  return `$${newTotal}`
}

export const getGrandTotal = (items, activeCoupon) => {
  return getCartTotal(items) - getDiscountTotal(items, activeCoupon) + (getCartTotal(items) < 100 ? 10 : 0);
}

// Orders Table helpers
export const getTableGrandTotal = (items, coupon) => {
  return getTableTotal(items) - getTableDiscountTotal(items, coupon) + (getTableTotal(items) < 100 ? 10 : 0);
}

export const getTableTotal = (items) => {
  let subtotal = 0;
  
  if(items?.length > 0){
    subtotal = items.map((curr) => getTableItemSubtotal(curr));
    return subtotal.reduce((total, current) => total = total + current) ;
  } else {
    return 0;
  }
}

export const getTableItemSubtotal = (item) => {
  if(item.item.price){
    if(item.item?.on_sale || item.item?.onSale){
      return (item.item.sale_price || item.item.salePrice) * item.quantity;
    } else {
      return item.item.price * item.quantity;
    }
  } else {
    return 0;
  }
}

export const getTableDiscountTotal = (items, coupon) => {
  let cartTotal = getTableTotal(items);
  
  if(coupon && Object.keys(coupon).length > 0){
    if(coupon.percentage){
      return cartTotal * (coupon.amount / 100);
    } else {
      return cartTotal - coupon.amount;
    }
  } else {
    if(cartTotal >= 100 && cartTotal < 150){
      return DISCOUNT_SETTINGS['150'];
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
  }

  return 0;
}
