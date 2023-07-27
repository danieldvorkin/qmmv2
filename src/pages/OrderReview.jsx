import React, { useEffect, useState } from "react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useDisclosure } from "@chakra-ui/react";
import moment from "moment";
import { ButtonGroup, Col, Container, Navbar, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import { Link, useParams } from "react-router-dom";
import { getItemSubtotal, getOrderDiscount, getOrderTotal } from "../utils/helpers";
import { getOrder } from "../utils/util";
import { MdCancel } from "react-icons/md";
import { SuccessToaster } from "../toast";

const OrderReview = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  useEffect(() => {
    if(id?.length > 0){
      getOrder(id).then((resp) => setOrder(resp));
    }
  }, [id]);

  const cancelOrder = () => {
    onClose();
    SuccessToaster.show({ message: "Order cancellation in progress." })
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <div className="justify-content-start">
            <Navbar.Text>
              {/* <Link to={"/my_orders/" + order?.user?.id}><ChevronLeftIcon/>My Orders</Link> */}
              <Link to={"/my_orders"}><ChevronLeftIcon/>My Orders</Link>
            </Navbar.Text>
          </div>

          <div className="justify-content-end">
            <Navbar.Text>
              <ButtonGroup>
                <Tooltip label='Cancel Order'>
                  <Link style={{margin: '0px 5px'}} onClick={onOpen}><MdCancel className="onIconHoverDanger" size="25" /></Link>
                </Tooltip>
              </ButtonGroup>
            </Navbar.Text>
          </div>
        </Container>
      </Navbar>

      <Modal size="xs" finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure?</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose}>Cancel</Button>
            <Button onClick={() => cancelOrder()} colorScheme='green'>Confirm Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Container style={{marginTop: 20}}>
        <Row>
          <Col lg={4}>
            <Card>
              <CardHeader>
                <Text fontSize='3xl' as='b'>Order #: 0000{order.id}</Text>
                <hr/>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <Text size="10" color="grey">Submitted At:</Text>
                    <Text>{moment(order.created_at).format("ll | h:mm a")}</Text>
                  </Col>

                  <Col>
                    <Text size="10" color="grey">Last Update At:</Text>
                    <Text>{moment(order.updated_at).format("ll | h:mm a")}</Text>
                  </Col>
                </Row>

                <br/><hr/><br/>

                <Row>
                  <Col>
                    <Text size="10" color="grey">Address:</Text>
                    <Text>To: {order.address?.name}</Text>
                    
                    {(order.address?.address1 || order.address?.address2) && (
                      <Text>{`${order.address?.address1} ${order.address?.address2 ? ' - ' : ''}${order.address?.address2}`}</Text>
                    )}
                    {(order.address?.city || order.address?.province) && (
                      <Text>{`${order.address?.city}${order.address?.city ? ', ' : ' '}${order.address?.province}, Canada`}</Text>  
                    )}
                    
                    <Text as="b">{order.address?.address_type}</Text>
                  </Col>
                </Row>

                <br/><hr/><br/>

                <Row>
                  <Col>
                    <Text size="10" color="grey">Notes:</Text>
                    <Text>{order.address?.notes}</Text>
                  </Col>

                  <Col>
                    <Text size="10" color="grey">Time Window:</Text>
                    <Text>{order.time_window}</Text>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          <Col lg={8}>
            <Card>
              <CardHeader>
                <Text fontSize='3xl' as='b'>Order Items</Text>
                <hr/>
              </CardHeader>
              <CardBody>
                <TableContainer>
                  <Table variant='simple'>
                    <TableCaption>
                      Status: {order.status}
                      <br/>
                      Order SubTotal: {getOrderTotal(order.items).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}
                      <br/>
                      Discount: {getOrderDiscount(order.items).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}
                      <br/>
                      Grand Total: {(getOrderTotal(order.items) - getOrderDiscount(order.items)).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Variant</Th>
                        <Th>Price</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {order.items?.map((item) => {
                        return (
                          <Tr>
                            <Td>{item.item.name}</Td>
                            <Td>{item.quantity}</Td>
                            <Td><CurrencyFormat value={getItemSubtotal({ product: item.item, variant: item.quantity, quantity: 1 })} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Td>
                          </Tr>
                        )
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            <br/>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default(OrderReview);