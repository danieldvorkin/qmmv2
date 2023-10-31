import { Card, CardBody, CardHeader, Table, Text } from "@chakra-ui/react";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { getOrderDiscount, getOrderTotal } from "../../utils/helpers";

const MobileOrderItems = (props) => {
  const { onOpen, editmode, setEditmode, order, setOrder, saveStatusChange, orderItems, handleQtyChange, handlePriceChange, removeItem } = props;

  return (
    <Card>
      <CardHeader>
        <Text fontSize={"2xl"}>Order Items</Text><hr/>
      </CardHeader>
      <CardBody>
        {orderItems?.map((item) => {
          const { item: i } = item;
          return (
            <div key={i?.id}>
              <Row>
                <Col xs={4}>
                  <img src={i?.cover_photo} alt={i?.name} height={40}/>
                </Col>
                <Col xs={8}>
                  <Text>Name: <b>{i?.name}</b></Text>
                  <Text>Quantity: <b>{item.quantity}</b></Text>
                  <Text>Price: <b>${i?.price?.toFixed(2)}</b></Text>
                </Col>
              </Row>
            </div>
          )
        })}
        
        <br/><hr/><br/>
        
        <Row>
          <Col>
            <Text>Status: <b>{order.status}</b></Text>
            <Text>Order SubTotal: <b>{getOrderTotal(order.items).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</b></Text>
            <Text>Discount: <b>{getOrderDiscount(order.items).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</b></Text>
            <Text>Grand Total: <b>{(getOrderTotal(order.items) - getOrderDiscount(order.items)).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</b></Text>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default MobileOrderItems;