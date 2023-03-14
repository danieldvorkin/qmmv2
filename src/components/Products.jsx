import { Text } from "@chakra-ui/react";
import React from "react";
import { Col, Row } from "react-bootstrap";
import Product from "../pages/Product";

const Products = (props) => {
  let { products, selectedFilter } = props;

  return (
    <>
      {!products ? (
        <Text>No Products Available</Text>
      ) : (
        <>
          <Text>Selected Filter: {selectedFilter}</Text>
          <Row>
            {products && products.map((product) => {
              return (
                <Col xl={3} key={product.id}>
                  <Product product={product} />
                </Col>
              )
            })}
          </Row>
        </>
      )}
    </>
  )
}
export default Products;