import { Card, CardHeader, Container } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";

const AdminOrder = (props) => {
  return (
    <Container>
      <Card>
        <CardHeader>Details</CardHeader>
      </Card>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn,
    user: state.user
  }
}

export default connect(mapStateToProps)(AdminOrder);