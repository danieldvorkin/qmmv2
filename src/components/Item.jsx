import React from 'react';
import CurrencyFormat from 'react-currency-format';
import { Card, CardBody, Heading, Stack, Text, Image, Button, ButtonGroup, CardFooter } from '@chakra-ui/react';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';

const Item = (props) => {
  let { item } = props;

  return (
    <h1>Item page</h1>
  )
}

export default Item;