import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Divider,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import { useDispatch } from "react-redux";
import { remove, updateQty } from "../manageCart";
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";

const discountSettings = {
  '50': 0, '100': 0, '150': 0.05,
  '200': 0.10, '300': 0.15, '400': 0.20,
  '600': 0.25, '800': 0.30
}

const Cart = (props) => {
  const dispatch = useDispatch();

  const getCartTotal = () => {
    let subtotal = 0;
    
    if(props.cart.length > 0){
      subtotal = props.cart.map((curr) => curr.quantity * ((curr.product?.price || curr.product?.variants.length > 0) ? (curr.product.price || curr.product.variants[0].price) : 0));
      return subtotal.reduce((total, current) => total = total + current);
    }
    
    return subtotal;
  }

  const removeItem = (id) => {
    dispatch(remove(id))
  }

  const qtyChange = (item, input) => {
    dispatch(updateQty({ product_id: item.product.id, qty: parseInt(input) }))
  }

  const getDiscountTotal = () => {
    let cartTotal = getCartTotal();

    if(cartTotal >= 100 && cartTotal < 150){
      return cartTotal * discountSettings['150'];
    } else if(cartTotal >= 150 && cartTotal < 200){
      return cartTotal * discountSettings['200'];
    } else if(cartTotal >= 200 && cartTotal < 300){
      return cartTotal * discountSettings['300'];
    } else if(cartTotal >= 300 && cartTotal < 400){
      return cartTotal * discountSettings['400'];
    } else if(cartTotal >= 400 && cartTotal < 600){
      return cartTotal * discountSettings['600'];
    } else if(cartTotal >= 600 && cartTotal < 1000){
      return cartTotal * discountSettings['800'];
    }

    return 0;
  }

  const getGrandTotal = () => {
    return getCartTotal() - getDiscountTotal();
  }

  return (
    <Drawer
      isOpen={props.isOpen}
      placement='right'
      onClose={props.onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Cart</DrawerHeader>
        <Divider/>
        <DrawerBody>
          <div className="content-container">
            {props.cart?.length > 0 && props.cart.map((item, index) => {
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
                  {index !== props.cart.length -1 && (
                    <Divider mt={2} mb={2} />
                  )}
                </div>
              )
            })}
          </div>

          <div className="bottomSection">
            <Row>
              <Col>
                Subtotal: 
                <CurrencyFormat value={getCartTotal().toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </Col>
            </Row>
            
            <Row>
              <Col>
                Discounts:
                <CurrencyFormat value={getDiscountTotal().toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>Grand Total:</strong>
                <CurrencyFormat value={getGrandTotal().toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </Col>
            </Row>
          </div>
          
        </DrawerBody>

        <DrawerFooter>
          <Button variant='outline' mr={3} onClick={props.onClose}>
            Keep Shopping
          </Button>
          <LinkContainer to="checkout">
            <Button colorScheme='blue' onClick={props.onClose}>Checkout</Button>
          </LinkContainer>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(Cart);