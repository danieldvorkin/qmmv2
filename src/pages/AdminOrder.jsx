import { ChevronLeftIcon } from "@chakra-ui/icons";
import { ButtonGroup, Button, Card, CardBody, CardHeader, Input, Text,  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Flex } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Col, Container, Navbar, Row } from "react-bootstrap";
import { BiCheckCircle, BiTrash } from "react-icons/bi";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { featuredItems, getOrder, removeLineItem, updateOrder, updateOrderStatus } from "../utils/util";
import Autosuggest from 'react-autosuggest';
import { SuccessToaster } from "../toast";
import WebOrderItems from "../components/adminOrder/webOrderItems";
import MobileOrderItems from "../components/adminOrder/mobileOrderItems";

const AdminOrder = (props) => {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [editmode, setEditmode] = useState(false);
  const finalRef = React.useRef(null);

  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => window.removeEventListener('resize', handleWindowSizeChange);
  }, []);
  
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
                    <Text>To: <b>{order.address?.name}</b></Text>
                    <Text>{`${order.address?.address1} ${order.address?.address2 ? ' - ' : ''}${order.address?.address2 ?? ''}`}</Text>
                    <Text>{`${order.address?.city ?? ''}${order.address?.city ? ', ' : ' '}${order.address?.province}, Canada`}</Text>
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
            {isMobile ? (
              <MobileOrderItems
                onOpen={onOpen}
                editmode={editmode}
                setEditmode={setEditmode}
                order={order}
                setOrder={setOrder}
                saveStatusChange={saveStatusChange}
                orderItems={orderItems}
                handleQtyChange={handleQtyChange}
                handlePriceChange={handlePriceChange}
                removeItem={removeItem}
              />
            ) : (
              <WebOrderItems
                onOpen={onOpen}
                editmode={editmode}
                setEditmode={setEditmode}
                order={order}
                setOrder={setOrder}
                saveStatusChange={saveStatusChange}
                orderItems={orderItems}
                handleQtyChange={handleQtyChange}
                handlePriceChange={handlePriceChange}
                removeItem={removeItem}
              />
            )}
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