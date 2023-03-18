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
import Product from "../components/Product";
import { LinkContainer } from "react-router-bootstrap";

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
          <LinkContainer to="/">
            <BreadcrumbLink href='#'>Home</BreadcrumbLink>
          </LinkContainer>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <LinkContainer to={'/category/' + category.slug}>
            <BreadcrumbLink href="#">{category.name}</BreadcrumbLink>
          </LinkContainer>
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
                <Product product={item} category={category} />
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