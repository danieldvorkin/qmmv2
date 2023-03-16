import { Card, CardBody, CardHeader } from "@chakra-ui/react";
import React from "react";
import { Col } from "react-bootstrap";

const MobileCheckout = (props) => {
  // const { cart } = props;

  return(
    <>
      <Col style={{marginBottom: 20}}>
        <Card>
          <CardHeader>Order Summary</CardHeader>
          <CardBody></CardBody>
        </Card>
      </Col>
      
      <Col>
        <Card>
          <CardHeader>Delivery Information</CardHeader>
          <CardBody></CardBody>
        </Card>
      </Col>
    </>
  )
}

export default MobileCheckout;