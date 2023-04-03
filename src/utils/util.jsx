import axios from "axios"

export const URL = "https://queenmarymedical.herokuapp.com/api/v1";

export const search = async (query) => {
  if(query?.length > 0){
    return await axios.get(URL + "/items/search?query=" + query).then((resp) => resp.data);
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

export const getMyOrders = async(email) => {
  return await axios.get(URL + "/orders/my_orders?email=" + email).then((resp) => resp.data);
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

export const getOrder = async (orderId) => {
  return await axios.get(URL + '/orders/' + orderId).then((resp) => resp.data);
}
