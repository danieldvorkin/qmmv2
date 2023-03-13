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

const Cart = (props) => {

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
          <p>Test drawer</p>
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