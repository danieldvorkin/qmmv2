import { Button } from "@blueprintjs/core";
import { Text } from "@chakra-ui/react";
import React from "react";
import { Badge, Col, Row } from "react-bootstrap";
import Product from "./Product";

const Products = (props) => {
  let { products, selectedFilter, resetFilter, typeFilter, resetTypeFilter, emptyCategoryError, dataFetched } = props;

  const getBadgeColor = (typeOf) => {
    let strainColors = {
      "Indica": "#682D63",
      "Sativa": "#F26419",
      "Hybrid": "#138A36",
    }

    return strainColors[typeOf];
  }

  return (
    <div>
      <div style={{display: 'flex'}}>
        {selectedFilter?.name?.length > 0 && (
          <Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10}}>
            <Badge bg="primary" style={{ paddingRight: 5, top: 2, position: 'relative' }}>
              {` ${selectedFilter?.name}`}
              <Button className="bp4-minimal" style={{ backgroundColor: 'transparent' }} icon="cross" onClick={resetFilter} />
            </Badge>
          </Text>
        )}
        {!!typeFilter && (
          <Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10}}>
            <Badge bg="" style={{ paddingRight: 5, top: 2, position: 'relative', backgroundColor: getBadgeColor(typeFilter) }}>
              {typeFilter}
              <Button className="bp4-minimal" style={{ backgroundColor: 'transparent' }} icon="cross" onClick={resetTypeFilter} />
            </Badge>
          </Text>
        )}
      </div>
      
      <Row>
        {dataFetched && products && products.map((product) => {
          if(product?.price > 0 && product?.inventory > 0) {
            return (
              <Col xl={3} lg={4} md={6} xs={12} key={product.id}>
                <Product product={product} category={selectedFilter} />
              </Col>
            )
          }
        })}
        {emptyCategoryError?.length && (
          <Col>
            <Text ml={4}>{emptyCategoryError}</Text>
          </Col>
        )}
      </Row>
    </div>
  )
}
export default Products;