import { CalendarIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GrMoney } from "react-icons/gr";
import { BiPurchaseTag } from "react-icons/bi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import Panel from "../components/panel";
import { adminOrders } from "../utils/util";
import moment from "moment";
import CurrencyFormat from "react-currency-format";
import AdminOrders from "./AdminOrders";

import { useQuery } from "@apollo/client";
import { GET_ORDERS } from "./graphql/orders";
import { GET_PRODUCTS } from "./graphql/items";

const Admin = (props) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  // const [products, setProducts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [dateRange, setDateRange] = useState([])

  const {
    loading,
    error,
    data: deliveredOrders,
  } = useQuery(GET_ORDERS, { variables: { statuses: ["Order Delivered", "delivered", "Delivered"] } });

  const {
    loading: itemsLoading,
    error: itemsError,
    data: items
  } = useQuery(GET_PRODUCTS);

  useEffect(() => {
    if (props.isLoggedIn) {
      if (!props.user?.admin) {
        navigate("/shop");
      }

      setDateRange([])
      const date = moment(selectedDate || new Date()).format("YYYY-MM-DD");
      adminOrders(date).then((resp) => {
        setOrders(resp);
      });
    }

    if (!props.isLoggedIn) {
      navigate("/login?mustbesignedin=true");
    }
  }, [selectedDate]);

  useEffect(() => {
    if (orders?.length > 0) {
      setTodaysRevenue(
        orders.map((order) => {
          return order.total
        }).reduce((acc, curr) => acc + curr, 0),
      );
    } else {
      setTodaysRevenue(0);
    }
  }, [orders]);

  const formatCurrency = (amount) => {
    return (
      <CurrencyFormat
        value={amount}
        displayType={"text"}
        decimalScale={2}
        fixedDecimalScale={true}
        thousandSeparator={true}
        prefix={"$"}
      />
    );
  };

  const total = () => {
    if (!loading && !error) {
      return deliveredOrders?.orders
        .map((order) => {
          return order.lineItems
            .map((i) => {
              return i.quantity * (i.item?.price || 0); // Use 0 as the default value for undefined prices
            })
            .reduce((a, c) => a + c, 0);
        })
        .reduce((a, c) => a + c, 0);
    }
  
    return 0; // Return a default value or handle the case when there are loading or error conditions.
  };

  const avgProductPrice = () => {
    if (!itemsLoading && !itemsError) {
      const prices = items.items.map((i) => i.price);
  
      if (prices.length > 0) {
        const total = prices.reduce((acc, price) => acc + price, 0);
        const average = total / prices.length;
  
        return average;
      }
    }
  
    return 0;
  };

  const getInStockItems = (items) => {
    if(!!items){
      return items.items.filter((i) => i.inventory > 0).length;
    }

    return 0;
  }

  const handleNewDateRange = () => {
    const currentDate = moment();

    // Get the start of the week (Sunday) and end of the week (Saturday)
    const startOfWeek = currentDate.clone().startOf('week').format('ddd MMM DD YYYY');
    const endOfWeek = currentDate.clone().endOf('week').format('ddd MMM DD YYYY');

    // Update the state with the date range
    setDateRange([startOfWeek, endOfWeek]);
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <ButtonGroup>
            <Button
              leftIcon={<CalendarIcon style={{ marginLeft: 10 }} />}
              onClick={() => setSelectedDate(new Date())}
              style={{ paddingRight: 20 }}
              size="sm"
            >
              Today
            </Button>
            <Button
              leftIcon={<CalendarIcon style={{ marginLeft: 10 }} />}
              onClick={handleNewDateRange}
              style={{ paddingRight: 32, paddingLeft: 28 }}
              size="sm"
            >
              This week
            </Button>
            <DatePicker
              dateFormat="MMMM d, yyyy"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              customInput={
                <Button size="sm">{selectedDate?.toDateString()}</Button>
              }
              styles={{
                background: "transparent",
                fontWeight: 600,
                paddingleft: 5,
              }}
            />
          </ButtonGroup>
          
          <Row style={{margin: '10px 0px', }}>
            <Col>
              <p>
                <b>Selected Date: </b>
                {dateRange?.length > 0 ? (
                  dateRange[0] + " - " + dateRange[1]
                ) : (
                  selectedDate?.toDateString()
                )}
              </p>
            </Col>
          </Row>
        </CardHeader>

        <CardBody>
          <Row>
            <Col sm="12" lg="4" style={{ marginBottom: 5 }}>
              <Panel
                title="Revenue"
                headerText={formatCurrency(todaysRevenue)}
                color="green"
                icon={<GrMoney style={{ fontSize: 18, margin: 5 }} />}
              >
                <Text>{orders?.length} Orders today</Text>
              </Panel>
            </Col>

            <Col sm="12" lg="4" style={{ marginBottom: 5 }}>
              <Panel
                link={"/admin/products"}
                onClick={() => navigate("/admin/products")}
                title="Products"
                headerText={`${items?.items?.length || 0} (total)`}
                color="blue"
                icon={<BiPurchaseTag style={{ fontSize: 18, margin: 5 }} />}
              >
                <Text>{getInStockItems(items)} (in stock)</Text>
                <Text>Avg. Product Price: {formatCurrency(avgProductPrice())}</Text>
              </Panel>
            </Col>

            <Col sm="12" lg="4" style={{ marginBottom: 5 }}>
              <Panel
                link="/admin/orders"
                title="Completed Orders | All Time"
                headerText={`${
                  deliveredOrders?.orders?.length || 0
                }`}
                color="orange"
                icon={
                  <MdOutlineProductionQuantityLimits
                    style={{ fontSize: 18, margin: 5 }}
                  />
                }
              >
                Total: {formatCurrency(total())} 
              </Panel>
            </Col>
          </Row>

          <br />

          <AdminOrders />
            
        </CardBody>
      </Card>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn,
    user: state.user,
  };
};

export default connect(mapStateToProps)(Admin);
