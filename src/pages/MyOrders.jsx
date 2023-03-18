import { Badge, Button, Divider, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getMyOrders } from "../utils/util";
import loading from '../loading.svg';
import Order from "../components/order";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);

  const getOrdersForUser = () => {
    setLoader(true);
    getMyOrders(email).then((resp) => {
      setOrders(resp.sort((a,b) => new Date(b.submitted_at) - new Date(a.submitted_at) ));
      setLoader(false);
    });
  }

  const checkForEnter = (e) => {
    if(e.keyCode === 13){
      setLoader(true);
      getOrdersForUser();
    }
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
          <Input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => checkForEnter(e)} />
        </Col>
        <Col lg={2}>
          <Button onClick={() => getOrdersForUser()}>Get My Orders</Button>
        </Col>
      </Row>
      
      <br/>

      {loader && (
        <div style={{ width: '100%' }}>
          <img style={{ margin: '0 auto' }} src={loading} alt={"loading"}/>
        </div>
      )}
      {!loader && orders.length === 0 && (
        <Text className="header" style={{width: '100%'}}>No Orders were found for that email address</Text>
      )}
      {!loader && orders.map((order) => {
        return(
          <Order order={order}/>
        )
      })}
      <Divider/>
    </Container>
  )
}

export default MyOrders;