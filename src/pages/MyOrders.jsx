import { Button, Divider, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getMyOrders } from "../utils/util";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");

  const getOrdersForUser = () => {
    getMyOrders(email).then((resp) => setOrders(resp));
  }

  return (
    <Container>
      <Row>
        <Col>
          <Text className="header">View Your Orders</Text>
          <Text>Enter your email address and all associated orders will be displayed below</Text>
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Col>
        <Col lg={2}>
          <Button onClick={() => getOrdersForUser()}>Get My Orders</Button>
        </Col>
      </Row>
      
      <br/>
      <Divider/>
      <br/>

      {orders.map((order) => {
        return(
          <Row>
            <Col>
              <Text>Order ID: {order.id}</Text>
            </Col>
          </Row>
        )
      })}
    </Container>
  )
}

export default MyOrders;