import { Button } from "@blueprintjs/core";
import { Text } from "@chakra-ui/react";
import React from "react";
import { Badge, Col, Row } from "react-bootstrap";
import Product from "./Product";

const Products = (props) => {
  let { products, selectedFilter, resetFilter } = props;
  
  return (
    <>
      {!products ? (
        <Text>No Products Available</Text>
      ) : (
        <div>
          {selectedFilter?.name?.length > 0 && (
            <Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10}}>
              <Badge bg="info" style={{paddingRight: 5}}>
                {` ${selectedFilter?.name}`}
                <Button className="bp4-minimal" style={{ backgroundColor: 'transparent' }} icon="cross" onClick={resetFilter} />
              </Badge>
            </Text>
          )}
          
          <Row>
            {products && products.map((product) => {
              if(product?.price > 0 && product?.inventory > 0) {
                return (
                  <Col xl={3} lg={4} md={6} xs={12} key={product.id}>
                    <Product product={product} category={selectedFilter} />
                  </Col>
                )
              }
            })}
          </Row>
        </div>
      )}
    </>
  )
}
export default Products;