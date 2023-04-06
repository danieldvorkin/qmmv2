import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Card, CardBody, CardHeader, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ButtonGroup, Col, Container, Navbar, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import { BiCheckCircle, BiTrash } from "react-icons/bi";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getItemSubtotal } from "../utils/helpers";
import { getOrder } from "../utils/util";

const AdminOrder = (props) => {
  const { id } = useParams();
  const [order, setOrder] = useState({});

  useEffect(() => {
    if(id){
      getOrder(id).then((resp) => setOrder(resp));
    }
  }, [id]);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Collapse className="justify-content-start">
            <Navbar.Text>
              <Link to="/admin/orders"><ChevronLeftIcon/>Back to Orders</Link>
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
          <Col lg={4}>
            <Card>
              <CardHeader>
                <Text fontSize='3xl' as='b'>Order #: 0000{order.id}</Text>
                <hr/>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <Text size="10" color="grey">Submitted At:</Text>
                    <Text>{moment(order.submitted_at).format("ll | h:mm a")}</Text>
                  </Col>

                  <Col>
                    <Text size="10" color="grey">Last Update At:</Text>
                    <Text>{moment(order.updated_at).format("ll | h:mm a")}</Text>
                  </Col>
                </Row>

                <br/><hr/><br/>

                <Row>
                  <Col>
                    <Text size="10" color="grey">Address:</Text>
                    <Text>To: {order.address?.name}</Text>
                    <Text>{`${order.address?.address1} ${order.address?.address2 ? ' - ' : ''}${order.address?.address2}`}</Text>
                    <Text>{`${order.address?.city}${order.address?.city ? ', ' : ' '}${order.address?.province}, Canada`}</Text>
                    <Text as="b">{order.address?.address_type}</Text>
                  </Col>
                </Row>

                <br/><hr/><br/>

                <Row>
                  <Col>
                    <Text size="10" color="grey">Notes:</Text>
                    <Text>{order.address?.notes}</Text>
                  </Col>

                  <Col>
                    <Text size="10" color="grey">Time Window:</Text>
                    <Text>{order.time_window}</Text>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          <Col lg={8}>
            <Card>
              <CardHeader>
                <Text fontSize='3xl' as='b'>Order Items</Text>
                <hr/>
              </CardHeader>
              <CardBody>
                <TableContainer>
                  <Table variant='simple'>
                    <TableCaption>Status: {order.status}</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Variant</Th>
                        <Th>Price</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {order.items?.map((item) => {
                        return (
                          <Tr>
                            <Td>{item.item.name}</Td>
                            <Td>{item.quantity}</Td>
                            <Td><CurrencyFormat value={getItemSubtotal({ product: item.item, variant: item.quantity, quantity: 1 })} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Td>
                          </Tr>
                        )
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            <br/>
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

export default connect(mapStateToProps)(AdminOrder);