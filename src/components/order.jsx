import { Divider, Badge, Button, ButtonGroup, Text, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Select, useDisclosure, Icon } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Moment from 'moment';
import CurrencyFormat from "react-currency-format";
import HelpModal from "./helpModal";
import { QuestionIcon } from '@chakra-ui/icons'
import { FaShippingFast } from 'react-icons/fa';
import { HiReceiptRefund } from 'react-icons/hi';
import { Link } from "react-router-dom";
import { getItemSubtotal, getOrderDiscount, getOrderTotal } from "../utils/helpers";

const Order = (props) => {
  const { order } = props;
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;
  const { isOpen, onOpen, onClose } = useDisclosure()

  const orderStatuses = {
    "Order Pending": "blue",
    "Order Confirmed": "yellow",
    "Order Processing": "red",
    "Order Shipped": "orange",
    "Order Delivered": "green"
  }

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => window.removeEventListener('resize', handleWindowSizeChange);
  }, []);

  const formatDate = () => Moment(order.created_at).format('LLL');
  const getStatus = () => orderStatuses[order.status];

  const getDeliveryFee = () => {
    if(getItemTotals(order.items) > 50 && getItemTotals(order.items) < 150){
      return 10
    } else if(getItemTotals(order.items) >= 100){
      return 0
    }
  }

  const getItemPrice = (item, variantQty) => {
    return getItemSubtotal({ product: item, quantity: variantQty });
    // let variant = item.variants.find((variant) => variant.quantity === variantQty);
    // return variant ? variant.price : item.variants[0].price * variantQty;
  }

  const getItemTotals = (items) => {
    let itemPrices = items.map((item) => {
      return getItemPrice(item.item, item.quantity)
    });

    return itemPrices.length === 0 ? 0 : itemPrices.reduce((total, curr) => total += curr);
  }
    

  return (
    <div style={{minHeight: 100}}>
      <Row style={{paddingTop: 15}}>
        <Col lg={6} sm={12}>
          <Text className="header" as='b'>
            <Link to={"/order/review/" + order.id}>Order #: {order.id}</Link>
          </Text>
          
          <br/>
          
          <Text as="b">Order Date:{' '}</Text><Text as="samp">{formatDate()}</Text>{'  |  '}
          <Badge variant='subtle' colorScheme={getStatus()}>{order.status}</Badge>

          <Divider style={{marginTop: 5}}/>
          <Row>
            <Col>
              <Text className="smaller-header" as="b">Need Help?</Text>
              <Divider/>
              <Text style={{cursor: 'pointer'}} onClick={onOpen}>
                <QuestionIcon />{' '}
                Order Issues
              </Text>
              <Text style={{cursor: 'pointer'}} onClick={onOpen}>
                <Icon as={FaShippingFast} />{' '}
                Delivery Info
              </Text>
              <Text style={{cursor: 'pointer'}} onClick={onOpen}>
                <Icon as={HiReceiptRefund} />{' '}
                Order Cancellation
              </Text>
              <HelpModal isOpen={isOpen} onClose={onClose} />
            </Col>

            <Col>
              <Text className="smaller-header" as="b">Order Summary</Text>
              <Divider/>
              <Row>
                <Col style={{textAlign: 'left'}}>
                  <Text as="b">Subtotal</Text><br/>
                  <Text as="b">Delivery</Text><br/>
                  <Text as="b">Discount</Text><br/>
                  <Text as="b">Grand Total</Text>
                </Col>
                <Col style={{textAlign: 'right'}}>
                  <CurrencyFormat value={getItemTotals(order.items)} displayType={'text'} thousandSeparator={true} prefix={'$'} /><br/>
                  <CurrencyFormat value={getDeliveryFee()} displayType={'text'} thousandSeparator={true} prefix={'$'} /><br/>
                  <CurrencyFormat value={getOrderDiscount(order.items)} displayType={'text'} thousandSeparator={true} prefix={'$'} /><br/>
                  <CurrencyFormat value={getOrderTotal(order.items) - getOrderDiscount(order.items)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col lg={6} sm={12} style={{textAlign: isMobile ? '' : 'right', paddingTop: isMobile ? '10px' : ''}}>
          <ButtonGroup>
            <Button size={"sm"} colorScheme={"red"}>Cancel Order</Button>
          </ButtonGroup>
        </Col>
      </Row>
      
      <br/>
      {order.items?.length > 0 && (
        <Accordion allowToggle>
          <AccordionItem key={"according-items"}>
            <Text><AccordionButton>Order Breakdown<AccordionIcon /></AccordionButton></Text>
            <AccordionPanel style={{paddingTop: 40}}>
              {order?.items.map((item, index) => {
                return (
                  <Row style={{paddingLeft: 10, paddingBottom: 10}}>
                    <Col xs={4} lg={1}>
                      <img src={item.item?.cover_photo || "https://via.placeholder.com/500?text=No+Product+Image+Available"} alt={"img-" + index} style={{ minHeight: 50, maxHeight: 50, margin: '0 auto'}} />
                    </Col>
                    <Col>
                      <Text>
                        <strong>{item.item?.name}</strong>
                        <Text style={{float: 'right'}}>
                          <strong>Total - </strong>
                          <CurrencyFormat value={item && getItemPrice(item.item, item.quantity).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        </Text>
                      </Text>
                      <div>
                        <Text style={{float: 'right'}}>Qty:{' ' + item.quantity}</Text>
                      </div>
                    </Col>
                  </Row>
                )  
              })}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
}

export default Order;