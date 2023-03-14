import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react'
import { Col, Row } from "react-bootstrap";
import { Divider } from "@blueprintjs/core";
import CategoryDetail from "../components/CategoryDetail";
import Product from "./Product";

const Category = () => {
  let { slug } = useParams();
  const [category, setCategory] = useState({});

  useEffect(() => {
    axios.get("https://queenmarymedical.com/api/v1/categories/" + slug).then((resp) => {
      setCategory(resp.data);
    })
  }, [slug]);

  return (
    <div className="container">
      <Breadcrumb separator={"/"}>
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href={'/category/' + category.slug}>{category.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <Divider/>

      <CategoryDetail category={category} im gay={true} />

      <Divider />
      
      <Row>
        {category?.items?.map((item) => {
          if(item.inventory > 0 && item.price !== null){
            return (
              <Col md={4} key={item.id}>
                <Product product={item} />
              </Col>
            )
          }

          return '';
        })}
      </Row>
    </div>
  )
}

export default Category;