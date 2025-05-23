import { Button, Card, CardBody, CardHeader, Checkbox, Divider, FormControl, FormLabel, Input, Table, TableContainer, Tag, TagCloseButton, TagLabel, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import { PatternFormat } from 'react-number-format';
import { LinkContainer } from "react-router-bootstrap";
import { searchForUser } from "../../utils/util";
import Breakdown from "../breakdown";
import { AppToaster, ErrorToaster, SuccessToaster } from "../../toast";
import { Label } from "@blueprintjs/core";
import { GET_COUPONS } from "../../pages/graphql/coupons";
import { useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { manageActiveCoupon, removeCoupon } from "../../manageCart";

const WebCheckout = (props) => {
  const { 
    cart, 
    activeCoupon, 
    removeItem, 
    qtyChange, 
    getCartTotal, 
    getDiscountTotal, 
    getGrandTotal, 
    submitOrder, 
    order, 
    getItemSubtotal,
    processing
  } = props;
  const dispatch = useDispatch();
  const [initialOrder, setInitialOrder] = useState(order)
  const [validatedUser, setValidatedUser] = useState(false);
  const [showReferralFields, setShowReferralFields] = useState(true);
  const [alreadyMember, setAlreadyMember] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const { loading, error, data: availableCoupons } = useQuery(GET_COUPONS);
  const [confirmingCoupon, setConfirmingCoupon] = useState(false);
  const [couponError, setCouponError] = useState({});

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
    setInitialOrder({...initialOrder, [e.target.name]: e.target.value })
    // Check the input value after a short delay
    setTimeout(() => {
      if (e.target.value !== initialOrder[e.target.name]) {
        setInitialOrder({ 
          ...initialOrder, 
          [e.target.name]: e.target.value.trim() 
        })
      }
    }, 400); // Adjust the delay as needed
  }

  const submitNewOrder = () => {
    submitOrder(initialOrder);
  }

  const checkCoupon = () => {
    if(!!coupon && !!availableCoupons){
      setConfirmingCoupon(true);
      
      let foundCoupon = availableCoupons.coupons.find((c) => c.code === coupon);
      dispatch(manageActiveCoupon({ coupon: foundCoupon, valid: !!foundCoupon }));

      if(foundCoupon === undefined){
        setCouponError({ msg: 'Code not valid, please try another code' })
      } else {
        setCouponError({ })
        setCoupon("");
      }
      setConfirmingCoupon(false);
    }
  }

  const removeActiveCoupon = () => dispatch(removeCoupon())

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
                  <Input type='text' name="email" value={initialOrder?.email} isRequired={true} onInput={(e) => setInitialOrderDetails(e)} />
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
                      <Input type="text" className="chakra-input-custom" isRequired={true} name="phone"  value={initialOrder?.phone} onInput={(e) => setInitialOrderDetails(e)} />
                    </FormControl>
                  </Col>
                </Row>
                <br/>
                <hr/>
                <br/>

                <Row style={{marginBottom: 10}}>
                  <Col>
                    <FormControl>
                      <FormLabel>Already a Member?</FormLabel>
                      <Checkbox value={!alreadyMember} onChange={() => setAlreadyMember(!alreadyMember)}/>
                    </FormControl>
                  </Col>
                </Row>

                {showReferralFields && !alreadyMember && (
                  <Row style={{marginBottom: 10}}>
                    <Col sm={6}>
                      <FormControl>
                        <FormLabel>Referred by Name *</FormLabel>
                        <Input type='text' name="referred_by_name" value={initialOrder?.referred_by_name} onInput={(e) => setInitialOrderDetails(e)} />
                      </FormControl>
                    </Col>
                    <Col sm={6}>
                      <FormControl>
                        <FormLabel>Referred by Phone Number *</FormLabel>
                        <Input type="text" className="chakra-input-custom" name="referred_by_phone"  value={initialOrder?.referred_by_phone} onInput={(e) => setInitialOrderDetails(e)} />
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
                      <FormLabel>City *</FormLabel>
                      <Input type='text' name="city" value={initialOrder?.city} onInput={(e) => setInitialOrderDetails(e)} />
                    </FormControl>
                  </Col>
                </Row>
                <Row style={{marginBottom: 10}}>
                  <Col>
                    <FormControl>
                      <FormLabel>Notes / Delivery Instructions</FormLabel>
                      <Input type='text' placeholder="anytime today / between 3 and 4pm / call me upon arrival / etc" name="delivery_instructions" value={initialOrder?.delivery_instructions} onInput={(e) => setInitialOrderDetails(e)} />
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
                  <CurrencyFormat value={getDiscountTotal(cart, activeCoupon).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <strong>Grand Total:</strong>
                  <CurrencyFormat value={getGrandTotal(cart, activeCoupon).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Col>
              </Row>

              <Divider style={{ marginBottom: 15 }} />

              <Row>
                <Col>
                  <LinkContainer to="/shop">
                    <Button colorScheme={"blue"} style={{width: '100%'}}>Keep Shopping</Button>
                  </LinkContainer>
                </Col>
                <Col>
                  <Button 
                    colorScheme={"green"} 
                    style={{width: '100%'}} 
                    onClick={() => submitNewOrder()} 
                    disabled={validateBeforeSubmission()}
                    isLoading={processing}
                    loadingText='processing order...'
                  >Checkout</Button>
                </Col>
              </Row>

              <Divider style={{ marginBottom: 15, marginTop: 15 }} />

              <Row style={{textAlign: 'left'}}>
                <Col>  
                  {activeCoupon?.code?.length > 0 && (
                    <>
                      <Text mb="1" fontSize={15}>Active Coupon:</Text>
                      <Tag
                        size={'md'}
                        key={'md'}
                        variant='solid'
                        colorScheme='green'
                      >
                        <TagLabel>{activeCoupon?.code}</TagLabel>
                        <TagCloseButton onClick={removeActiveCoupon}/>
                      </Tag>
                      <Divider mb="2" mt="2" />
                    </>
                  )}
                  <Text mb="1" fontSize={15}>Coupon Code:</Text>
                  {!!couponError?.msg && <Text color="red">{couponError?.msg}</Text>}
                  <Input style={{borderColor: !!couponError?.msg ? 'red' : 'silver'}} type="text" name="couponCode" placeholder="Enter Coupon CODE here" value={coupon} onChange={(e) => setCoupon(e.target.value)}/>
                  <Button isLoading={confirmingCoupon} onClick={checkCoupon} colorScheme="green" mt="2" width="100%">Confirm Coupon</Button>
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