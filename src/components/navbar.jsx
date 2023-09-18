

import { Button } from '@blueprintjs/core';
import { Badge, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Nav, Navbar, ProgressBar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import logo from '../new_logo.svg';
import { DISCOUNT_SETTINGS, getCartTotal, getDiscountTotal, getGrandTotal } from '../utils/helpers';

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
    
    if(cartTotal < 50){
      return `$50 Min. Order | You are $${getDiscountDiff()} away`;
    } else if(cartTotal >= 50 && cartTotal < 100){
      return `+$10 Delivery | You are $${getDiscountDiff()} away from free delivery`;
    } else if(cartTotal >= 100 && cartTotal < 150){
      return `Free Delivery | You are $${getDiscountDiff()} away from ${100.0 * DISCOUNT_SETTINGS['200']}%`;
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

    return '';
  }

  const getDiscountDiff = () => {
    let cartTotal = getCartTotal(props.cart);

    if(cartTotal < 50){
      return (50 - cartTotal).toFixed(2);
    } else if(cartTotal >= 100 && cartTotal < 150) {
      return (150 - cartTotal).toFixed(2);
    } else if(cartTotal >= 150 && cartTotal < 200){
      return (200 - cartTotal).toFixed(2);
    } else if(cartTotal >= 200 && cartTotal < 300){
      return (300 - cartTotal).toFixed(2);
    } else if(cartTotal >= 300 && cartTotal < 400){
      return (400 - cartTotal).toFixed(2);
    } else if(cartTotal >= 400 && cartTotal < 600){
      return (600 - cartTotal).toFixed(2);
    } else if(cartTotal >= 600 && cartTotal < 800){
      return (800 - cartTotal).toFixed(2);
    } else {
      return (100 - cartTotal).toFixed(2);
    }
  }
  
  return (
    <Navbar bg="light" expand="lg" sticky="top">
      {!isMobile && (
        <LinkContainer to="/">
          <Navbar.Brand href="#">
            <img alt="img" style={{ height: 70, paddingLeft: 5 }} src={logo} />
          </Navbar.Brand>
        </LinkContainer>
      )}
      
      {isMobile && (
        <>
          <Text className="nav-link" style={{ fontSize: 10, width: '80%', paddingLeft: 15 }}>
            <div style={{display: 'block', float: 'right'}}>
              <Button className="bp4-minimal addToCart" icon="shopping-cart" onClick={props.cartClick}>
                <Badge colorScheme="red"><p style={{textDecoration: getDiscountTotal(props.cart) > 0 ? 'line-through' : ''}}>${getCartTotal(props.cart).toFixed(2)}</p></Badge>
                {getDiscountTotal(props.cart) > 0 && (
                  <Badge colorScheme="green">${getGrandTotal(props.cart).toFixed(2)}</Badge>
                )}
              </Button>
            </div>
            <strong>{getDiscountPercent(props.cart)}</strong>
          </Text>
        </>
      )}
      
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Link className="nav-link" to="/shop">
            Shop
          </Link>
          {!isMobile && (
            <Text className="nav-link"><strong>{getDiscountPercent(props.cart)}</strong></Text>
          )}
          {isMobile && (
          <>
            <Link className="nav-link" to="/my_orders">
              My Orders
            </Link>

            {props.isLoggedIn && props.user?.admin && (
              <LinkContainer to="/admin">
                <Button className="bp4-minimal" text="Admin" />
              </LinkContainer>
            )}

            {!props.isLoggedIn && (
              <LinkContainer to="/login">
                <Button className="bp4-minimal" text="Login" />
              </LinkContainer>
            )}
          </>
        )}
        </Nav>
      </Navbar.Collapse>
      
      <Navbar.Collapse className="justify-content-end" style={{top: isMobile ? '-10px' : 0}}>
        {!isMobile && (
          <>
            <Button className="bp4-minimal addToCart" icon="shopping-cart" onClick={props.cartClick}>
              <Badge colorScheme="red"><p style={{textDecoration: getDiscountTotal(props.cart) > 0 ? 'line-through' : ''}}>${getCartTotal(props.cart).toFixed(2)}</p></Badge>
              {getDiscountTotal(props.cart) > 0 && (
                <Badge colorScheme="green">${getGrandTotal(props.cart).toFixed(2)}</Badge>
              )}
              
            </Button>
            
            <LinkContainer to="/my_orders">
              <Button className="bp4-minimal" text="My Orders" />
            </LinkContainer>

            {props.isLoggedIn && props.user?.admin && (
              <LinkContainer to="/admin">
                <Button className="bp4-minimal" text="Admin" />
              </LinkContainer>
            )}

            {!props.isLoggedIn && (
              <LinkContainer to="/login">
                <Button className="bp4-minimal" text="Login" />
              </LinkContainer>
            )}
          </>
        )}
        
        <input className="bp4-input" style={{width: isMobile ? '100%' : 200}} placeholder="Search..." type="text" onChange={(e) => setSearch(e.target.value)} value={search} onKeyDown={(e) => checkForEnter(e)} />
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
    cart: state.cart,
    isLoggedIn: state.isLoggedIn,
    user: state.user,
    token: state.token
  }
}

export default connect(mapStateToProps)(MainNavbar);