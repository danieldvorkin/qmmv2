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
 
} from '@chakra-ui/react'
import { Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import { useDispatch } from "react-redux";
import { remove, updateQty } from "../manageCart";
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import Breakdown from "./breakdown";
import { getCartTotal, getDiscountTotal, getGrandTotal, getItemSubtotal, getDiscountPercent } from "../utils/helpers";

const Cart = (props) => {
  const dispatch = useDispatch();

  const removeItem = (id, variant, qty) => {
    dispatch(remove({id: id, variant: variant, qty: qty}))
  }

  const qtyChange = (item, input) => {
    dispatch(updateQty({ product_id: item.product.id, qty: parseFloat(input) }))
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
                  key={`${item.product.id}-${index}`}
                  index={index}
                  item={item}
                  qtyChange={qtyChange}
                  removeItem={removeItem}
                  getItemSubtotal={getItemSubtotal}
                  cartLength={props.cart.length}
                  discountPercent={getDiscountPercent(props.cart)}
                />
              )
            })}
          </div>
        </DrawerBody>

        <DrawerFooter>
          <div className="bottomSection">
            <Row>
              <Col>
                Subtotal: 
                <CurrencyFormat value={getCartTotal(props.cart, props.activeCoupon).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </Col>
            </Row>
            <Row>
              <Col>
                Discounts:
                <CurrencyFormat value={getDiscountTotal(props.cart, props.activeCoupon).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </Col>
            </Row>
            {props.activeCoupon?.code?.length > 0 && (
            <Row>
              <Col>
                {`${props.activeCoupon?.code} - ${!props.activeCoupon?.percentage ? '$' : ''}${props.activeCoupon?.amount}${props.activeCoupon?.percentage ? '%' : ' Off'}`}
              </Col>
            </Row>  
            )}
            {getCartTotal(props.cart) < 100 && (
              <Row>
                <Col>
                  Delivery:
                  <CurrencyFormat value={(10).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Col>
              </Row>  
            )}
            <Row>
              <Col>
                <strong>Grand Total:</strong>
                <CurrencyFormat value={getGrandTotal(props.cart, props.activeCoupon).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </Col>
            </Row>
          </div>
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
    cart: state.cart,
    activeCoupon: state.activeCoupon
  }
}

export default connect(mapStateToProps)(Cart);