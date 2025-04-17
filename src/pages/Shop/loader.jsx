import { client } from "../../App";
import { GET_CATEGORIES } from "../graphql/categories";
import { GET_FEATURED_ITEMS } from "../graphql/featuredItems";

export async function loader() {
  const featuredItems = await client.query({
    query: GET_FEATURED_ITEMS
  }).then((res) => {
    return res.data.featuredItems;
  }).catch((err) => {
    console.error("Error fetching featured items:", err);
    return [];
  });

  const categories = await client.query({
    query: GET_CATEGORIES,
    variables: { includeItems: true }
  }).then((res) => {
    return res.data.categories;
  }).catch((err) => {
    console.error("Error fetching categories data:", err);
    return [];
  });

  if (featuredItems && categories) {
    return { featuredItems, categories };
  }

  console.error("Error fetching data");
  return null;
}