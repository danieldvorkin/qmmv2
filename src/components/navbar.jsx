

import { Button } from '@blueprintjs/core';
import { Badge } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import logo from '../logov2.svg';
import store from '../store';
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
    console.log("Props: ", props)
  }, [props]);

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

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <LinkContainer to="/">
        <Navbar.Brand href="#">
          <img alt="img" style={{ height: 70 }} src={logo} />
        </Navbar.Brand>
      </LinkContainer>
      
      {isMobile && (
        <Button className="bp4-minimal addToCart" icon="shopping-cart" onClick={props.cartClick} />
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
          { Object.keys(categories).length > 0 && Object.keys(categories).map((category) => {
            const list = categories[category];
            return (
              <NavDropdown title={category} key={"dropdown-" + category} id={"dropdown-" + category}>
                {list.map((item) => {
                  return (
                    <LinkContainer key={item.slug} to={"/category/" + item.slug}>
                      <NavDropdown.Item>{item.name}</NavDropdown.Item>
                    </LinkContainer>
                  )
                })}
              </NavDropdown>
            )
          })}
        </Nav>
      </Navbar.Collapse>
      
      <Navbar.Collapse className="justify-content-end">
        {!isMobile && (
          <Button className="bp4-minimal addToCart" icon="shopping-cart" onClick={props.cartClick}>
            <Badge colorScheme="red">{props.cart.length}</Badge>
          </Button>
        )}
        <Button className="bp4-minimal" text="Account" />
        <input className="bp4-input" placeholder="Search..." type="text" onChange={(e) => setSearch(e.target.value)} value={search} onKeyDown={(e) => checkForEnter(e)} />
        {search.length > 0 && (
          <Button className="bp4-minimal" icon="cross" onClick={() => setSearch("")} />
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