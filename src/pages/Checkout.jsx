import { AlertIcon, Card, CardBody, CardHeader, Divider, Text, Alert } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import WebCheckout from "../components/checkout/webCheckout";
import { remove, updateQty } from "../manageCart";
import Slider from 'react-slick'
import Product from "../components/Product";
import { submitNewOrder } from "../actions";
import { getCartTotal, getDiscountTotal, getGrandTotal, getItemSubtotal } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import { AppToaster } from "../toast";
import { client } from "../App";
import { GET_FEATURED_ITEMS } from "./graphql/featuredItems";

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
    let isMounted = true;
    client.query({ query: GET_FEATURED_ITEMS })
      .then(resp => {
        if (isMounted && resp.data && resp.data.featuredItems) {
          setFeaturedItemsList(resp.data.featuredItems);
        }
      })
      .catch(err => {
        // Optionally handle error here
        setFeaturedItemsList([]);
      });
    return () => { isMounted = false; };
  }, []);

  const removeItem = (id, variant, qty) => {
    dispatch(remove({id: id, variant: variant, qty: qty}))
  }

  const qtyChange = (item, input) => {
    dispatch(updateQty({ product_id: item.product.id, variant: item.variant, qty: parseInt(input) }))
  }

  const submitOrder = (newOrder) => {
    setProcessing(true);
    
    dispatch(submitNewOrder(Object.assign({}, newOrder, order), props.activeCoupon)).then((resp) => {
      setOrderComplete(true);
      
      if(!!resp.order?.id){
        navigate('/order/review/' + resp.order?.id);
      } else {
        setProcessing(false);
        setOrderComplete(false);
        AppToaster.show({ message: `Order submission failed: ${resp?.errors}`})  
      }
    });
  }

  const changeOrderDetails = (e) => {
    setOrder({...order, [e.target.name]: e.target.value});
  }

  return (
    <Container>
      {orderComplete && (
        <Alert status='success'>
          <AlertIcon />
          <Text fontSize='lg'>Order has been submitted successfully</Text>
        </Alert>
      )}
      
      
      <Row style={{marginTop: 10}}>
        <WebCheckout 
          cart={props.cart} 
          activeCoupon={props.activeCoupon}
          removeItem={removeItem} 
          qtyChange={qtyChange} 
          getCartTotal={getCartTotal} 
          getDiscountTotal={getDiscountTotal} 
          getGrandTotal={getGrandTotal} 
          submitOrder={submitOrder} 
          order={order} 
          changeOrderDetails={changeOrderDetails}
          getItemSubtotal={getItemSubtotal}
          processing={processing}
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
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    activeCoupon: state.activeCoupon
  }
}

export default connect(mapStateToProps)(Checkout);