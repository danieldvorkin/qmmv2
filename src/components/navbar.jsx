

import { Button } from '@blueprintjs/core';
import { Badge, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Nav, Navbar, ProgressBar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import logo from '../new_logo.svg';
import { DISCOUNT_SETTINGS, getCartTotal } from '../utils/helpers';

const MainNavbar = (props) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => window.removeEventListener('resize', handleWindowSizeChange);
  }, []);

  const checkForEnter = (e) => {
    if(e.keyCode === 13){
      navigate("/search/" + search);
    }
  }

  const getDiscountPercent = () => {
    let cartTotal = getCartTotal(props.cart);
    console.log("Cart Total: ", cartTotal);

    if(cartTotal >= 100 && cartTotal < 150){
      return "Free Delivery";
    } else if(cartTotal >= 150 && cartTotal < 200){
      return `${100.0 * DISCOUNT_SETTINGS['200']}% Discount | You are $${getDiscountDiff()} away from ${100.0 * DISCOUNT_SETTINGS['300']}%`;
    } else if(cartTotal >= 200 && cartTotal < 300){
      return `${100.0 * DISCOUNT_SETTINGS['300']}% Discount | You are $${getDiscountDiff()} away from ${100.0 * DISCOUNT_SETTINGS['400']}%`;
    } else if(cartTotal >= 300 && cartTotal < 400){
      return `${100.0 * DISCOUNT_SETTINGS['400']}% Discount | You are $${getDiscountDiff()} away from ${100.0 * DISCOUNT_SETTINGS['600']}%`;
    } else if(cartTotal >= 400 && cartTotal < 600){
      return `${100.0 * DISCOUNT_SETTINGS['600']}% Discount | You are $${getDiscountDiff()} away from ${100.0 * DISCOUNT_SETTINGS['800']}%`;
    } else if(cartTotal >= 600 && cartTotal < 800){
      return `${100.0 * DISCOUNT_SETTINGS['800']}% Discount | You are $${getDiscountDiff()} away from ${100.0 * DISCOUNT_SETTINGS['1000']}%`;
    } else if(cartTotal >= 800){
      return `${100.0 * DISCOUNT_SETTINGS['1000']}% Discount`;
    }

    return "$50 Min";
  }

  const getDiscountDiff = () => {
    let cartTotal = getCartTotal(props.cart);

    if(cartTotal >= 150 && cartTotal < 200){
      return (200 - cartTotal).toFixed(2);
    } else if(cartTotal >= 200 && cartTotal < 300){
      return (300 - cartTotal).toFixed(2);
    } else if(cartTotal >= 300 && cartTotal < 400){
      return (400 - cartTotal).toFixed(2);
    } else if(cartTotal >= 400 && cartTotal < 600){
      return (600 - cartTotal).toFixed(2);
    } else if(cartTotal >= 600 && cartTotal < 800){
      return (800 - cartTotal).toFixed(2);
    }
  }

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <LinkContainer to="/">
        <Navbar.Brand href="#">
          <img alt="img" style={{ height: 70, paddingLeft: 5 }} src={logo} />
        </Navbar.Brand>
      </LinkContainer>
      
      {isMobile && (
        <Button className="bp4-minimal addToCart" icon="shopping-cart" onClick={props.cartClick}>
            <Badge colorScheme="red">{props.cart.length}</Badge>
          </Button>
      )}
      
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/shop">
            Shop
          </Link>
          <Nav.Item>
            {getCartTotal(props.cart) === 0 && (
              <Text style={{color: 'black'}}>0% Discount</Text>
            )}
            <ProgressBar key="base" now={getCartTotal(props.cart) <= 50 ? 50 : getCartTotal(props.cart)} max={1000} label={getDiscountPercent()} className="navbar-progressbar" style={{}} />
            {/* <ProgressBar key="metric" min={0} max={1000} style={{ fontSize: 12, borderTopLeftRadius: 0, borderTopRightRadius: 0 }} className="navbar-progressbar">
              <ProgressBar style={{fontSize: 10, backgroundColor: 'silver', color: 'white'}} key={1} now={50} label={"$50 Min"} />
              <ProgressBar style={{fontSize: 10, backgroundColor: '#d8f3dc', color: 'black'}} key={2} now={50} label={"$10 Del"} />
              <ProgressBar style={{fontSize: 10, backgroundColor: '#b7e4c7', color: 'black'}} key={3} now={50} label={"Free Del"} />
              <ProgressBar style={{fontSize: 10, backgroundColor: '#95d5b2', color: 'black'}} key={4} now={50} label={"5% off"} />
              <ProgressBar style={{fontSize: 10, backgroundColor: '#74c69d', color: 'black'}} key={5} now={100} label={"10% off"} />
              <ProgressBar style={{fontSize: 10, backgroundColor: '#52b788', color: 'white'}} key={6} now={100} label={"15% off"} />
              <ProgressBar style={{fontSize: 10, backgroundColor: '#40916c', color: 'white'}} key={7} now={200} label={"20% off"} />
              <ProgressBar style={{fontSize: 10, backgroundColor: '#2d6a4f', color: 'white'}} key={8} now={200} label={"25% off"} />
              <ProgressBar style={{fontSize: 10, backgroundColor: '#1b4332', color: 'white'}} key={9} now={200} label={"30% off"} />
              
            </ProgressBar> */}
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
      
      <Navbar.Collapse className="justify-content-end">
        {!isMobile && (
          <Button className="bp4-minimal addToCart" icon="shopping-cart" onClick={props.cartClick}>
            <Badge colorScheme="red">{props.cart.length}</Badge>
          </Button>
        )}
        <LinkContainer to="/my_orders">
          <Button className="bp4-minimal" text="My Orders" />
        </LinkContainer>        
        <input className="bp4-input" placeholder="Search..." type="text" onChange={(e) => setSearch(e.target.value)} value={search} onKeyDown={(e) => checkForEnter(e)} />
        {search.length > 0 && (
          <Button className="bp4-minimal" icon="cross" onClick={() => {
            navigate("/shop");
            setSearch("");
          }} />
        )}         
      </Navbar.Collapse>

    </Navbar>
  )
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(MainNavbar);