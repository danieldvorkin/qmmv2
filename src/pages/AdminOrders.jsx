import { useQuery } from "@apollo/client";
import { Badge, Button, ButtonGroup, Card, CardBody, CardHeader, Input } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import DataTable from 'react-data-table-component';
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getTableGrandTotal } from "../utils/helpers";
import { getOrders, searchOrders } from "../utils/util";
import { GET_COUPONS } from "./graphql/coupons";

const AdminOrders = (props) => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { loading: availableCouponsLoading, data: availableCoupons
  } = useQuery(GET_COUPONS);

  useEffect(() => {
    if(!props.isLoggedIn){
      navigate("/login?mustbesignedin=true")
    }

    setSelectedStatus(searchParams.get("status") || "All");

    if(Boolean(query)){
      searchOrders(query, page, searchParams.get("status") || "All").then((resp) => {
        setOrders(resp.orders);
        setTotal(resp.total_count);
      })
    } else {
      getOrders(page, searchParams.get("status") || "All").then((resp) => {
        setOrders(resp.orders);
        setTotal(resp.total_count);
      });
    }
    
  }, [page, searchParams.get("status"), query]);

  const STATUSES = {
    "pending": "blue",
    "Order Pending": "blue",
    "Order Confirmed": "orange",
    "Order Processing": "red",
    "Order Shipped": "yellow",
    "Order Delivered": "green"
  }

  const getRowCouponObj = (order) => {
    if(order && order?.coupon_used && availableCoupons?.coupons?.length > 0){
      return availableCoupons.coupons.find((c) => c.code === order.coupon_code)
    }
  }

  const columns = [
    { name: 'ID', sortable: false, selector: row => <Link to={"/admin/orders/" + row.id}>00{row.id}</Link>, width: '90px' },
    { name: 'User Email', sortable: false, selector: row => row.user?.email },
    { name: 'Submitted At', sortable: true, selector: row => moment(row.submitted_at).format('LLL')},
    { name: 'Phone #', sortable: false, selector: row => row.contact_phone, width: '140px' },
    { name: 'Status', sortable: true, selector: row => <Badge colorScheme={STATUSES[row.status]}>{row.status === 'pending' ? 'ORDER PENDING' : row.status}</Badge>, width: '150px' },
    { name: 'Total $', sortable: false, selector: row => { 
      return <CurrencyFormat value={row.total || getTableGrandTotal(row.line_items, getRowCouponObj(row))} displayType={'text'} decimalScale={2} fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />
    }, value: row => row.total, width: '120px' },
    { name: 'Coupon', sortable: false, selector: row => row.coupon_code, width: '150px' }
  ]

  const getBasePathname = () => {
    return window.location.href.includes('/orders') ? "/admin/orders" : "/admin";
  }
  
  return (
    <Container fluid>
      <Card>
        <CardHeader>
          <ButtonGroup>
            <LinkContainer to={{ pathname: getBasePathname() }}>
              <Button colorScheme={(selectedStatus === "All") ? 'green' : 'gray'} size='xs'>All</Button>
            </LinkContainer>
            {Object.keys(STATUSES).map((status) => {
              if(status !== 'pending'){
                return (
                  <LinkContainer to={{ pathname: getBasePathname(), search: "?status=" + status.slice(6) }}>
                    <Button colorScheme={selectedStatus === status.slice(6) ? STATUSES[status] : 'gray'} size='xs'>{status.slice(6)}</Button>
                  </LinkContainer>
                )
              }
            })}
          
            <div className="justify-content-end">
              <Input size="xs" placeholder="Search up an order..." value={query} onChange={(e) => setQuery(e.target.value)}/>
            </div>
          </ButtonGroup>
        </CardHeader>
        <CardBody>
          <DataTable
            columns={columns}
            data={orders}
            pagination
            paginationServer
            paginationTotalRows={total}
            paginationComponentOptions={{noRowsPerPage: true}} 
            onChangePage={(page) => setPage(page)}
          />
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

export default connect(mapStateToProps)(AdminOrders);