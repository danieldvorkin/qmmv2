import { Alignment, Button, Menu, MenuItem, Navbar } from '@blueprintjs/core';
import { Popover2 } from "@blueprintjs/popover2";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logo from '../logov2.svg';

const MainNavbar = (props) => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/categories").then((resp) => {
      setCategories(resp.data)
    });
  }, []);

  const checkForEnter = (e) => {
    if(e.keyCode === 13){
      navigate("/search/" + search);
    }
  }

  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>
          <img alt="img" style={{ height: 70 }} src={logo} />
        </Navbar.Heading>
        <Link to="/" onClick={() => setSearch("")}>
          <Button className="bp4-minimal" text="Home" link="/"/>  
        </Link>
        <Link to="/shop">
          <Button className="bp4-minimal" text="Shop" link="/"/>  
        </Link>
        {/* { Object.keys(categories).length > 0 && Object.keys(categories).map((category) => {
          const list = categories[category];
          const menuItems = (
            <Menu className="bp4-minimal">
              {list && list.map((item) => {
                return (
                  <Link to={"/category/" + item.slug} onClick={() => setSearch("")}>
                    <MenuItem text={item.name}/>
                  </Link>
                )
              })}
            </Menu>
          );
          return (
            <Popover2 content={menuItems} fill={true} placement="bottom" className='bp4-minimal'>
              <Button
                alignText="left"
                fill={true}
                rightIcon="caret-down"
                text={category}
              />
            </Popover2>
          )
        })} */}
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT} className="menu-items">
        <Button className="bp4-minimal" icon="shopping-cart" onClick={props.cartClick} />
        <Navbar.Divider />
        <Button className="bp4-minimal" text="Account" />
        <input className="bp4-input" placeholder="Search..." type="text" onChange={(e) => setSearch(e.target.value)} value={search} onKeyDown={(e) => checkForEnter(e)} />
        {search.length > 0 && (
          <Button className="bp4-minimal" icon="cross" onClick={() => setSearch("")} />
        )}         
      </Navbar.Group>
    </Navbar>
  )
}

export default MainNavbar;