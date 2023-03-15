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
} from '@chakra-ui/react'
import { Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import { AppToaster } from "../toast";

const Cart = (props) => {
  const [cart, setCart] = useState([]);
  let localCart = JSON.parse(localStorage.getItem("cart"));

  useEffect(() => {
    if (localCart) setCart(localCart)
  }, [localCart])

  const getCartTotal = () => {
    let subtotal = 0;
    
    if(cart.length > 0){
      subtotal = cart.map((curr) => {
        return curr.quantity * (curr.product.price || curr.product.variants[0].price)
      });
      return subtotal.reduce((total, current) => total = total + current);
    }
    
    return subtotal;
  }

  const removeItem = (id) => {
    let cartCopy = [...cart];
    let newCart = cartCopy.filter(cartItem => cartItem.product.id != id);
    setCart(newCart)

    let stringCart = JSON.stringify(newCart);
    localStorage.setItem("cart", stringCart);
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
            {localCart?.length > 0 && localCart.map((item, index) => {
              return(
                <>
                  <Row style={{paddingLeft: 10}}>
                    <Col xs={4} lg={3} style={{paddingTop: 12}}>
                      <img src={item.product.cover_photo} />
                    </Col>
                    <Col>
                      <Text>{item.product.name}</Text>
                      <Text>Qty: {item.quantity}</Text>
                      <Text>
                        Price: 
                        <CurrencyFormat value={item.product.price || item.product.variants[0].price} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                      </Text>
                    </Col>
                    <Col style={{ textAlign: 'right', paddingRight: 30, paddingTop: 17 }}>
                      <Text onClick={() => removeItem(item.product.id)} style={{ cursor: 'pointer' }}>X</Text>
                    </Col>
                  </Row>
                  {index !== localCart.length -1 && (
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