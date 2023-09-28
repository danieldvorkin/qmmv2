import { Button, Card, CardBody, CardHeader, Divider, FormControl, FormLabel, Input, List, ListItem, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import { PatternFormat } from 'react-number-format';
import { LinkContainer } from "react-router-bootstrap";
import Breakdown from "../breakdown";

const WebCheckout = (props) => {
  const { cart, removeItem, qtyChange, getCartTotal, getDiscountTotal, getGrandTotal, submitOrder, order, changeOrderDetails, getItemSubtotal } = props;

  const io = useMemo(() => ({...order}), [order]);
  const [initialOrder, setInitialOrder] = useState(io)

  const validateBeforeSubmission = () => {
    return Boolean(order.full_name) &&
      Boolean(order.email) &&
      Boolean(order.phone)
  }
  
  const discountBreakdown = [
    "$50+ | $10 Shipping",
    "$100+ | Free Shipping",
    "$150+ | 5% off",
    "$200+ | 10% off",
    "$300+ | 15% off",
    "$400+ | 20% off",
    "$600+ | 25% off",
    "$800+ | 30% off"
  ]

  const setInitialOrderDetails = (e) => {
    setInitialOrder({...initialOrder, [e.target.name]: e.target.value })
    changeOrderDetails(e);
  }

  return (
    <>
      <Col lg={8}>
        <Card>
          <CardHeader>
            <Text fontSize='2xl' as='b'>Delivery Information</Text>
          </CardHeader>
          <CardBody>            
            <Row style={{marginBottom: 10}}>
              <Col sm={12}>
                <FormControl>
                  <FormLabel>Your Name *</FormLabel>
                  <Input type='text' name="full_name" value={initialOrder?.full_name} isRequired={true} onChange={(e) => setInitialOrderDetails(e)} />
                </FormControl>
              </Col>
              <Col sm={12}>
                <FormControl>
                  <FormLabel>Your Phone Number *</FormLabel>
                  <PatternFormat className="chakra-input-custom" displayType="input" isRequired={true} format="+1 (###) ### ####" name="phone" allowEmptyFormatting mask="_" value={initialOrder?.phone} onChange={(e) => setInitialOrderDetails(e)} />
                </FormControl>
              </Col>
            </Row>
            <Row style={{marginBottom: 10}}>
              <Col sm={12}>
                <FormControl>
                  <FormLabel>Your Email *</FormLabel>
                  <Input type='text' name="email" value={initialOrder?.email} isRequired={true} onChange={(e) => setInitialOrderDetails(e)} />
                </FormControl>
              </Col>
            </Row>
            <br/>
            <hr/>
            <br/>
            <Row style={{marginBottom: 10}}>
              <Col sm={6}>
                <FormControl>
                  <FormLabel>Referred by Name</FormLabel>
                  <Input type='text' name="referred_by_name" value={initialOrder?.referred_by_name} onChange={(e) => setInitialOrderDetails(e)} />
                </FormControl>
              </Col>
              <Col sm={6}>
                <FormControl>
                  <FormLabel>Referred by Phone Number</FormLabel>
                  <PatternFormat className="chakra-input-custom" displayType="input" format="+1 (###) ### ####" name="referred_by_phone" allowEmptyFormatting mask="_" value={initialOrder?.referred_by_phone} onChange={(e) => setInitialOrderDetails(e)} />
                </FormControl>
              </Col>
            </Row>
            <Row style={{marginBottom: 10}}>
              <Col sm={12} lg={6}>
                <FormControl>
                  <FormLabel>Address 1</FormLabel>
                  <Input type='text' name="address1" value={initialOrder?.address1} onChange={(e) => setInitialOrderDetails(e)} />
                </FormControl>
              </Col>
              <Col sm={12} lg={6}>
                <FormControl>
                  <FormLabel>Address 2</FormLabel>
                  <Input type='text' name="address2" value={initialOrder?.address2} onChange={(e) => setInitialOrderDetails(e)} />
                </FormControl>
              </Col>
            </Row>
            <Row style={{marginBottom: 10}}>
              <Col sm={12} lg={6}>
                <FormControl>
                  <FormLabel>Postal Code</FormLabel>
                  <Input type='text' name="postal_code" value={initialOrder?.postal_code} onChange={(e) => setInitialOrderDetails(e)} />
                </FormControl>
              </Col>
              <Col sm={12} lg={6}>
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Input type='text' name="city" value={initialOrder?.city} onChange={(e) => setInitialOrderDetails(e)} />
                </FormControl>
              </Col>
            </Row>
            <Row style={{marginBottom: 10}}>
              <Col>
                <FormControl>
                  <FormLabel>Delivery Instructions</FormLabel>
                  <Input type='text' placeholder="anytime today / between 3 and 4pm / call me upon arrival / etc" name="delivery_instructions" value={initialOrder?.delivery_instructions} onChange={(e) => setInitialOrderDetails(e)} />
                </FormControl>
              </Col>
            </Row>
            <Row style={{marginBottom: 10}}>
              <Col>
                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Input type='text' name="notes" value={initialOrder?.notes} onChange={(e) => setInitialOrderDetails(e)} />
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
              {getCartTotal(cart) < 100 && (
                <Row>
                  <Col>
                    Delivery:
                    <CurrencyFormat value={(10).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                  </Col>
                </Row>  
              )}
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
                <Col>
                  <LinkContainer to="/shop">
                    <Button colorScheme={"blue"} style={{width: '100%'}}>Keep Shopping</Button>
                  </LinkContainer>
                </Col>
                <Col>
                  {validateBeforeSubmission() ? (
                    <Button colorScheme={"green"} style={{width: '100%'}} onClick={submitOrder}>Checkout</Button>
                  ) : (
                    <Text>Enter the required(*) info to checkout</Text>
                  )}
                </Col>
              </Row>
            </div>

          </CardBody>
        </Card>
        
        <br/>

        <Card>
          <CardHeader>
            <Text fontSize='2xl' as='b'>Discount Breakdown</Text>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant='simple' size='sm'>
                <Thead>
                  <Tr>
                    <Th>Total</Th>
                    <Th>Discount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {discountBreakdown.map((discount) => {
                    return (
                      <Tr>
                        <Td>{discount.split(" | ")[0]}</Td>
                        <Td>{discount.split(" | ")[1]}</Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

export default WebCheckout;