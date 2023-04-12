import { Badge, Button, Divider, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getMyOrders, getOrdersById } from "../utils/util";
import loading from '../loading.svg';
import Order from "../components/order";
import { useParams } from "react-router-dom";

const MyOrders = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);

  const getOrdersForUser = () => {
    setLoader(true);
    getMyOrders(email).then((resp) => {
      setOrders(resp.sort((a,b) => new Date(b.created_at) - new Date(a.created_at) ));
      setLoader(false);
    });
  }

  const checkForEnter = (e) => {
    if(e.keyCode === 13){
      setLoader(true);
      getOrdersForUser();
    }
  }

  useEffect(() => {
    if(id?.length > 0) {
      getOrdersById(id).then((resp) => setOrders(resp.orders.sort((a,b) => new Date(b.created_at) - new Date(a.created_at) )));
    }
  }, [id])

  return (
    <Container>
      <Row>
        <Col>
          <Text className="header">View Your Orders</Text>
          <Text>Enter your email address and all associated orders will be displayed below</Text>
        </Col>
      </Row>
      {!id && (
        <Row>
          <Col lg={10}>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => checkForEnter(e)} />
          </Col>
          <Col lg={2}>
            <Button onClick={() => getOrdersForUser()}>Get My Orders</Button>
          </Col>
        </Row>
      )}
      
      
      <br/>

      {loader && (
        <div style={{ width: '100%' }}>
          <img style={{ margin: '0 auto' }} src={loading} alt={"loading"}/>
        </div>
      )}
      {!loader && orders.length === 0 && (
        <Text className="header" style={{width: '100%'}}>No Orders were found for that email address</Text>
      )}
      {!loader && orders.length > 0 && orders.map((order) => {
        return(
          <Order order={{ ...order, items: order.line_items }}/>
        )
      })}
      <Divider/>
    </Container>
  )
}

export default MyOrders;