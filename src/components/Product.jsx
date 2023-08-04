import React, { useState } from "react";
import { Card, CardBody, Heading, Stack, Text, Image, Button, ButtonGroup, CardFooter, CardHeader, Select } from '@chakra-ui/react';
import { Badge, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { add } from "../manageCart";
import { LinkContainer } from "react-router-bootstrap";
import { getItemDiscount } from "../utils/helpers";

const Product = (props) => {
  const { product, category, cart } = props;
  
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const getBadgeColor = (typeOf) => {
    let strainColors = {
      "Indica": "#682D63",
      "Sativa": "#F26419",
      "Hybrid": "#138A36",
      "Indica Hybrid": "#4092B5",
      "Sativa Hybrid": "#F6AE2D",
    }

    return strainColors[typeOf];
  }

  const showInCartBorder = () => {
    if(cart && product){
      return cart.filter((item) => item.product.id === product.id).length > 0 ? 'showInCart' : '';
    }
  }

  const getCartQty = () => {
    if(cart && product){
      let item = cart.filter((i) => i.product.id === product.id)[0];
      
      if(item){
        return `${item.quantity}${item.variant_by_weight ? 'g' : ''} in Cart | ${getItemDiscount(item, cart)}`
      }
    }
  }
  
  return (
    <Card maxW='sm' className={`productCard ${showInCartBorder()}`}>
      <CardBody style={{padding: 5}}>
        <CardHeader style={{padding: 0}}>
          {showInCartBorder() === 'showInCart' && (
            <div style={{float: 'right'}}>
              <Badge bg={'success'} style={{ padding: 5, marginBottom: 5, fontSize: 12 }}>
                {getCartQty()}
              </Badge>
            </div>
          )}
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
            <br/>
            <Badge bg={''} style={{ backgroundColor: getBadgeColor(product?.strain_type), padding: 5, marginBottom: 5, fontSize: 12 }}>
              {`${product?.strain_type}`}
            </Badge>
            <div style={{float: 'right', fontSize: 35, position: 'relative', right: 10}}>
              ${product.price}
            </div>
          </Heading>

          {category?.type_of === "Strains" || product.category?.type_of === "Strains" ? (
            <div style={{top: 0, position: 'relative', textAlign: 'center' }}>
              {/* <Text style={{marginBottom: 5, fontWeight: 'bold', textAlign: 'left'}}>Select Qty</Text> */}
              <ButtonGroup>
                {[1, 3.5, 7, 14, 28].map((variant) => {
                  return (
                    <Button style={{ minWidth: 50, fontSize: 13, padding: '5px 5px', margin: "0px 2px", fontWeight: 'bold' }} colorScheme='green' onClick={() => dispatch(add({product: product, quantity: variant}))}>
                      {variant}g
                    </Button>
                  )
                })}
              </ButtonGroup>
            </div>
          ): (
            <>
              <ButtonGroup spacing='2' style={{width: '100%'}}>
                <Button style={{ width: 130 }} onClick={() => (quantity - 1) > 0 ? setQuantity(quantity - 1) : null}>-</Button>
                <input type="number" min={0} className="chakra-input-custom chakra-input-custom-2" value={quantity} onChange={(e) => parseFloat(e.target.value) > 0.0 ? setQuantity(parseFloat(e.target.value)) : null} />
                <Button style={{ width: 130 }} onClick={() => setQuantity(quantity + 1)}>+</Button>
              </ButtonGroup>

              <ButtonGroup spacing='2' style={{width: '100%', marginTop: 10}}>
                <Button colorScheme='green' onClick={() => dispatch(add({product: product, quantity: quantity}))} style={{width: '100%'}}>
                  <Text>Add to Cart - ${quantity * product.price}</Text>
                </Button>
              </ButtonGroup>
            </>
          )}
        </Stack>
      </CardBody>

      <CardFooter style={{display: 'block', margin: '0px auto 14px', paddingLeft: 18, textAlign: 'center'}}>
        <Text noOfLines={4}>
          {product?.thc && (
            <><strong style={{fontSize: 10}}>THC:{' '}</strong>{product.thc?.length > 1 ? product.thc : ''}{' | '}</>
          )}
          {product?.cbd && (
            <><strong style={{fontSize: 10}}>CBD:{' '}</strong>{product.cbd || ''}{' | '}</>
          )}
          {product?.brand && (
            <><strong style={{fontSize: 10}}>BRAND:{' '}</strong>{product.brand || ''}<br/></>
          )}
        
          <Link to={"/products/" + product.slug} style={{ textDecoration: 'none'}}>
            <span>{product.description || 'No Description Available'}</span>
          </Link>
        </Text>
      </CardFooter>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(Product);