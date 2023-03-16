import { Button, Card, CardBody, CardHeader, Divider, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from "@chakra-ui/react";
import React from "react";
import { Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";

const WebCheckout = (props) => {
  const { cart, removeItem, qtyChange, getCartTotal } = props;

  return (
    <>
      <Col lg={8}>
        <Card>
          <CardHeader><Text fontSize='2xl' as='b'>Delivery Information</Text></CardHeader>
          <CardBody></CardBody>
        </Card>
      </Col>

      <Col lg={{ span: 4}}>
        <Card>
          <CardHeader><Text fontSize='2xl' as='b'>Order Sumary</Text></CardHeader>
          <CardBody>
            {cart?.length > 0 && cart.map((item, index) => {
              return(
                <div key={"index-" + index}>
                  <Row style={{paddingLeft: 10}}>
                    <Col xs={4} lg={3} style={{paddingTop: 12}}>
                      {item.product?.cover_photo && (
                        <img src={item.product.cover_photo} alt={"img-" + index} />
                      )}
                    </Col>
                    <Col>
                      <Text>
                        <strong>{item.product?.name}</strong>
                      </Text>
                      <div>
                        <Text>Qty:{' '}</Text>
                        <NumberInput value={item.quantity} onChange={(e) => qtyChange(item, e)} min={1}>
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </div>
                      
                      
                      <Text>
                        <strong>Breakdown:{' '}</strong>
                        {item.quantity}{' '}x{' '} 
                        {(item.product?.price || item.product?.variants.length > 0) && (
                          <CurrencyFormat value={item.product?.price || item.product?.variants[0].price} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        )}
                      </Text>
                      <Text>
                        <strong>Total Price:{' '}</strong>
                        {(item.product?.price || item.product?.variants.length > 0) && (
                          <CurrencyFormat value={item.quantity * (item.product?.price || item.product?.variants[0].price)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        )}
                      </Text>
                    </Col>
                    <Col xs={2} style={{ textAlign: 'right', paddingRight: 30, paddingTop: 17 }}>
                      <Text onClick={() => removeItem(item.product?.id)} style={{ cursor: 'pointer' }}>X</Text>
                    </Col>
                  </Row>
                  {index !== cart.length -1 && (
                    <Divider mt={2} mb={2} />
                  )}
                </div>
              )
            })}
            <br/><Divider /><br/>

            <div style={{textAlign: 'right'}}>
              <Row>
                <Col>Subtotal: <CurrencyFormat value={getCartTotal()} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Col>
              </Row>
              
              <Row>
                <Col>Discounts: $0</Col>
              </Row>
              <Row>
                <Col>
                  <strong>Grand Total:</strong>
                  <CurrencyFormat value={getCartTotal()} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Col>
              </Row>

              <br/><Divider /><br/>

              <Row>
                <Col><Button colorScheme={"red"} style={{width: '100%'}}>Cancel Order</Button></Col>
                <Col><Button colorScheme={"green"} style={{width: '100%'}}>Checkout</Button></Col>
              </Row>
            </div>

          </CardBody>
        </Card>
      </Col>
    </>
  )
}

export default WebCheckout;