import { Badge, Button, ButtonGroup, Card, CardBody, CardHeader, Input } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import DataTable from 'react-data-table-component';
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getOrders } from "../utils/util";

const AdminOrders = (props) => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(!props.isLoggedIn){
      navigate("/login?mustbesignedin=true")
    }

    setSelectedStatus(searchParams.get("status") || "All");

    getOrders(page, searchParams.get("status") || "All").then((resp) => {
      setOrders(resp.orders);
      setTotal(resp.total_count);
    });
  }, [page, searchParams.get("status")]);

  const STATUSES = {
    "Order Pending": "blue",
    "Order Confirmed": "orange",
    "Order Processing": "red",
    "Order Shipped": "yellow",
    "Order Delivered": "green"
  }

  const columns = [
    { name: 'ID', sortable: false, selector: row => <Link to={"/admin/orders/" + row.id}>0000{row.id}</Link> },
    { name: 'User Email', sortable: false, selector: row => row.user?.email },
    { name: 'Submitted At', sortable: true, selector: row => moment(row.submitted_at).format('LLL')},
    { name: 'Phone #', sortable: false, selector: row => row.contact_phone },
    { name: 'Status', sortable: true, selector: row => <Badge colorScheme={STATUSES[row.status]}>{row.status}</Badge> },
    { name: 'Total $', sortable: false, selector: row => { 
      return <CurrencyFormat value={row.total} displayType={'text'} decimalScale={2} fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />
    }, value: row => row.total }
  ]
  
  return (
    <Container fluid>
      <Card>
        <CardHeader>
          <ButtonGroup>
            <LinkContainer to={{ pathname: "/admin/orders" }}>
              <Button colorScheme={(selectedStatus === "All") ? 'green' : 'gray'} size='xs'>All</Button>
            </LinkContainer>
            {Object.keys(STATUSES).map((status) => {
              return (
                <LinkContainer to={{ pathname: "/admin/orders", search: "?status=" + status.slice(6) }}>
                  <Button colorScheme={selectedStatus === status.slice(6) ? STATUSES[status] : 'gray'} size='xs'>{status.slice(6)}</Button>
                </LinkContainer>
              )
            })}
          
            <div className="justify-content-end">
              <Input size="xs" placeholder="Search up an order..." />
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