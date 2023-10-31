import axios from "axios"

export const URL = "https://queenmarymedical.herokuapp.com/api/v1";

export const search = async (query, page, sort, dir) => {
  if(query?.length > 0){
    let url = URL + "/items/search?page=" + page + "&query=" + query
    
    if(Boolean(sort) && Boolean(dir))
      url += "&sort=" + sort + "&direction=" + dir
    
    return await axios.get(url).then((resp) => resp.data);
  }
}

export const getCategories = async () => {
  return await axios.get(URL + "/categories").then((resp) => resp.data);
}

export const getCategory = async (slug) => {
  return await axios.get(URL + "/categories/" + slug).then((resp) => resp.data);
}

export const featuredItems = async () => {
  return await axios.get(URL + "/items/featured_items").then((resp) => resp.data);
}

export const getItem = async(slug) => {
  return await axios.get(URL + "/items/" + slug).then((resp) => resp.data);
}

export const getItems = async(page, typeOf) => {
  return await axios.get(URL + "/items?page=" + page +"&stypeof=" + typeOf).then((resp) => resp.data);
}

export const getItemsBySort = async(page, sort, direction) => {
  return await axios.get(URL + "/items?page=" + page + "&sort=" + sort + "&direction=" + direction).then((resp) => resp.data);
}

export const getAllItems = async() => {
  return await axios.get(URL + '/items/all').then((resp) => resp.data);
}

export const getMyOrders = async(email) => {
  return await axios.get(URL + "/orders/my_orders?email=" + email).then((resp) => resp.data);
}

export const searchOrders = async(query, page, status) => {
  return await axios.get(URL + '/orders?page=' + page + "&status=" + status + "&query=" + query).then((resp) => resp.data);
}

export const loginUser = async (email, password) => {
  return await axios.post(URL + "/login", { email: email, password: password });
}

export const getOrders = async (page, status) => {
  return await axios.get(URL + "/orders?page=" + page + "&status=" + status).then((resp) => resp.data);
}

export const submitOrder = async (order) => {
  return await axios.post(URL + "/orders/create", order).then((resp) => resp.data);
}

export const updateOrder = async (order, params) => {
  return await axios.put(URL + "/orders/" + order.id + "/update", params).then((resp) => resp.data);
}

export const updateOrderStatus = async (order, params) => {
  return await axios.put(URL + "/orders/" + order.id + "/update_status", params).then((resp) => resp.data);
}

export const updateProduct = async (slug, params) => {
  return await axios.put(URL + "/items/" + slug, params).then((resp) => resp.data);
}

export const removeLineItem = async (order, params) => {
  return await axios.post(URL + "/orders/" + order.id + "/remove_item", params).then((resp) => resp.data);
}

export const getOrder = async (orderId) => {
  return await axios.get(URL + '/orders/' + orderId).then((resp) => resp.data);
}

export const getOrdersById = async (userId) => {
  return await axios.get(URL + '/orders?user_id=' + userId).then((resp) => resp.data);
}

export const searchForUser = async (email) => {
  return await axios.get(URL + '/users/search?email=' + email).then((resp) => resp.data);
}

