import { CalendarIcon } from "@chakra-ui/icons";
import { Badge, Button, ButtonGroup, Card, CardBody, CardHeader, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GrMoney } from "react-icons/gr";
import { BiPurchaseTag } from "react-icons/bi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import SalesOvertime from "../components/SalesOvertime";
import Panel from "../components/panel";

const Admin = (props) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    if(!props.isLoggedIn){
      navigate("/login?mustbesignedin=true")
    }
  }, [])
  

  return (
    <Container>
      <Card>
        <CardHeader>
          <ButtonGroup>
            <Button leftIcon={<CalendarIcon style={{ marginLeft: 10 }}/>} style={{paddingRight: 20}} size="sm">Today</Button>
            <DatePicker 
              dateFormat="MMMM d, yyyy"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={<Button size="sm">Compare from {startDate.toDateString()}</Button>}
              styles={{ background: 'transparent', fontWeight: 600, paddingleft: 5 }} 
            />
          </ButtonGroup>
        </CardHeader>

        <CardBody>
          <Row>
            <Col sm="12" lg="4" style={{marginBottom: 5}}>
              <Panel title="Revenue" headerText="$1824.50" color="green" icon={<GrMoney style={{ fontSize: 18, margin: 5 }} />}>
                <Text>Testing stuff</Text>
              </Panel>
            </Col>

            <Col sm="12" lg="4" style={{marginBottom: 5}}>
              <Panel title="Products" headerText="182 (active)" color="blue" icon={<BiPurchaseTag style={{ fontSize: 18, margin: 5 }} />}>
                <Text>Testing stuff</Text>
              </Panel>
            </Col>

            <Col sm="12" lg="4" style={{marginBottom: 5}}>
              <Panel title="Orders" headerText="650 (completed)" color="orange" icon={<MdOutlineProductionQuantityLimits style={{ fontSize: 18, margin: 5 }} />}>
                <Text>Testing stuff</Text>
              </Panel>
            </Col>
          </Row>

          <br/>

          <Row>
            <Col lg={9}>
              <SalesOvertime />
            </Col>
            <Col lg={3}>
              <Panel title="Visitors" headerText="100 new visitors" color="purple" icon={<FiUsers style={{ fontSize: 18, margin: 5 }} />}>
                visitor stat goes here..  
              </Panel>
            </Col>
          </Row>
        </CardBody>
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

export default connect(mapStateToProps)(Admin);