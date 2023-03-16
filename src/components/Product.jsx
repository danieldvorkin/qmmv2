import React from "react";
import { Card, CardBody, Heading, Stack, Text, Image, Button, ButtonGroup, CardFooter, CardHeader } from '@chakra-ui/react';
import { Badge, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import { useDispatch } from "react-redux";
import { add } from "../manageCart";

const Product = (props) => {
  const { product, category } = props;
  
  const firstVariant = product.variants[0];
  const dispatch = useDispatch();

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
          <Badge pill bg={getBadgeColor(product.category?.type_of || category?.type_of)} style={{ padding: 5, marginBottom: 5, fontSize: 12 }}>
            {`${product.category?.type_of || category?.type_of}`}
          </Badge>
        </CardHeader>
        <Carousel variant="dark">
          <Carousel.Item>
            <Image
              src={product.cover_photo || "https://via.placeholder.com/500?text=No+Product+Image+Available"}
              borderRadius='lg'
            />
          </Carousel.Item>
          {product?.images?.map((img) => {
            return (
              <Carousel.Item key={img}>
                <Image
                  src={img}
                  borderRadius='lg'
                />
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

          <Text noOfLines={[3, 3]}>
            <strong style={{fontSize: 10}}>THC:{' '}</strong>{product.thc}{' | '}
            <strong style={{fontSize: 10}}>CBD:{' '}</strong>{product.cbd}{' | '}
            <strong style={{fontSize: 10}}>BRAND:{' '}</strong>{product.brand}<br/>
            {product.description || 'No Description Available'}
          </Text>
          <Text color='blue.600' fontSize='2xl'>
            <CurrencyFormat value={product.price || firstVariant?.price || 0} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </Text>
        </Stack>
      </CardBody>

      <CardFooter>
        <ButtonGroup spacing='2' style={{width: '100%'}}>
          <Button colorScheme='green' onClick={() => dispatch(add({product: product}))} style={{width: '100%'}}>
            Add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}

export default Product;