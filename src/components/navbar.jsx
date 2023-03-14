

import { Button } from '@blueprintjs/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Nav, Navbar, NavbarBrand, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import logo from '../logov2.svg';

const MainNavbar = (props) => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://queenmarymedical.com/api/v1/categories").then((resp) => {
      setCategories(resp.data)
    });
  }, []);

  const checkForEnter = (e) => {
    if(e.keyCode === 13){
      navigate("/search/" + search);
    }
  }

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#">
        <Link to="/">
          <img alt="img" style={{ height: 70 }} src={logo} />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#">
            <Link to="/">
              Home
            </Link>
          </Nav.Link>
          <Nav.Link href="#">
            <Link to="/shop">
              Shop
            </Link>    
          </Nav.Link>
          { Object.keys(categories).length > 0 && Object.keys(categories).map((category) => {
            const list = categories[category];
            return (
              <NavDropdown title={category} id={"dropdown-" + category}>
                {list.map((item) => {
                  return (
                    <NavDropdown.Item>
                      <Link to={"/category/" + item.slug}>{item.name}</Link>
                    </NavDropdown.Item>  
                  )
                })}
              </NavDropdown>
            )
          })}
        </Nav>
      </Navbar.Collapse>
      
      <Navbar.Collapse className="justify-content-end">
        <Button className="bp4-minimal" icon="shopping-cart" onClick={props.cartClick} />
        <Button className="bp4-minimal" text="Account" />
        <input className="bp4-input" placeholder="Search..." type="text" onChange={(e) => setSearch(e.target.value)} value={search} onKeyDown={(e) => checkForEnter(e)} />
        {search.length > 0 && (
          <Button className="bp4-minimal" icon="cross" onClick={() => setSearch("")} />
        )}         
      </Navbar.Collapse>

    </Navbar>
  )
}

export default MainNavbar;