import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const Admin = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if(!props.isLoggedIn){
      navigate("/login?mustbesignedin=true")
    }
  }, [])
  

  return (
    <h1>Welcome to the Admin Panel</h1>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn,
    user: state.user
  }
}

export default connect(mapStateToProps)(Admin);