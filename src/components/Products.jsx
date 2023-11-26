import { Button } from "@blueprintjs/core";
import { Text } from "@chakra-ui/react";
import React from "react";
import { Badge, Col, Row } from "react-bootstrap";
import Product from "./Product";

const Products = (props) => {
  let { products, selectedFilter, resetFilter, typeFilter, resetTypeFilter, emptyCategoryError } = props;
  console.log("Selected Filter: ", selectedFilter);
  return (
    <div>
      <div style={{display: 'flex'}}>
        {selectedFilter?.name?.length > 0 && (
          <Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10}}>
            <Badge bg="info" style={{ paddingRight: 5, top: 2, position: 'relative' }}>
              {` ${selectedFilter?.name}`}
              <Button className="bp4-minimal" style={{ backgroundColor: 'transparent' }} icon="cross" onClick={resetFilter} />
            </Badge>
          </Text>
        )}
        {!!typeFilter && (
          <Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10}}>
            <Badge bg="secondary" style={{paddingRight: 5, top: 2, position: 'relative'}}>
              {typeFilter}
              <Button className="bp4-minimal" style={{ backgroundColor: 'transparent' }} icon="cross" onClick={resetTypeFilter} />
            </Badge>
          </Text>
        )}
      </div>
      
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
        {!!emptyCategoryError && (
          <Col>
            <Text ml={4}>{emptyCategoryError}</Text>
          </Col>
        )}
      </Row>
    </div>
  )
}
export default Products;