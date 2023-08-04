import { ButtonGroup, Col, Container, Form, Navbar, Row } from "react-bootstrap";
import { Card, CardBody, CardHeader, Image, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { BiCheckCircle, BiTrash } from "react-icons/bi";
import { getItem } from "../utils/util";
import Product from "../components/Product";

const AdminProduct = (props) => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const [product, setProduct] = useState({});
  
  useEffect(() => {
    if(slug){
      getItem(slug).then((resp) => setProduct(resp));
    }
  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark" className="adminNavbar">
        <Container>
          <Navbar.Collapse className="justify-content-start">
            <Navbar.Text>
              <Link to={`/admin/${orderId ? 'orders' : 'products'}` + (orderId ? "/" + orderId : '')}><ChevronLeftIcon/>Back to {orderId ? 'Order' : 'Products'}</Link>
            </Navbar.Text>
          </Navbar.Collapse>

          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <ButtonGroup>
                <Link style={{margin: '0px 5px'}}><BiTrash className="onIconHoverDanger" size="25" /></Link>
                <Link style={{margin: '0px 5px'}}><BiCheckCircle className="onIconHoverSuccess" size="25" /></Link>
              </ButtonGroup>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container style={{marginTop: 20}}>
        <Row>
          <Col lg={12}>
            <Card style={{marginTop: 20}}>
              <CardBody>
                <Row>
                  <Col lg={4}>
                    <Text as="b">Product Card Preview</Text>
                    <br/>
                    <Product product={product} />
                  </Col>
                  <Col lg={8}>
                    <Form>
                      <Form.Group className="mb-3" controlId="productName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" onChange={(e) => setProduct({...product, 'name': e.target.value })} value={product?.name} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="productName">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" placeholder="Enter description" onChange={(e) => setProduct({...product, 'description': e.target.value })} value={product?.description} rows={3} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="productPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" placeholder="Enter price" onChange={(e) => setProduct({...product, 'price': e.target.value })} value={product?.price} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="productStrainType">
                        <Form.Label>Strain Type</Form.Label>
                        <Form.Select aria-label="Default select example" onChange={(e) => setProduct({...product, 'strain_type': e.target.value })} value={product?.strain_type}>
                          <option value="Sativa">Sativa</option>
                          <option value="Sativa Hybrid">Sativa Hybrid</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Indica Hybrid">Inidica Hybrid</option>
                          <option value="Indica">Indica</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="productThc">
                        <Form.Check type="checkbox" label={"Variant by Weight"} placeholder="Enter " onChange={(e) => setProduct({...product, 'variant_by_weight': e.target.value })} value={product?.variant_by_weight} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="productThc">
                        <Form.Label>THC</Form.Label>
                        <Form.Control type="text" placeholder="Enter THC" onChange={(e) => setProduct({...product, 'thc': e.target.value })} value={product?.thc} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="productCbd">
                        <Form.Label>CBD</Form.Label>
                        <Form.Control type="text" placeholder="Enter cbd" onChange={(e) => setProduct({...product, 'cbd': e.target.value })} value={product?.cbd} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="productBrand">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control type="text" placeholder="Enter brand name" onChange={(e) => setProduct({...product, 'brand': e.target.value })} value={product?.brand} />
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn,
    user: state.user
  }
}

export default connect(mapStateToProps)(AdminProduct);