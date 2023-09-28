import { AlertIcon, Card, CardBody, CardHeader, Divider, Text, Alert } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import WebCheckout from "../components/checkout/webCheckout";
import { remove, updateQty } from "../manageCart";
import Slider from 'react-slick'
import Product from "../components/Product";
import { featuredItems } from "../utils/util";
import { submitNewOrder } from "../actions";
import { getCartTotal, getDiscountTotal, getGrandTotal, getItemSubtotal } from "../utils/helpers";
import { createSearchParams, useNavigate } from "react-router-dom";
import loading from '../loading.svg';

const Checkout = (props) => {
  const dispatch = useDispatch();
  const [featuredItemsList, setFeaturedItemsList] = useState([]);
  const [order, setOrder] = useState({ cart: props.cart });
  const [orderComplete, setOrderComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const settings = {
    dots: false, infinite: true, 
    slidesToShow: 4, slidesToScroll: 1,
  
    responsive: [{
      breakpoint: 200,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },{
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }]
  }

  useEffect(() => {
    async function fetchData() {
      const response = await featuredItems();
      setFeaturedItemsList(response);
    }
    fetchData();
  }, []);

  const removeItem = (id, variant, qty) => {
    dispatch(remove({id: id, variant: variant, qty: qty}))
  }

  const qtyChange = (item, input) => {
    dispatch(updateQty({ product_id: item.product.id, variant: item.variant, qty: parseInt(input) }))
  }

  const submitOrder = () => {
    setProcessing(true);
    
    dispatch(submitNewOrder(order)).then((resp) => {
      setOrderComplete(true);
      navigate('/order/review/' + resp.order?.id);
    });
  }

  const changeOrderDetails = (e) => {
    setOrder({...order, [e.target.name]: e.target.value})
  }

  return (
    <Container>
      {getDiscountTotal() > 0 && !orderComplete && (
        <Alert status='info'>
          <AlertIcon />
          <Text fontSize='lg'>This order qualifies for a discount</Text>
        </Alert>
      )}
      {orderComplete && (
        <Alert status='success'>
          <AlertIcon />
          <Text fontSize='lg'>Order has been submitted successfully</Text>
        </Alert>
      )}
      
      {!processing ? (
        <>
          <Row style={{marginTop: 10}}>
            <WebCheckout 
              cart={props.cart} 
              removeItem={removeItem} 
              qtyChange={qtyChange} 
              getCartTotal={getCartTotal} 
              getDiscountTotal={getDiscountTotal} 
              getGrandTotal={getGrandTotal} 
              submitOrder={submitOrder} 
              order={order} 
              changeOrderDetails={changeOrderDetails}
              getItemSubtotal={getItemSubtotal}
            />
          </Row>

          <br/><Divider/><br/>

          <Row>
            <Col pr={3} pl={3}>
              <Card>
                <CardHeader><Text fontSize='2xl' as='b'>Featured Items</Text></CardHeader>
                <CardBody>
                  <Slider {...settings}>
                    {featuredItemsList.map((item) => {
                      return <Product product={item} category={item.category} />
                    })}
                  </Slider>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <img style={{ margin: '0 auto' }} src={loading} alt={"loading"}/>
          <Text style={{textAlign: 'center', position: 'relative', top: '-150px'}}>Order is being processed...</Text>
        </>
        
      )}
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(Checkout);