import { Badge, Button, ButtonGroup, Card, CardBody, CardHeader, Input } from "@chakra-ui/react";
import moment from "moment";

import { Container } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import DataTable from 'react-data-table-component';


import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { getItems, getItemsBySort, search } from "../utils/util";

const AdminProducts = (props) => {
  const navigate = useNavigate();
  const [typeOf, setTypeOf] = useState("All");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [sort, setSort] = useState("");
  const [sortDir, setSortDir] = useState("");

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
    console.log("page changed", page)
    if(sort && sortDir && !Boolean(searchQuery)){
      getItemsBySort(page, sort, sortDir).then((resp) => {
        setProducts(resp.items)
        setTotal(resp.total_count);
      })
    } else if(searchQuery) {
      search(searchQuery, page).then((resp) => {
        setProducts(resp.items);
        setTotal(resp.total_count);
      });
    } else {
      getItems(page, searchParams.get("typeof") || "All").then((resp) => {
      setProducts(resp.items);
      setTotal(resp.total_count);
    });
    }
  }, [searchQuery, page])

  const columns = [
    { name: 'Name', sortable: true, selector: row => <Link to={"/admin/products/" + row.slug}>{row.name}</Link> },
    { name: 'Brand', sortable: true, selector: row => row.brand || '--' },
    { name: 'Inventory', sortable: true, selector: row => row.inventory },
    { name: 'Category', sortable: false, selector: row => row.category?.name || row.categoryId },
    { name: 'On Sale', sortable: false, selector: row => row.on_sale ? 'Yes' : 'No' },
    { name: 'Strain Type', sortable: false, selector: row => row.strain_type || '--' },
    { name: 'Last Update', sortable: false, selector: row => moment(row.updatedAt).format("LLL") },
  ]

  const changePage = (newPage) => {
    setPage(newPage);
  }

  const handleSort = (column, sortDirection) => {
    if(column){
      setSort(column.name?.toLowerCase());
      setSortDir(sortDirection);

      if(Boolean(searchQuery)){
        search(searchQuery, page, column.name?.toLowerCase(), sortDirection).then((resp) => {
          setProducts(resp.items)
          setTotal(resp.total_count);
        })
      } else {
        getItemsBySort(page, column.name?.toLowerCase(), sortDirection).then((resp) => {
          setProducts(resp.items)
          setTotal(resp.total_count);
        })
      }
    }
    
  }
  
  return (
    <Container fluid>
      <Card>
        <CardHeader>
          <ButtonGroup>
            <div className="justify-content-end">
              <Input size="sm" placeholder="Search up a product..." onChange={(e) => {
                setPage(1);
                setSearchQuery(e.target.value);
              }} />
            </div>
          </ButtonGroup>
          <ButtonGroup style={{float: 'right'}}>
            <Button color="green" onClick={() => navigate("/admin/products/new")}>Add New Product</Button>
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
            onSort={handleSort}
            sortServer
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