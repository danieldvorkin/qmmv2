import { Divider, Text } from "@chakra-ui/react";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  const year = new Date();
  return (
    <>
      <Divider style={{marginBottom: 20}} />
      <Container style={{marginBottom: 30}}>
        <Row>
          <Col lg={4} xs={12} style={{marginBottom: 10}}>
            <Text className="smaller-header2">Order Issues</Text>
            <Text>need help with an order</Text>
          </Col>
          <Col lg={4} xs={12} style={{marginBottom: 10}}>
            <Text className="smaller-header2">Delivery Details</Text>
            <Text>need help with an order</Text>
          </Col>
          <Col lg={4} xs={12} style={{marginBottom: 10}}>
            <Text className="smaller-header2">Order Cancellation Process</Text>
            <Text>need help with an order</Text>
          </Col>
        </Row>
      </Container>
      <Divider style={{marginBottom: 15}}/>
      <Text style={{paddingLeft: 15, paddingBottom: 10, color: 'grey'}}>Powered by QueenMaryDevelopers Inc{` ${year.getFullYear()}`}</Text>
    </>
  )
}

export default Footer;