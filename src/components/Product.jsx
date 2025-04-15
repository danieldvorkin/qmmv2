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
      let itemInCart = cart.filter((item) => {
        return item.product.id === product.id
      }).length > 0;
      
      return itemInCart && product.on_sale ? 'showInCart' : (itemInCart ? 'showInCart' : '');
    }
  }

  const showNewProductBorder = () => {
    return !!product?.featured_item ? 'newProduct' : '';
  }

  const getCartQty = () => {
    if(cart && product){
      let item = cart.filter((i) => i.product.id === product.id)[0];
      
      if(item){
        return `${item.quantity}${item.variant_by_weight ? 'g' : ''} in Cart | ${getItemDiscount(item, cart)}`
      }
    }
  }

  const [showMore, setShowMore] = useState(false);
  
  return (
    <Card maxW='sm' className={`productCard ${showInCartBorder()}`} id={`${product.slug}`}>
      <CardBody style={{padding: 5}}>
        <CardHeader style={{padding: 0}}>
          {product.on_sale && (
            <div style={{float: 'left'}}>
              <Badge bg={'danger'} style={{ padding: 5, marginBottom: 5, fontSize: 12 }}>
                SALE
              </Badge>
            </div>
          )}
          {product?.featured_item && (
            <div style={{float: 'left', marginLeft: 5}}>
              <Badge bg={'primary'} style={{ padding: 5, marginBottom: 5, fontSize: 12 }}>
                NEW
              </Badge>
            </div>
          )}
          {showInCartBorder().includes('showInCart') ? (
            <div style={{float: 'right'}}>
              <Badge bg={'success'} style={{ padding: 5, marginBottom: 5, fontSize: 12 }}>
                {getCartQty()}
              </Badge>
            </div>
          ) : (
            <div style={{height: 25}}></div>
          )}
        </CardHeader>

        <Carousel variant="dark" indicators={false} controls={product?.images?.length > 1}>
          <Carousel.Item style={{cursor: 'pointer'}}>
            {/* <LinkContainer to={"/products/" + product.slug}> */}
              <Image
                src={product.coverPhoto || product.cover_photo || "https://via.placeholder.com/500?text=No+Product+Image+Available"}
                borderRadius='lg'
                onClick={() => setShowMore(!showMore)} 
              />
            {/* </LinkContainer> */}
          </Carousel.Item>
          {product?.images?.map((img) => {
            return (
              <Carousel.Item key={img}>
                {/* <LinkContainer to={"/products/" + product.slug}> */}
                  <Image
                    src={img}
                    loading={"eager"}
                    borderRadius='lg'
                    onClick={() => setShowMore(!showMore)} 
                  />
                {/* </LinkContainer> */}
              </Carousel.Item> 
            )
          })}
        </Carousel>

        <Stack mt='2' ml="2" mr="2" spacing='1'>
          <Heading size='sm' style={{minHeight: 40, userSelect: 'none'}}>
            <Link to={"/products/" + product.slug}>
              {product.name}
            </Link>
            <br/>
            <Badge bg={''} style={{ backgroundColor: getBadgeColor(product?.strain_type || product?.strainType), padding: 5, marginBottom: 5, fontSize: 12, userSelect: 'none' }}>
              {`${product?.strain_type || product?.strainType}`}
            </Badge>
            <div style={{float: 'right', fontSize: 35, position: 'relative', right: 10, userSelect: 'none'}}>
              {product.on_sale && !!product.sale_price ? (
                <>
                  <s style={{color: 'red'}}>{`$${product.price}`}</s>
                  &nbsp;
                  {`$${product.sale_price}`}
                </>
              ) : (
                `$${product.price}`
              )}
            </div>
          </Heading>

          {category.type_of === "Strains" || product?.category?.typeOf === "Strains" || product.category?.type_of === "Strains" ? (
            <div style={{top: 0, position: 'relative', textAlign: 'center' }}>
              {/* <Text style={{marginBottom: 5, fontWeight: 'bold', textAlign: 'left'}}>Select Qty</Text> */}
              <ButtonGroup>
                {[1, 3.5, 7, 14, 28].map((variant) => {
                  return (
                    <Button style={{ minWidth: 50, fontSize: 13, padding: '5px 5px', margin: "0px 1px", fontWeight: 'bold' }} colorScheme='green' onClick={() => dispatch(add({product: product, quantity: variant}))}>
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
        <Text noOfLines={showMore ? 50 : 4} onClick={() => setShowMore(!showMore)} style={{userSelect: 'none'}}>
          {/* {product?.thc && (
            <><strong style={{fontSize: 10}}>THC:{' '}</strong>{product.thc?.length > 1 ? product.thc : ''}{' | '}</>
          )}
          {product?.cbd && (
            <><strong style={{fontSize: 10}}>CBD:{' '}</strong>{product.cbd || ''}{' | '}</>
          )}
          {product?.brand && (
            <><strong style={{fontSize: 10}}>BRAND:{' '}</strong>{product.brand || ''}<br/></>
          )} */}
        
          {/* <Link to={"/products/" + product.slug} style={{ textDecoration: 'none'}}> */}
            <span>{product.description || 'No Description Available'}</span>
            
          {/* </Link> */}
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