import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../manageCart";
import logo from '../new_logo.svg';

const AdminNavbar = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = () => {
    dispatch(logout());
    navigate('/login');
  }
  
  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <LinkContainer to="/">
        <Navbar.Brand href="#">
          <img alt="img" style={{ height: 70, paddingLeft: 5 }} src={logo} />
        </Navbar.Brand>
      </LinkContainer>
      
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Link className="nav-link" to="/">
            Home
          </Link>
          {props.isLoggedIn ? (
            <>
              <Link className="nav-link" to="/admin">
                Dasboard
              </Link>
              <Link className="nav-link" to="/admin/products">
                Products
              </Link>
              <Link className="nav-link" to="/admin/orders">
                Orders
              </Link>
            </>
          ) : (
            <Link className="nav-link" to="/login">
              Login
            </Link>
          )} 
        </Nav>
      </Navbar.Collapse>

      {props.isLoggedIn && (
        <Navbar.Collapse className="justify-content-end">
          <div className="nav-link" onClick={() => logoutUser()} style={{cursor: 'pointer'}}>Logout</div>
        </Navbar.Collapse>
      )}
    </Navbar>
  )
}
const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn,
    user: state.user
  }
}

export default connect(mapStateToProps)(AdminNavbar);