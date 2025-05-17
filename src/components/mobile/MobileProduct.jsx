import React from "react";
import { Carousel } from "react-bootstrap";
import { 
  Card,
  Stack,
  Text,
  Image,
  Button,
  ButtonGroup,
  CardBody,
  Heading,
  Badge,
} from "@chakra-ui/react";
import { connect, useDispatch } from 'react-redux';
import { add } from '../../manageCart';

import styled from "styled-components";
import { Link } from "react-router-dom";

const CarouselItem = styled(Carousel.Item)`
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
  }
`;

const CustomCardBody = styled(CardBody)`
  padding: 5px 10px !important;
`;

const StyledTitle = styled(Heading)`
  max-width: 215px;
`;

const Description = styled.div`
  margin-top: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Number of lines to show */
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Pictures = ({ product }) => {
  return (
    <Carousel variant="dark" indicators={false} controls={product?.images?.length > 1}>
      <CarouselItem>
        <Link to={"/products/" + product.slug}>
          <Image
            src={product.coverPhoto || product.cover_photo || product.thumbnail || "https://via.placeholder.com/500?text=No+Product+Image+Available"}
            borderRadius='lg'
          />
        </Link>
      </CarouselItem>
      {product?.images?.map((img) => {
        return (
          <CarouselItem key={img}>
            <Image
              src={img}
              loading={"eager"}
              borderRadius='lg'
            />
          </CarouselItem> 
        )
      })}
    </Carousel>
  )
};

const CustomBadge = styled(Badge)`
  color: white !important;
  padding: 5;
  nargin-bottom: 5;
  font-size: 12;
  user-select: none;
`;

const InCartBadge = styled(Badge)`
  color: white !important;
  padding: 5;
  margin-bottom: 5;
  font-size: 10;
  user-select: none;
  background-color: green !important;
`;

const MobileProduct = ({ product, filterObject, cart }) => {
  const [quantity, setQuantity] = React.useState(1);
  const dispatch = useDispatch();
  const [inCart, setInCart] = React.useState(false);

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

  const getCartQty = () => {
    if(cart && product){
      let item = cart.filter((i) => Number(i.product.id) === Number(product.id))[0];
      
      if(item){
        return `${item.quantity}${item.variant_by_weight ? 'g' : ''} in Cart`
      }
    }
  }

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  React.useEffect(() => {
    if (cart && cart.length > 0) {
      const found = cart.find((item) => Number(item.product.id) === Number(product.id));
      setInCart(found);
    } else {
      setInCart(false);
    }
  }, [cart]);

  return (
    <Card 
      flexDirection="row" 
      overflow="hidden" 
      maxW="lg" 
      key={product.id} 
      style={{ 
        width: '100%', 
        marginBottom: 0, 
        borderRadius: 0, 
        padding: 5
      }} 
      id={`${product.slug}`}
    >
      <div style={{display: 'block'}}>

        <Pictures product={product} />

        <div style={{textAlign: 'center' }}>
          <CustomBadge style={{ backgroundColor: getBadgeColor(product?.strain_type || product?.strainType) }}>
            {`${product?.strain_type || product?.strainType}`}
          </CustomBadge>
        </div>
      </div>

      <Stack style={{ width: (product.category?.type_of === "Strains" || product.category?.typeOf === "Strains") ? '100%' : '65%' }}>
        <CustomCardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            
            <div style={{ display: 'block', width: '100%' }}>
              <Link to={"/products/" + product.slug}>
                <StyledTitle size="sm">{product.name}<br/>{inCart ? <InCartBadge>{getCartQty()}</InCartBadge> : ''}</StyledTitle>
              </Link>
              <Text fontSize="sm" color="gray.500">
                {product.category?.name}
              </Text>
            </div>

            <div style={{float: 'right', fontSize: 35, position: 'relative', right: 10, userSelect: 'none'}}>
              {(product.on_sale || product.onSale) && !!(product.sale_price || product.salePrice) ? (
                <>
                  <s style={{color: 'red'}}>{`$${product.price}`}</s>
                  &nbsp;
                  <span style={{color: 'green'}}>{`$${product.sale_price || product.salePrice}`}</span>
                </>
              ) : (
                `$${product.price}`
              )}
            </div>
          </div>

          {filterObject?.type_of === "Strains" || product.category?.type_of === "Strains" || product.category?.typeOf === "Strains" ? (
            <div style={{top: 0, position: 'relative', textAlign: 'center' }}>
              <ButtonGroup>
                {[1, 3.5, 7, 14, 28].map((variant) => {
                  return (
                    <Button 
                      style={{ minWidth: 50, fontSize: 13, padding: '5px 5px', margin: "0px 1px", fontWeight: 'bold' }} 
                      colorScheme='green' 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // just in case
                        e.stopPropagation(); // prevent bubbling
                        console.log("dispatching...");
                        dispatch(add({ product: product, quantity: variant }))
                      }}
                    >
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
                <Button 
                  colorScheme='green' 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // just in case
                    e.stopPropagation(); // prevent bubbling
                    console.log("dispatching...");
                    dispatch(add({product: product, quantity: quantity}))
                  }} 
                  style={{width: '100%'}}
                >
                  <Text>Add to Cart - ${quantity * (product.onSale || product.on_sale ? (product.salePrice || product.sale_price) : product.price)}</Text>
                </Button>
              </ButtonGroup>
            </>
          )}
          <Link to={"/products/" + product.slug}>
            <Description>
              {product.description}
            </Description>
          </Link>
        </CustomCardBody>
      </Stack>
    </Card>
  )
};

const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(MobileProduct);