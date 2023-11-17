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
import { adminOrders, getItems, getOrders } from "../utils/util";
import moment from "moment";
import CurrencyFormat from "react-currency-format";
import AdminOrders from './AdminOrders';

const Admin = (props) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todaysRevenue, setTodaysRevenue] = useState(0);

  useEffect(() => {
    if(props.isLoggedIn){
      if(!props.user?.admin){
        navigate("/shop");
      }

      const date = moment(selectedDate || new Date()).format('YYYY-MM-DD')
      adminOrders(date).then((resp) => {
        setOrders(resp);
      });

      getItems(1, 'All').then((resp) => setProducts(resp));

      getOrders(1, 'delivered').then((resp) => setCompletedOrders(resp));
    }

    if(!props.isLoggedIn){
      navigate("/login?mustbesignedin=true")
    }
  }, [selectedDate]);
  
  useEffect(() => {
    if(orders?.length > 0){
      setTodaysRevenue(orders.map((order) => order.total).reduce((acc, curr) => acc + curr, 0));
    } else {
      setTodaysRevenue(0);
    }
  }, [orders]);

  const formatCurrency = (amount) => {
    return (
      <CurrencyFormat 
        value={amount} 
        displayType={'text'} 
        decimalScale={2} 
        fixedDecimalScale={true} 
        thousandSeparator={true} 
        prefix={'$'} 
      />
    )
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <ButtonGroup>
            <Button leftIcon={<CalendarIcon style={{ marginLeft: 10 }}/>} onClick={() => setSelectedDate(new Date())} style={{paddingRight: 20}} size="sm">Today</Button>
            <DatePicker 
              dateFormat="MMMM d, yyyy"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              customInput={<Button size="sm">{selectedDate?.toDateString()}</Button>}
              styles={{ background: 'transparent', fontWeight: 600, paddingleft: 5 }} 
            />
          </ButtonGroup>
        </CardHeader>

        <CardBody>
          <Row>
            <Col sm="12" lg="4" style={{marginBottom: 5}}>
              <Panel title="Revenue" headerText={formatCurrency(todaysRevenue)} color="green" icon={<GrMoney style={{ fontSize: 18, margin: 5 }} />}>
                <Text>{orders?.length} Orders today</Text>
              </Panel>
            </Col>

            <Col sm="12" lg="4" style={{marginBottom: 5}}>
              <Panel title="Products" headerText={`${products?.total_count || 0} (total)`} color="blue" icon={<BiPurchaseTag style={{ fontSize: 18, margin: 5 }} />}>
                <Text>All products</Text>
              </Panel>
            </Col>

            <Col sm="12" lg="4" style={{marginBottom: 5}}>
              <Panel title="Orders" headerText={`${completedOrders?.total_count || 0}`} color="orange" icon={<MdOutlineProductionQuantityLimits style={{ fontSize: 18, margin: 5 }} />}>
                <Text>All Completed Orders</Text>
              </Panel>
            </Col>
          </Row>

          <br/>

          <Row>
            <Col>
              <AdminOrders />
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