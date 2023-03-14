import React, { useEffect, useState } from "react";
import { Card, CardBody, Heading, Stack, Text, Image, Button, ButtonGroup, CardFooter } from '@chakra-ui/react';
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import CurrencyFormat from "react-currency-format";

const Product = (props) => {
  const { product } = props;

  return (
    <Card maxW='sm' style={{ margin: 5 }}>
      <CardBody>
        <Carousel variant="dark">
          <Carousel.Item>
            <Image
              src={product.cover_photo || "https://via.placeholder.com/500?text=No+Product+Image+Available"}
              borderRadius='lg'
            />
          </Carousel.Item>
          {product?.images?.map((img) => {
            return (
              <Carousel.Item>
                <Image
                  src={img}
                  borderRadius='lg'
                />
              </Carousel.Item> 
            )
          })}
        </Carousel>

        <Stack mt='6' spacing='3'>
          <Heading size='md'>
            <Link to={"/products/" + product.slug}>
              {product.name}
            </Link>
          </Heading>
          <Text noOfLines={[2, 3, 4]}>
            {product.description}
          </Text>
          <Text color='blue.600' fontSize='2xl'>
            {/* <CurrencyFormat value={product.price} displayType={'text'} thousandSeparator={true} prefix={'$'} /> */}
          </Text>
        </Stack>
      </CardBody>

      <CardFooter>
        <ButtonGroup spacing='2'>
          <Button variant='ghost' colorScheme='blue'>
            Add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}

export default Product;