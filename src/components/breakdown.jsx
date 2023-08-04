import { Button, ButtonGroup, Divider, Text, Badge } from "@chakra-ui/react";
import React from "react";
import { Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";


const Breakdown = (props) => {
  const {
    index, item, getItemSubtotal, removeItem, qtyChange, cartLength, discountPercent
  } = props;

  console.log("Discount Total: ", discountPercent)

  return(
    <div key={"index-" + index}>
      <Row style={{paddingLeft: 10}}>
        <Col xs={4} lg={3} style={{paddingTop: 12}}>
          {item.product?.cover_photo && (
            <img src={item.product.cover_photo} alt={"img-" + index} />
          )}
        </Col>
        <Col>
          <Text>
            <strong>{item.product?.name}</strong>
          </Text>
          <div>
            <ButtonGroup spacing='1' style={{width: '100%'}}>
              <Button onClick={() => (item.quantity - 1) > 0 ? qtyChange(item, item.quantity - 1) : null}>-</Button>
              <input type="number" min={0} step="any" className="chakra-input-custom chakra-input-custom-2" value={item.quantity} onChange={(e) => qtyChange(item, parseFloat(e.target.value))} />
              <Button onClick={() => qtyChange(item, item.quantity + 1)}>+</Button>
            </ButtonGroup>
          </div>
          
          <Text style={{ marginTop: 10 }}>
            <strong>Total Price:{' '}</strong>
            {discountPercent ? (
              <>
                <Badge colorScheme="red">
                  <span style={{textDecoration: 'line-through'}}>
                    <CurrencyFormat value={(getItemSubtotal(item)) || 0} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                  </span>
                </Badge>
                <Badge colorScheme="green">
                  <CurrencyFormat value={(getItemSubtotal(item) - (getItemSubtotal(item) * discountPercent)) || 0} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Badge>
              </>
            ) : (
              <CurrencyFormat value={(getItemSubtotal(item)) || 0} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            )}            
          </Text>
        </Col>
        <Col xs={2} style={{ textAlign: 'right', paddingRight: 30, paddingTop: 17 }}>
          <Text onClick={() => removeItem(item.product?.id, item.variant, item.quantity)} style={{ cursor: 'pointer' }}>X</Text>
        </Col>
      </Row>
      {index !== cartLength -1 && (
        <Divider mt={2} mb={2} />
      )}
    </div>
  )
}

export default Breakdown;