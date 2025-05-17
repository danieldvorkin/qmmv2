import { defer } from "react-router-dom";
import { client } from "../../App";
import { GET_CATEGORIES, GET_CATEGORY } from "../graphql/categories";
import { GET_FEATURED_ITEMS } from "../graphql/featuredItems";

export async function loader({ request }) {
  const categories = client.query({
    query: GET_CATEGORIES
  }).then((response) => {
    return response.data.categories;
  }).catch((error) => {
    console.error("Error fetching categories:", error);
    return [];
  });

  let featuredItems = client.watchQuery({
    query: GET_FEATURED_ITEMS,
    pollInterval: 5000 // poll every 5 seconds
  }).result().then((response) => {
    return response.data.featuredItems;
  }).catch((error) => {
    console.error("Error fetching featured items:", error);
    return [];
  });

  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const type = url.searchParams.get("type");

  if (category && type) {
    featuredItems = client.query({
      query: GET_CATEGORY, variables: { slug: category }
    }).then((response) => {
      return response.data.category.items.filter(item => (
        item.strainType?.toLowerCase().includes(type) &&
          item.inventory > 0
      ));
    }).catch((error) => {
      console.error("Error fetching category products:", error);
      return [];
    });
  } else if (category) {
    featuredItems = client.query({
      query: GET_CATEGORY, variables: { slug: category }
    }).then((response) => {
      return response.data.category.items.filter(item => (
        item.inventory > 0
      ));
    }).catch((error) => {
      console.error("Error fetching category products:", error);
      return [];
    });
  } else if (type) {
    featuredItems = client.query({
      query: GET_FEATURED_ITEMS, variables: { type }
    }).then((response) => {
      return response.data.featuredItems.filter(item => (
        item.strainType?.toLowerCase().includes(type) &&
          item.inventory > 0
      ));
    }).catch((error) => {
      console.error("Error fetching type products:", error);
      return [];
    });
  }

  return defer({ categories, products: featuredItems });
}