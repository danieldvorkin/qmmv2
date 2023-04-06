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
import { DISCOUNT_SETTINGS } from "../utils/helpers";
import Breakdown from "./breakdown";
import { getItem } from "../utils/util";

const Cart = (props) => {
  const dispatch = useDispatch();

  const getCartTotal = () => {
    let subtotal = 0;
    
    if(props.cart.length > 0){
      subtotal = props.cart.map((curr) => getItemSubtotal(curr));
      return subtotal.reduce((total, current) => total = total + current);
    }
    
    return subtotal;
  }

  const removeItem = (id, variant, qty) => {
    dispatch(remove({id: id, variant: variant, qty: qty}))
  }

  const qtyChange = (item, input) => {
    dispatch(updateQty({ product_id: item.product.id, variant: item.variant, qty: parseInt(input) }))
  }

  const getVariant = (item) => {
    const { product, variant } = item;
    return product.variants.find((item) => item.quantity === parseFloat(variant));
  }

  const getItemSubtotal = (item) => {
    let selectedVariant = getVariant(item);
    return (selectedVariant ? item.quantity * selectedVariant.price : item.quantity * (item.product.price || item.product.variants[0].price));
  }

  const getDiscountTotal = () => {
    let cartTotal = getCartTotal();

    if(cartTotal >= 100 && cartTotal < 150){
      return cartTotal * DISCOUNT_SETTINGS['150'];
    } else if(cartTotal >= 150 && cartTotal < 200){
      return cartTotal * DISCOUNT_SETTINGS['200'];
    } else if(cartTotal >= 200 && cartTotal < 300){
      return cartTotal * DISCOUNT_SETTINGS['300'];
    } else if(cartTotal >= 300 && cartTotal < 400){
      return cartTotal * DISCOUNT_SETTINGS['400'];
    } else if(cartTotal >= 400 && cartTotal < 600){
      return cartTotal * DISCOUNT_SETTINGS['600'];
    } else if(cartTotal >= 600 && cartTotal < 800){
      return cartTotal * DISCOUNT_SETTINGS['800'];
    } else if(cartTotal >= 800){
      return cartTotal * DISCOUNT_SETTINGS['1000'];
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
                <Breakdown
                  index={index}
                  item={item}
                  qtyChange={qtyChange}
                  removeItem={removeItem}
                  getItemSubtotal={getItemSubtotal}
                  cartLength={props.cart.length}
                />
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