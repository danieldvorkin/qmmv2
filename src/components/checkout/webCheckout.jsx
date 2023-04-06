import { Button, Card, CardBody, CardHeader, Divider, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import React from "react";
import { Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import { PatternFormat } from 'react-number-format';
import { LinkContainer } from "react-router-bootstrap";
import Breakdown from "../breakdown";

const WebCheckout = (props) => {
  const { cart, removeItem, qtyChange, getCartTotal, getDiscountTotal, getGrandTotal, submitOrder, order, setOrder, getItemSubtotal } = props;

  return (
    <>
      <Col lg={8}>
        <Card>
          <CardHeader><Text fontSize='2xl' as='b'>Delivery Information</Text></CardHeader>
          <CardBody>
            <Row style={{marginBottom: 10}}>
              <Col sm={12}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input type='text' name="email" value={order?.email} onChange={(e) => setOrder({...order, [e.target.name]: e.target.value })} />
                </FormControl>
              </Col>
            </Row>
            <Row style={{marginBottom: 10}}>
              <Col sm={12}>
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input type='text' name="full_name" value={order?.full_name} onChange={(e) => setOrder({...order, [e.target.name]: e.target.value })} />
                </FormControl>
              </Col>
              <Col sm={12}>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <PatternFormat className="chakra-input-custom" displayType="input" format="+1 (###) ### ####" name="phone" allowEmptyFormatting mask="_" value={order?.phone} onChange={(e) => setOrder({...order, [e.target.name]: e.target.value })} />
                </FormControl>
              </Col>
            </Row>
            <Row style={{marginBottom: 10}}>
              <Col sm={12} lg={6}>
                <FormControl>
                  <FormLabel>Address 1</FormLabel>
                  <Input type='text' name="address1" value={order?.address1} onChange={(e) => setOrder({...order, [e.target.name]: e.target.value })} />
                </FormControl>
              </Col>
              <Col sm={12} lg={6}>
                <FormControl>
                  <FormLabel>Address 2</FormLabel>
                  <Input type='text' name="address2" value={order?.address2} onChange={(e) => setOrder({...order, [e.target.name]: e.target.value })} />
                </FormControl>
              </Col>
            </Row>
            <Row style={{marginBottom: 10}}>
              <Col sm={12} lg={6}>
                <FormControl>
                  <FormLabel>Postal Code</FormLabel>
                  <Input type='text' name="postal_code" value={order?.postal_code} onChange={(e) => setOrder({...order, [e.target.name]: e.target.value })} />
                </FormControl>
              </Col>
              <Col sm={12} lg={6}>
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Input type='text' name="city" value={order?.city} onChange={(e) => setOrder({...order, [e.target.name]: e.target.value })} />
                </FormControl>
              </Col>
            </Row>
            <Row style={{marginBottom: 10}}>
              <Col>
                <FormControl>
                  <FormLabel>Delivery Instructions</FormLabel>
                  <Input type='text' name="delivery_instructions" value={order?.delivery_instructions} onChange={(e) => setOrder({...order, [e.target.name]: e.target.value })} />
                </FormControl>
              </Col>
            </Row>
            <Row style={{marginBottom: 10}}>
              <Col>
                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Input type='text' name="notes" value={order?.notes} onChange={(e) => setOrder({...order, [e.target.name]: e.target.value })} />
                </FormControl>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>

      <Col lg={{ span: 4}}>
        <Card>
          <CardHeader><Text fontSize='2xl' as='b'>Order Sumary</Text></CardHeader>
          <CardBody>
            {cart?.length > 0 && cart.map((item, index) => {
              return(
                <Breakdown
                  index={index}
                  item={item}
                  qtyChange={qtyChange}
                  removeItem={removeItem}
                  getItemSubtotal={getItemSubtotal}
                  cartLength={props.cart?.length}
                />
              )
            })}
            <br/><Divider /><br/>

            <div style={{textAlign: 'right'}}>
              <Row>
                <Col>
                  Subtotal: 
                  <CurrencyFormat value={getCartTotal(cart).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Col>
              </Row>
              
              <Row>
                <Col>
                  Discounts: 
                  <CurrencyFormat value={getDiscountTotal(cart).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <strong>Grand Total:</strong>
                  <CurrencyFormat value={getGrandTotal(cart).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Col>
              </Row>

              <br/><Divider /><br/>

              <Row>
                <Col><LinkContainer to="/shop"><Button colorScheme={"red"} style={{width: '100%'}}>Cancel</Button></LinkContainer></Col>
                <Col><Button colorScheme={"green"} style={{width: '100%'}} onClick={submitOrder}>Checkout</Button></Col>
              </Row>
            </div>

          </CardBody>
        </Card>
      </Col>
    </>
  )
}

export default WebCheckout;