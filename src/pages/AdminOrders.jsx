import { Badge, Button, ButtonGroup, Card, CardBody, CardHeader, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import DataTable from 'react-data-table-component';
import { LinkContainer } from "react-router-bootstrap";
import { useSearchParams } from "react-router-dom";
import { getOrders } from "../utils/util";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
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
    { name: 'ID', sortable: false, selector: row => `0000${row.id}` },
    { name: 'User Email', sortable: false, selector: row => row.user?.email },
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
            <LinkContainer to={{ pathname: "/admin/orders", search: "?status=Pending" }}>
              <Button colorScheme={selectedStatus === "Pending" ? 'green' : 'gray'} size='xs'>Pending</Button>
            </LinkContainer>
            <LinkContainer to={{ pathname: "/admin/orders", search: "?status=Confirmed" }}>
              <Button colorScheme={selectedStatus === "Confirmed" ? 'green' : 'gray'} size='xs'>Confirmed</Button>
            </LinkContainer>
            <LinkContainer to={{ pathname: "/admin/orders", search: "?status=Processing" }}>
              <Button colorScheme={selectedStatus === "Processing" ? 'green' : 'gray'} size='xs'>Processing</Button>
            </LinkContainer>
            <LinkContainer to={{ pathname: "/admin/orders", search: "?status=Shipped" }}>
              <Button colorScheme={selectedStatus === "Shipped" ? 'green' : 'gray'} size='xs'>Shipped</Button>
            </LinkContainer>
            <LinkContainer to={{ pathname: "/admin/orders", search: "?status=Delivered" }}>
              <Button colorScheme={selectedStatus === "Delivered" ? 'green' : 'gray'} size='xs'>Delivered</Button>
            </LinkContainer>

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

export default AdminOrders;