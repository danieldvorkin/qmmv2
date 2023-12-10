import axios from "axios"

export const URL = "https://queenmarymedical.herokuapp.com/api/v1";

export const search = async (query, page, sort, dir) => {
  if(query?.length > 0){
    let url = URL + "/items/search?page=" + page + "&query=" + query
    
    if(Boolean(sort) && Boolean(dir))
      url += "&sort=" + sort + "&direction=" + dir
    
    return await axios.get(url).then((resp) => resp.data).catch((e) => {
      throw e
    });
  }
}

export const getCategories = async () => {
  return await axios.get(URL + "/categories").then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const getCategory = async (slug) => {
  return await axios.get(URL + "/categories/" + slug).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const featuredItems = async () => {
  return await axios.get(URL + "/items/featured_items").then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const getItem = async(slug) => {
  return await axios.get(URL + "/items/" + slug).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const getItems = async(page, typeOf) => {
  return await axios.get(URL + "/items?page=" + page +"&stypeof=" + typeOf).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const getItemsBySort = async(page, sort, direction) => {
  return await axios.get(URL + "/items?page=" + page + "&sort=" + sort + "&direction=" + direction).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const getAllItems = async() => {
  return await axios.get(URL + '/items/all').then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const getMyOrders = async(email) => {
  return await axios.get(URL + "/orders/my_orders?email=" + email).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const searchOrders = async(query, page, status) => {
  return await axios.get(URL + '/orders?page=' + page + "&status=" + status + "&query=" + query).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const loginUser = async (email, password) => {
  return await axios.post(URL + "/login", { email: email, password: password }).catch((e) => {
    throw e
  });
}

export const getOrders = async (page, status) => {
  return await axios.get(URL + "/orders?page=" + page + "&status=" + status).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const submitOrder = async (order) => {
  return await axios.post(URL + "/orders/create", order).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const updateOrder = async (order, params) => {
  return await axios.put(URL + "/orders/" + order.id + "/update", params).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const updateOrderStatus = async (order, params) => {
  return await axios.put(URL + "/orders/" + order.id + "/update_status", params).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const updateProduct = async (slug, params) => {
  // return await axios.put(URL + "/items/" + slug, params, {
  //   validateStatus: (status) => status >= 200 && status < 300,
  // }).then((resp) => resp.data).catch((e) => {
  //   throw e
  // });
  try {
    const response = await axios.put(URL + "/items/" + slug, params);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      const errorMessages = error.response.data.errors;
      console.error('422 Error:', errorMessages);
      throw error; // Re-throw the error to trigger the outer catch block
    } else {
      console.error('API Error:', error.message);
      throw error; // Re-throw the error to trigger the outer catch block
    }
  }
}

export const createProduct = async (params) => {
  return await axios.post(URL + "/items/new", params).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const removeLineItem = async (order, params) => {
  return await axios.post(URL + "/orders/" + order.id + "/remove_item", params).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const getOrder = async (orderId) => {
  return await axios.get(URL + '/orders/' + orderId).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const getOrdersById = async (userId) => {
  return await axios.get(URL + '/orders?user_id=' + userId).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const searchForUser = async (email) => {
  return await axios.get(URL + '/users/search?email=' + email).then((resp) => resp.data).catch((e) => {
    throw e
  });
}

export const uploadItemCoverPhoto = async(slug, params) => {
  return await axios.post(URL + "/items/upload_cover_photo/" + slug, params).then((resp) => resp.data).catch((e) => {
    throw e
  });
}
export const adminOrders = async(date) => {
  return await axios.get(URL + "/orders/orders_by_date?date=" + date).then((resp) => resp.data).catch((e) => {
    throw e
  });
}
