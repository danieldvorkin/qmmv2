import { Badge, Button, ButtonGroup, Card, CardBody, CardHeader, Input } from "@chakra-ui/react";
import moment from "moment";

import { Container } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import DataTable from 'react-data-table-component';


import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { getItems, search } from "../utils/util";

const AdminProducts = (props) => {
  const navigate = useNavigate();
  const [typeOf, setTypeOf] = useState("All");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(null);

  useEffect(() => {
    if(!props.isLoggedIn){
      navigate("/login?mustbesignedin=true")
    }

    setTypeOf(searchParams.get("typeof") || "All");

    getItems(page, searchParams.get("typeof") || "All").then((resp) => {
      setProducts(resp.items);
      setTotal(resp.total_count);
    });
  }, [props, searchParams.get("typeof")]);

  useEffect(() => {
    search(searchQuery, page).then((resp) => {
      setProducts(resp.items);
    });
  }, [searchQuery, page])

  const columns = [
    { name: 'Name', sortable: false, selector: row => <Link to={"/admin/products/" + row.slug}>{row.name}</Link> },
    { name: 'Brand', sortable: false, selector: row => row.brand || '--' },
    { name: 'Inventory', sortable: false, selector: row => row.inventory },
    { name: 'Category', sortable: false, selector: row => row.category?.name || row.categoryId },
    { name: 'On Sale', sortable: false, selector: row => row.on_sale ? 'Yes' : 'No' },
    { name: 'Strain Type', sortable: false, selector: row => row.strain_type || '--' },
    { name: 'Last Update', sortable: false, selector: row => moment(row.updatedAt).format("LLL") },
  ]

  const changePage = (newPage) => {
    setPage(newPage);

    if(searchQuery){
      getItems(newPage, searchParams.get("typeof") || "All").then((resp) => {
        setProducts(resp.items);
        setTotal(resp.total_count);
      });
    }
  }
  
  return (
    <Container fluid>
      <Card>
        <CardHeader>
          <ButtonGroup>
            <LinkContainer to={{ pathname: "/admin/products" }}>
              <Button colorScheme={(typeOf === "All") ? 'green' : 'gray'} size='xs'>All</Button>
            </LinkContainer>
            {/* {Object.keys(STATUSES).map((status) => {
              return (
                <LinkContainer to={{ pathname: "/admin/products", search: "?typeof=" + typeof.slice(6) }}>
                  <Button colorScheme={selectedStatus === typeof.slice(6) ? STATUSES[status] : 'gray'} size='xs'>{typeof.slice(6)}</Button>
                </LinkContainer>
              )
            })}
           */}
            <div className="justify-content-end">
              <Input size="xs" placeholder="Search up a product..." onChange={(e) => {
                setPage(1);
                setSearchQuery(e.target.value);
              }} />
            </div>
          </ButtonGroup>
        </CardHeader>
        <CardBody>
          <DataTable
            columns={columns}
            data={products}
            pagination
            paginationServer
            paginationTotalRows={total}
            paginationComponentOptions={{noRowsPerPage: true}} 
            onChangePage={(page) => changePage(page)}
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

export default connect(mapStateToProps)(AdminProducts);