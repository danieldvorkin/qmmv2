import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Item from "../components/Item";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider
} from '@chakra-ui/react'

const Product = () => {
  let { slug } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/items/" + slug).then((resp) => setProduct(resp.data));
  }, [slug]);

  return (
    <div className="container">
      <Breadcrumb separator={"/"}>
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href={'/category/' + product?.category?.slug}>{product?.category?.name}</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href={'/products/' + product.slug}>{product.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Divider/>
      <div className="item-container">
        <Item item={product} />
      </div>
    </div>
  )
}

export default Product;