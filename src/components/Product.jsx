import React, { useState } from "react";
import { Card, CardBody, Heading, Stack, Text, Image, Button, ButtonGroup, CardFooter, CardHeader, Select } from '@chakra-ui/react';
import { Badge, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import { useDispatch } from "react-redux";
import { add } from "../manageCart";
import { LinkContainer } from "react-router-bootstrap";

const Product = (props) => {
  const { product, category } = props;
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const [numOfLines, setNumOfLines] = useState(3);

  const getBadgeColor = (typeOf) => {
    let colors = {
      "Vapeware": "success",
      "Strains": "info",
      "Edibles": "warning",
      "Extracts": "danger"
    }

    return colors[typeOf];
  }
  
  return (
    <Card maxW='sm' className="productCard">
      <CardBody style={{padding: 5}}>
        <CardHeader style={{padding: 0}}>
          <Badge bg={getBadgeColor(product.category?.type_of || category?.type_of)} style={{ padding: 5, marginBottom: 5, fontSize: 12 }}>
            {`${product.category?.type_of || category?.type_of}`}
          </Badge>
        </CardHeader>

        <Carousel variant="dark">
          <Carousel.Item style={{cursor: 'pointer'}}>
            <LinkContainer to={"/products/" + product.slug}>
              <Image
                src={product.cover_photo || "https://via.placeholder.com/500?text=No+Product+Image+Available"}
                borderRadius='lg'
              />
            </LinkContainer>
          </Carousel.Item>
          {product?.images?.map((img) => {
            return (
              <Carousel.Item key={img}>
                <LinkContainer to={"/products/" + product.slug}>
                  <Image
                    src={img}
                    borderRadius='lg'
                  />
                </LinkContainer>
              </Carousel.Item> 
            )
          })}
        </Carousel>

        <Stack mt='2' ml="2" mr="2" spacing='1'>
          <Heading size='sm' style={{minHeight: 40}}>
            <Link to={"/products/" + product.slug}>
              {product.name}
            </Link>
          </Heading>

          <Text noOfLines={numOfLines}>
            <strong style={{fontSize: 10}}>THC:{' '}</strong>{product.thc?.length > 1 ? product.thc : ''}{' | '}
            <strong style={{fontSize: 10}}>CBD:{' '}</strong>{product.cbd || ''}{' | '}
            <strong style={{fontSize: 10}}>BRAND:{' '}</strong>{product.brand || ''}<br/>
            <span onClick={() => setNumOfLines(numOfLines === 3 ? 10 : 3)}>{product.description || 'No Description Available'}</span>
          </Text>
        </Stack>
      </CardBody>

      <CardFooter style={{display: 'block', margin: '10 auto', paddingLeft: 10, textAlign: 'center'}}>
        {category?.type_of === "Strains" || product.category?.type_of === "Strains" ? (
          <ButtonGroup>
            {[1, 3.5, 7, 14, 28].map((variant) => {
              return (
                <Button style={{fontSize: 12, padding: 10}} onClick={() => dispatch(add({product: product, quantity: variant}))}>
                  {variant}g<br/>${(variant * product.price).toFixed(2)}
                </Button>
              )
            })}
          </ButtonGroup>
        ): (
          <>
            <ButtonGroup spacing='2' style={{width: '100%'}}>
              <Button style={{ width: 130 }} onClick={() => (quantity - 1) > 0 ? setQuantity(quantity - 1) : null}>-</Button>
              <input type="number" min={0} className="chakra-input-custom chakra-input-custom-2" value={quantity} onChange={(e) => parseFloat(e.target.value) > 0.0 ? setQuantity(parseFloat(e.target.value)) : null} />
              <Button style={{ width: 130 }} onClick={() => setQuantity(quantity + 1)}>+</Button>
            </ButtonGroup>

            <ButtonGroup spacing='2' style={{width: '100%', marginTop: 10}}>
              <Button colorScheme='green' onClick={() => dispatch(add({product: product, quantity: quantity}))} style={{width: '100%'}}>
                Add to cart
              </Button>
            </ButtonGroup>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

export default Product;