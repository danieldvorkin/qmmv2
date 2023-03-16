import React, { useEffect, useState } from "react";
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
import store from "../store";
import { useDispatch, useSelector } from "react-redux";
import { remove, updateQty } from "../manageCart";

const Cart = (props) => {
  const dispatch = useDispatch();
  const stateee = useSelector((state) => state.cart )
  const cartData = store.getState("cart").cart;

  const getCartTotal = () => {
    let subtotal = 0;
    
    if(cartData.length > 0){
      subtotal = cartData.map((curr) => curr.quantity * ((curr.product?.price || curr.product?.variants.length > 0) ? (curr.product.price || curr.product.variants[0].price) : 0));
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
            {cartData?.length > 0 && cartData.map((item, index) => {
              return(
                <>
                  <Row style={{paddingLeft: 10}} key={"index-" + index}>
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
                  {index !== cartData.length -1 && (
                    <Divider mt={2} mb={2} />
                  )}
                </>
              )
            })}
          </div>

          <div className="bottomSection">
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
          </div>
          
        </DrawerBody>

        <DrawerFooter>
          <Button variant='outline' mr={3} onClick={props.onClose}>
            Keep Shopping
          </Button>
          <Button colorScheme='blue'>Checkout</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default Cart;