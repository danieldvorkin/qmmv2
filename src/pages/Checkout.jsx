import { AlertIcon, Card, CardBody, CardHeader, Divider, Text, Alert } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import MobileCheckout from "../components/checkout/mobileCheckout";
import WebCheckout from "../components/checkout/webCheckout";
import { remove, updateQty } from "../manageCart";
import Slider from 'react-slick'
import Product from "../components/Product";
import { featuredItems } from "../utils/util";


const Checkout = (props) => {
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;
  const dispatch = useDispatch();
  const [featuredItemsList, setFeaturedItemsList] = useState([]);

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

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => window.removeEventListener('resize', handleWindowSizeChange);
  }, []);

  const removeItem = (productID) => {
    dispatch(remove(productID))
  }

  const qtyChange = (item, input) => {
    dispatch(updateQty({ product_id: item.product.id, qty: parseInt(input) }))
  }

  const getCartTotal = () => {
    let subtotal = 0;
    
    if(props.cart.length > 0){
      subtotal = props.cart.map((curr) => curr.quantity * ((curr.product?.price || curr.product?.variants.length > 0) ? (curr.product.price || curr.product.variants[0].price) : 0));
      return subtotal.reduce((total, current) => total = total + current);
    }
    
    return subtotal;
  }

  return (
    <Container>
      <Alert status='info'>
        <AlertIcon />
        <Text fontSize='lg'>This order qualifies for a discount</Text>
      </Alert>
      
      <Row style={{marginTop: 10}}>
        {isMobile ? (
          <MobileCheckout cart={props.cart} removeItem={removeItem} qtyChange={qtyChange} getCartTotal={getCartTotal} />
        ) : (
          <WebCheckout cart={props.cart} removeItem={removeItem} qtyChange={qtyChange} getCartTotal={getCartTotal} />
        )}
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
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(Checkout);