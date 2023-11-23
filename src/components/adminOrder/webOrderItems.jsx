import React from "react";
import { ButtonGroup, Button, Card, CardBody, CardHeader, Input, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Select } from "@chakra-ui/react";
import { getItemSubtotal, getOrderDiscount, getOrderTotal } from "../../utils/helpers";
import { LinkContainer } from "react-router-bootstrap";
import CurrencyFormat from "react-currency-format";
import { BiTrash } from "react-icons/bi";

const WebOrderItems = (props) => {
  const { onOpen, editmode, setEditmode, order, setOrder, saveStatusChange, orderItems, handleQtyChange, handlePriceChange, removeItem, coupon } = props;
  
  return(
    <Card>
      <CardHeader>
        <Text fontSize='3xl' as='b'>Order Items</Text>
        <div style={{float: 'right', display: 'flex'}}>
          <ButtonGroup>
            <Button colorScheme={'purple'} onClick={() => onOpen()}>Add Product</Button>
            {editmode ? (      
              <Button colorScheme={'green'} onClick={() => setEditmode(false)}>Confirm Order</Button>
            ) : (
              <Button colorScheme={'orange'} onClick={() => setEditmode(true)}>Edit Order</Button>
            )}
          </ButtonGroup>
          
          <Select value={order.status} style={{marginLeft: 8}} onChange={(e) => setOrder({...order, status: e.target.value})}>
            <option value='pending'>Pending</option>
            <option value='confirmed'>Confirmed</option>
            <option value='processing'>Processing</option>
            <option value='shipped'>Shipped</option>
            <option value='delivered'>Delivered</option>
          </Select>
          <Button style={{marginLeft: 10, width: 100}} onClick={saveStatusChange}>Save</Button>
        </div>
        <hr/>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant='simple'>
            <TableCaption>
              Status: {order.status}
              <br/>
              Order SubTotal: {getOrderTotal(order.items).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}
              <br/>
              {coupon?.code?.length > 0 && (
                <>
                  Coupon: {coupon?.code}
                  <br/>
                </>
              )}
              Discount: {getOrderDiscount(order.items, coupon).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}
              <br/>
              Grand Total: {(getOrderTotal(order.items, coupon) - getOrderDiscount(order.items, coupon)).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Quantity</Th>
                <Th>Price</Th>
                {editmode && (
                  <Th>Remove</Th>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {orderItems.map((item) => {
                return (
                  <Tr>
                    <Td style={{maxWidth: 300, minWidth: 300 }}>
                      <LinkContainer to={{ pathname: "/admin/products/" + item.item.slug, search: "?order=" + order.id }} style={{cursor: 'pointer'}}>
                        <Text>{item.item.name}</Text>
                      </LinkContainer>
                    </Td>
                    <Td style={{maxWidth: 200, minWidth: 200 }}>
                      {editmode ? (
                        <Input placeholder='quantity' size='sm' value={item.quantity} onChange={(e) => handleQtyChange(item, e)}/>
                      ) : (
                        item.quantity
                      )}
                    </Td>
                    <Td style={{maxWidth: 200, minWidth: 200 }}>
                      {editmode ? (
                        <Input placeholder='custom price' size="sm" value={getItemSubtotal({ product: item.item, variant: item.quantity, quantity: item.quantity })} onChange={(e) => handlePriceChange(item, e)}/>
                      ) : (
                        <CurrencyFormat 
                          value={getItemSubtotal({ product: item.item, variant: item.quantity, quantity: item.quantity })} 
                          displayType={'text'} 
                          thousandSeparator={true} 
                          prefix={'$'} />
                      )}
                    </Td>
                    {editmode && (
                      <Td>
                        <Button colorScheme="red" onClick={() => removeItem(item)}><BiTrash /></Button>
                      </Td>
                    )}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  )
}

export default WebOrderItems;