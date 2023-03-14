import { Button } from "@blueprintjs/core";
import { Text } from "@chakra-ui/react";
import React from "react";
import { Badge, Col, Row } from "react-bootstrap";
import Product from "../pages/Product";

const Products = (props) => {
  let { products, selectedFilter, resetFilter } = props;
  
  return (
    <>
      {!products ? (
        <Text>No Products Available</Text>
      ) : (
        <>
          {selectedFilter?.name?.length > 0 && (
            <Text style={{fontSize: 20}}>
              <Badge pill bg="info">
                {` ${selectedFilter?.name}`}
                <Button className="bp4-minimal" style={{ backgroundColor: 'transparent' }} icon="cross" onClick={resetFilter} />
              </Badge>
            </Text>
          )}
          
          <Row>
            {products && products.map((product) => {
              return (
                <Col xl={4} md={4} xs={6} key={product.id}>
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