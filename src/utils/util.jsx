import axios from "axios"

export const URL = "https://queenmarymedical.com/api/v1";

export const search = async (query) => {
  if(query?.length > 0){
    return await axios.get(URL + "/items/search?query=" + query).then((resp) => resp.data);
  }
}

export const getCategories = async () => {
  return await axios.get(URL + "/categories").then((resp) => resp.data);
}

export const getCategory = async (slug) => {
  return await axios.get(URL + "/categories/" + slug).then((resp) => resp.data.items);
}

export const featuredItems = async () => {
  return await axios.get(URL + "/items/featured_items").then((resp) => resp.data);
}

export const getItem = async(slug) => {
  return await axios.get(URL + "/items/" + slug).then((resp) => resp.data);
}
