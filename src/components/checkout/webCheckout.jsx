import { Button, Card, CardBody, CardHeader, Divider, FormControl, FormLabel, Input, List, ListItem, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import { PatternFormat } from 'react-number-format';
import { LinkContainer } from "react-router-bootstrap";
import { searchForUser } from "../../utils/util";
import Breakdown from "../breakdown";
import { produce } from "immer";
import { ErrorToaster, SuccessToaster } from "../../toast";

const WebCheckout = (props) => {
  const { cart, removeItem, qtyChange, getCartTotal, getDiscountTotal, getGrandTotal, submitOrder, order, getItemSubtotal } = props;
  const [initialOrder, setInitialOrder] = useState(order)
  const [validatedUser, setValidatedUser] = useState(false);
  const [showReferralFields, setShowReferralFields] = useState(false);

  const validateBeforeSubmission = () => {
    return (Boolean(order.full_name) && Boolean(order.email) && Boolean(order.phone)) || validatedUser
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
    // setInitialOrder(
    //   produce(initialOrder, (draft) => {
    //     draft[e.target.name] = e.target.value;
    //   })
    // );
    setInitialOrder({...initialOrder, [e.target.name]: e.target.value })
    // Check the input value after a short delay
    setTimeout(() => {
      if (e.target.value !== initialOrder[e.target.name]) {
        setInitialOrder({...initialOrder, [e.target.name]: e.target.value })
      }
    }, 400); // Adjust the delay as needed
    // changeOrderDetails(e);
  }

  const searchUser = () => {
    searchForUser(initialOrder.email).then((resp) => {
      if(resp.length > 0){
        setInitialOrder({
          email: resp[0].email,
          full_name: resp[0].address?.name,
          phone: resp[0].phone,
          address1: resp[0].address?.address1,
          address2: resp[0].address?.address2,
          zipcode: resp[0].address?.zipcode,
          city: resp[0].address?.city,
          notes: resp[0].address?.notes
        });
        setShowReferralFields(false);
        SuccessToaster.show({ message: "User account found: Details have been added into the form." })
      } else {
        setShowReferralFields(true);
        ErrorToaster.show({ message: "Sign up today by placing your first order" })
      }

      setValidatedUser(true);
    });
  }

  const submitNewOrder = () => {
    submitOrder(initialOrder);
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
                  <FormLabel>Your Email *</FormLabel>
                  <Input type='text' name="email" value={initialOrder?.email} isRequired={true} onInput={(e) => setInitialOrderDetails(e)} onBlur={() => searchUser()}/>
                </FormControl>
              </Col>
            </Row>
            <>
                <Row style={{marginBottom: 10}}>
                  <Col sm={12}>
                    <FormControl>
                      <FormLabel>Your Name *</FormLabel>
                      <Input type='text' name="full_name" value={initialOrder?.full_name} isRequired={true} onInput={(e) => setInitialOrderDetails(e)} />
                    </FormControl>
                  </Col>
                  <Col sm={12}>
                    <FormControl>
                      <FormLabel>Your Phone Number *</FormLabel>
                      <PatternFormat className="chakra-input-custom" displayType="input" isRequired={true} format="+1 (###) ### ####" name="phone" allowEmptyFormatting mask="_" value={initialOrder?.phone} onInput={(e) => setInitialOrderDetails(e)} />
                    </FormControl>
                  </Col>
                </Row>
                <br/>
                <hr/>
                <br/>
                
                {showReferralFields && (
                  <Row style={{marginBottom: 10}}>
                    <Col sm={6}>
                      <FormControl>
                        <FormLabel>Referred by Name</FormLabel>
                        <Input type='text' name="referred_by_name" value={initialOrder?.referred_by_name} onInput={(e) => setInitialOrderDetails(e)} />
                      </FormControl>
                    </Col>
                    <Col sm={6}>
                      <FormControl>
                        <FormLabel>Referred by Phone Number</FormLabel>
                        <PatternFormat className="chakra-input-custom" displayType="input" format="+1 (###) ### ####" name="referred_by_phone" allowEmptyFormatting mask="_" value={initialOrder?.referred_by_phone} onInput={(e) => setInitialOrderDetails(e)} />
                      </FormControl>
                    </Col>
                  </Row>  
                )}
                
                <Row style={{marginBottom: 10}}>
                  <Col sm={12} lg={6}>
                    <FormControl>
                      <FormLabel>Address 1 *</FormLabel>
                      <Input type='text' name="address1" value={initialOrder?.address1} onInput={(e) => setInitialOrderDetails(e)} />
                    </FormControl>
                  </Col>
                  <Col sm={12} lg={6}>
                    <FormControl>
                      <FormLabel>Address 2</FormLabel>
                      <Input type='text' name="address2" value={initialOrder?.address2} onInput={(e) => setInitialOrderDetails(e)} />
                    </FormControl>
                  </Col>
                </Row>
                <Row style={{marginBottom: 10}}>
                  <Col sm={12} lg={6}>
                    <FormControl>
                      <FormLabel>Postal Code *</FormLabel>
                      <Input type='text' name="zipcode" value={initialOrder?.zipcode} onInput={(e) => setInitialOrderDetails(e)} />
                    </FormControl>
                  </Col>
                  <Col sm={12} lg={6}>
                    <FormControl>
                      <FormLabel>City</FormLabel>
                      <Input type='text' name="city" value={initialOrder?.city} onInput={(e) => setInitialOrderDetails(e)} />
                    </FormControl>
                  </Col>
                </Row>
                <Row style={{marginBottom: 10}}>
                  <Col>
                    <FormControl>
                      <FormLabel>Delivery Instructions</FormLabel>
                      <Input type='text' placeholder="anytime today / between 3 and 4pm / call me upon arrival / etc" name="delivery_instructions" value={initialOrder?.delivery_instructions} onInput={(e) => setInitialOrderDetails(e)} />
                    </FormControl>
                  </Col>
                </Row>
                <Row style={{marginBottom: 10}}>
                  <Col>
                    <FormControl>
                      <FormLabel>Notes</FormLabel>
                      <Input type='text' name="notes" value={initialOrder?.notes} onInput={(e) => setInitialOrderDetails(e)} />
                    </FormControl>
                  </Col>
                </Row>
              </>
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
            <br/><Divider />

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

              <Divider style={{ marginBottom: 4 }} />

              <Row>
                <Col>
                  <LinkContainer to="/shop">
                    <Button colorScheme={"blue"} style={{width: '100%'}}>Keep Shopping</Button>
                  </LinkContainer>
                </Col>
                <Col>
                  {validateBeforeSubmission() ? (
                    <Button colorScheme={"green"} style={{width: '100%'}} onClick={() => submitNewOrder() }>Checkout</Button>
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