import { Divider, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from "@chakra-ui/react";
import React from "react";
import { Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";


const Breakdown = (props) => {
  const {
    index, item, getItemSubtotal, removeItem, qtyChange, cartLength
  } = props;

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
            <p>Variant: {item.variant}</p>
          </Text>
          <div>
            <Text>Qty:{' '}</Text>
            <NumberInput value={item.quantity} onChange={(e) => qtyChange(item, e)} min={1}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </div>
          
          
          <Text>
            <strong>Breakdown:{' '}</strong>
            {item.quantity}{' '}x{' '} 
            <CurrencyFormat value={getItemSubtotal(item) || 0} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </Text>
          <Text>
            <strong>Total Price:{' '}</strong>
            <CurrencyFormat value={(getItemSubtotal(item)) || 0} displayType={'text'} thousandSeparator={true} prefix={'$'} />
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