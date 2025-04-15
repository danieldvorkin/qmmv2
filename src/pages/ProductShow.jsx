import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getItem, featuredItems } from "../utils/util";
import { Badge, Carousel, Col, Container, Image, Row } from "react-bootstrap";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, ButtonGroup, Card, CardBody, CardHeader, Divider, Select, Stack, Text } from "@chakra-ui/react";
import { connect, useDispatch } from "react-redux";
import { add } from "../manageCart";
import Slider from "react-slick";
import Product from "../components/Product";
import loading from '../loading.svg';
import { LinkContainer } from "react-router-bootstrap";
import { getItemDiscount } from "../utils/helpers";
import styled from "styled-components";
import { client } from "../App";
import { GET_FEATURED_ITEMS } from "./Shop";

const settings = {
  dots: false, infinite: true, 
  slidesToShow: 4, slidesToScroll: 1,

  responsive: [{
    breakpoint: 200,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 1
    }
  },{
    breakpoint: 1024,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1
    }
  }]
}

const CustomBadge = styled(Badge)`
  color: white !important;
  padding: 5;
  nargin-bottom: 5;
  font-size: 15px !important;
  user-select: none;
`;

const ProductShow = (props) => {
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const dispatch = useDispatch();
  const [productFeaturedItems, setProductFeaturedItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const [selectedQty, setSelectedQty] = useState(1);
  const { cart } = props; 
  const [showEditBtn, setShowEditBtn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoader(true)
    async function fetchData() {
      const response = await getItem(slug);
      setProduct(response);
      setLoader(false);
      
      // const featuredItemResponse = await featuredItems();
      const featuredItemResponse = await client.query({
        query: GET_FEATURED_ITEMS,
      })
      setProductFeaturedItems(featuredItemResponse.data.featuredItems);
      
    }
    fetchData();

    if(props.isLoggedIn && props.user?.admin){
      setShowEditBtn(true);
    }
  }, [slug]);

  useEffect(() => {
    if(!props.isLoggedIn){
      setShowEditBtn(false);
    }
  }, [props])

  const showInCartBorder = () => {
    if(cart && product){
      return cart.filter((item) => item.product.id === product.id).length > 0 ? 'showInCart' : '';
    }
  }

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

  return (
    <Container>
      <Card>
        <CardBody>
          {loader ? (
            <div style={{ width: '100%' }}>
              <img style={{ margin: '0 auto' }} src={loading} alt={"loading"}/>
            </div>
          ) : (
            <Row>
              
              <Col lg={12} style={{marginBottom: 10}}>
                <Breadcrumb>
                  <BreadcrumbItem>
                    <LinkContainer to={{ pathname: "/shop", hash: `#${product?.slug}`}}>
                      <BreadcrumbLink href=''>Back to Shop</BreadcrumbLink>
                    </LinkContainer>
                  </BreadcrumbItem>

                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#'>{product?.name}</BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
              </Col>

              <Col lg={5}>
                {showInCartBorder() === 'showInCart' ? (
                  <div style={{float: 'right'}}>
                    <Badge bg={'success'} style={{ padding: 5, marginBottom: 5, fontSize: 12 }}>
                      In Cart
                    </Badge>
                  </div>
                ) : (
                  <div style={{height: 25}}></div>
                )}

                <Carousel variant="dark" controls={false} indicators={false}>
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
              </Col>

              <Col lg={7}>
                <Row>
                  <Col>
                    <Text className="title" style={{marginBottom: 2, width: '90%'}}>
                      {product.name}
                    </Text>
                    <Text className="header" style={{marginBottom: 10}}>{product.category?.name}</Text>
                  </Col>
                  <Col lg={2}>
                    {showEditBtn && (
                      <Link to={`/admin/products/${product.slug}`} style={{float: 'right'}}>
                        <Button style={{marginTop: 10}}>Edit Product</Button>
                      </Link>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <CustomBadge style={{ backgroundColor: getBadgeColor(product?.strain_type || product?.strainType) }}>
                      {`${product?.strain_type || product?.strainType}`}
                    </CustomBadge>
                  </Col>
                </Row>
                
                <br/>
                
                {/* <Row>
                  <Col>
                    <Text className="header" style={{marginBottom: 5}}>Terpenes</Text>
                    {product?.terpenes?.length > 0 ? (    
                      <Stack direction='row'>
                        {product.terpenes.map((terpene) => {
                          return (
                            <Badge>
                              {` ${terpene.name}`}
                            </Badge>
                          )
                        })}
                      </Stack>
                    ) : (
                      <Stack direction='row'>
                        <Badge>Not Available</Badge>
                      </Stack>
                    )}
                  </Col>
                </Row>
                <br/> */}
                <Row>
                  <Col>
                    <Text style={{fontSize: 25}}>Select amount: </Text>
                    <br/>
                    {product?.category?.type_of === "Strains" ? (
                      <ButtonGroup>
                        {[1, 3.5, 7, 14, 28].map((variant) => {
                          return (
                            <Button style={{ fontSize: 18, padding: '2px 0px', margin: "0px 4px", fontWeight: 'bold', height: 50, width: 60 }} colorScheme='green' onClick={() => dispatch(add({product: product, quantity: variant}))}>
                              {variant}g
                            </Button>
                          )
                        })}
                      </ButtonGroup>
                    ) : (
                      <ButtonGroup spacing='2' style={{width: '100%'}}>
                        <Button style={{ width: 130 }} onClick={() => (selectedQty - 1) > 0 ? setSelectedQty(selectedQty - 1) : null}>-</Button>
                        <input type="number" min={0} className="chakra-input-custom chakra-input-custom-2" value={selectedQty} onChange={(e) => parseFloat(e.target.value) > 0.0 ? setSelectedQty(parseFloat(e.target.value)) : null} />
                        <Button style={{ width: 130 }} onClick={() => setSelectedQty(selectedQty + 1)}>+</Button>
                      </ButtonGroup>
                    )}
                    <br/>
                    {product?.category?.type_of !== 'Strains' && (
                      <Button colorScheme='green' onClick={() => dispatch(add({product: product, quantity: selectedQty}))} style={{ width: '100%', marginTop: 10 }}>
                        Add to cart
                      </Button>
                    )}
                    
                  </Col>
                </Row>

                <br/>
                <Divider/>
                <br/>

                <Row>
                  <Col>
                    {product.description}
                  </Col>
                </Row>
                <br/>
                <Divider/>
                <br/>
              </Col>
            </Row>
          )}
          
          <br/>
          <Divider/>
          <br/>
          {loader ? (
            <div style={{ width: '100%' }}>
              <img style={{ margin: '0 auto' }} src={loading} alt={"loading"}/>
            </div>
          ) : (
            <Row>
              <Col pr={3} pl={3}>
                <Card>
                  <CardHeader><Text fontSize='2xl' as='b'>Featured Items</Text></CardHeader>
                  <CardBody>
                    <Slider {...settings}>
                      {productFeaturedItems.map((item) => {
                        return <Product product={item} category={item.category} />
                      })}
                    </Slider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
      
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    isLoggedIn: state.isLoggedIn,
    user: state.user
  }
}

export default connect(mapStateToProps)(ProductShow);