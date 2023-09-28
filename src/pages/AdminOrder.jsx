import { ChevronLeftIcon } from "@chakra-ui/icons";
import { ButtonGroup, Button, Card, CardBody, CardHeader, Input, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Flex, Select } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Col, Container, Navbar, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import { BiCheckCircle, BiTrash } from "react-icons/bi";
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useParams } from "react-router-dom";
import { getItemSubtotal, getOrderDiscount, getOrderTotal } from "../utils/helpers";
import { featuredItems, getOrder, removeLineItem, updateOrder, updateOrderStatus } from "../utils/util";
import Autosuggest from 'react-autosuggest';
import { AppToaster, SuccessToaster } from "../toast";

const AdminOrder = (props) => {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [editmode, setEditmode] = useState(false);
  const finalRef = React.useRef(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);

  const [value, setValue] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if(id){
      getOrder(id).then((resp) => {
        setOrder(resp)
        setOrderItems(resp.items)
      });
    }

    if(isOpen){
      featuredItems().then((resp) => {
        setProducts(resp)
      });
    }
  }, [id, isOpen]);

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue?.length;

    return inputLength === 0 ? [] : products.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value))
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  };

  const getSuggestionValue = suggestion => suggestion.name;

  const renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
  );

  const onProductSearchChange = (e, { newValue }) => {
    setValue(newValue);
  }

  const inputProps = {
    placeholder: 'Type a product name',
    value,
    onChange: onProductSearchChange
  };


  const addProductToOrder = () => {
    let selectedProduct = products.filter((p) => p.name === value)[0];
    let params = {
      item_name: selectedProduct.name.trim(),
      quantity: newQuantity
    }

    updateOrder(order, params).then((resp) => {
      setOrder(resp)
      onClose();
    })
  }

  const removeItem = (item) => {
    console.log("Item: ", item);
    let params = { item_name: item.item.name };

    removeLineItem(order, params).then((resp) => {
      setOrder(resp);
      setOrderItems(resp.items);
    })
  }

  const handleQtyChange = (item, event) => {
    const { value } = event.target;
    const itemIndex = orderItems.indexOf(item);

    let modifiedItem = orderItems[itemIndex];
    modifiedItem.quantity = value;

    setOrderItems(orderItems);
    setOrder({...order, items: orderItems});
  }

  const handlePriceChange = (item, event) => {
    const { value } = event.target;
    const itemIndex = orderItems.indexOf(item);

    let modifiedItem = orderItems[itemIndex];
    modifiedItem.item.price = value / modifiedItem.quantity;

    setOrderItems(orderItems);
    setOrder({...order, items: orderItems});
  }

  const saveStatusChange = () => {
    updateOrderStatus(order, {status: order.status}).then((resp) => {
      SuccessToaster.show({ message: "Order status update successful." })
    })
  }

  return (
    <>
      <Navbar bg="dark" variant="dark"  className="adminNavbar">
        <Container>
          <Navbar.Collapse className="justify-content-start">
            <Navbar.Text>
              <Link to="/admin/orders"><ChevronLeftIcon/>Back to Orders</Link>
            </Navbar.Text>
          </Navbar.Collapse>

          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <ButtonGroup>
                <Link style={{margin: '0px 5px'}}><BiTrash className="onIconHoverDanger" size="25" /></Link>
                <Link style={{margin: '0px 5px'}}><BiCheckCircle className="onIconHoverSuccess" size="25" /></Link>
              </ButtonGroup>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
                    <Text>{moment(order.submitted_at).format("ll | h:mm a")}</Text>
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
                    <Text>{`${order.address?.address1} ${order.address?.address2 ? ' - ' : ''}${order.address?.address2}`}</Text>
                    <Text>{`${order.address?.city}${order.address?.city ? ', ' : ' '}${order.address?.province}, Canada`}</Text>
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
                <div style={{float: 'right', display: 'flex'}}>
                  <ButtonGroup>
                    <Button colorScheme={'purple'} onClick={() => onOpen()}>Add Product</Button>
                    {editmode ? (      
                      <Button colorScheme={'green'} onClick={() => setEditmode(false)}>Confirm Order</Button>
                    ) : (
                      <Button colorScheme={'orange'} onClick={() => setEditmode(true)}>Edit Order</Button>
                    )}
                  </ButtonGroup>
                  
                  <Select value={order.status} style={{marginLeft: 8}} onChange={(e) => setOrder({...order, status: e.target.value})}>
                    <option value='pending'>Pending</option>
                    <option value='confirmed'>Confirmed</option>
                    <option value='processing'>Processing</option>
                    <option value='shipped'>Shipped</option>
                    <option value='delivered'>Delivered</option>
                  </Select>
                  <Button style={{marginLeft: 10, width: 100}} onClick={saveStatusChange}>Save</Button>
                </div>
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
                        <Th>Quantity</Th>
                        <Th>Price</Th>
                        {editmode && (
                          <Th>Remove</Th>
                        )}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {orderItems.map((item) => {
                        return (
                          <Tr>
                            <Td style={{maxWidth: 300, minWidth: 300 }}>
                              <LinkContainer to={{ pathname: "/admin/products/" + item.item.slug, search: "?order=" + order.id }} style={{cursor: 'pointer'}}>
                                <Text>{item.item.name}</Text>
                              </LinkContainer>
                            </Td>
                            <Td style={{maxWidth: 200, minWidth: 200 }}>
                              {editmode ? (
                                <Input placeholder='quantity' size='sm' value={item.quantity} onChange={(e) => handleQtyChange(item, e)}/>
                              ) : (
                                item.quantity
                              )}
                            </Td>
                            <Td style={{maxWidth: 200, minWidth: 200 }}>
                              {editmode ? (
                                <Input placeholder='custom price' size="sm" value={getItemSubtotal({ product: item.item, variant: item.quantity, quantity: item.quantity })} onChange={(e) => handlePriceChange(item, e)}/>
                              ) : (
                                <CurrencyFormat 
                                  value={getItemSubtotal({ product: item.item, variant: item.quantity, quantity: item.quantity })} 
                                  displayType={'text'} 
                                  thousandSeparator={true} 
                                  prefix={'$'} />
                              )}
                            </Td>
                            {editmode && (
                              <Td>
                                <Button colorScheme="red" onClick={() => removeItem(item)}><BiTrash /></Button>
                              </Td>
                            )}
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

        <Modal finalFocusRef={finalRef} size={'xl'} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add to Order</ModalHeader>
            <ModalCloseButton />
            
            <ModalBody>
              <Flex>
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps}
                />
                <Input type="number" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} />
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme={'green'} onClick={() => addProductToOrder()}>Add Product</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn,
    user: state.user
  }
}

export default connect(mapStateToProps)(AdminOrder);