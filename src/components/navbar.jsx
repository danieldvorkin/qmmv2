

import { Button } from '@blueprintjs/core';
import { Badge } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Nav, Navbar, NavDropdown, ProgressBar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import logo from '../new_logo.svg';
import { DISCOUNT_SETTINGS } from '../utils/helpers';
import { getCategories } from '../utils/util';

const MainNavbar = (props) => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    getCategories().then((resp) => setCategories(resp));
    window.addEventListener('resize', handleWindowSizeChange);
    return () => window.removeEventListener('resize', handleWindowSizeChange);
  }, []);

  const checkForEnter = (e) => {
    if(e.keyCode === 13){
      navigate("/search/" + search);
    }
  }

  const getCurrentTotal = () => {
    if(props.cart.length > 0)
      return props.cart.map((i) => i.quantity * (i.product.price || i.product.variants[0].price)).reduce((total, curr) => total = total + curr);
    else {
      return 0;
    }
  }

  const getCartTotal = () => {
    let subtotal = 0;
    
    if(props.cart.length > 0){
      subtotal = props.cart.map((curr) => getItemSubtotal(curr));
      return subtotal.reduce((total, current) => total = total + current);
    }
    
    return subtotal;
  }

  const getVariant = (item) => {
    const { product, quantity} = item;
    return product.variants.find((item) => item.quantity === parseFloat(quantity));
  }

  const getItemSubtotal = (item) => {
    let selectedVariant = getVariant(item);
    return (selectedVariant ? selectedVariant.price : item.quantity * (item.product.price || item.product.variants[0].price));
  }

  const getDiscountPercent = () => {
    let cartTotal = getCartTotal();
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

    return "0% Discount";
  }

  const getDiscountDiff = () => {
    let cartTotal = getCartTotal();

    if(cartTotal >= 150 && cartTotal < 200){
      return 200 - cartTotal;
    } else if(cartTotal >= 200 && cartTotal < 300){
      return 300 - cartTotal;
    } else if(cartTotal >= 300 && cartTotal < 400){
      return 400 - cartTotal;
    } else if(cartTotal >= 400 && cartTotal < 600){
      return 600 - cartTotal;
    } else if(cartTotal >= 600 && cartTotal < 800){
      return 800 - cartTotal;
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
            <ProgressBar now={getCurrentTotal()} max={1000} label={getDiscountPercent()} className="navbar-progressbar" />  
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