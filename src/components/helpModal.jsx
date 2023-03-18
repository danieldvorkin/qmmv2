import { ModalBody, ModalHeader, Button, Modal, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text, Divider } from "@chakra-ui/react";
import React from "react";

const HelpModal = (props) => {
  const { onClose, isOpen } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Need Help?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text className="smaller-header">Order Issues</Text>
          <Text>need help with an order</Text>
          <br/><Divider/><br/>
          <Text className="smaller-header">Delivery Details</Text>
          <Text>need help with an order</Text>
          <br/><Divider/><br/>
          <Text className="smaller-header">Order Cancellation Process</Text>
          <Text>need help with an order</Text>
          <br/><Divider/><br/>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default HelpModal;