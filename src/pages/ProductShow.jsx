import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getItem, featuredItems } from "../utils/util";
import { Badge, Carousel, Col, Container, Image, Row } from "react-bootstrap";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, ButtonGroup, Card, CardBody, CardHeader, Divider, Select, Stack, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { add } from "../manageCart";
import Slider from "react-slick";
import Product from "../components/Product";
import loading from '../loading.svg';
import { LinkContainer } from "react-router-bootstrap";

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

const ProductShow = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const dispatch = useDispatch();
  const [productFeaturedItems, setProductFeaturedItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const [selectedQty, setSelectedQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoader(true)
    async function fetchData() {
      const response = await getItem(slug);
      setProduct(response);
      setLoader(false);
      
      const featuredItemResponse = await featuredItems();
      setProductFeaturedItems(featuredItemResponse);
      
    }
    fetchData();
  }, [slug]);

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
                    <LinkContainer to="/shop">
                      <BreadcrumbLink href='#'>Shop</BreadcrumbLink>
                    </LinkContainer>
                  </BreadcrumbItem>

                  <BreadcrumbItem>
                    <LinkContainer to={"/category/" + product?.category?.slug}>
                      <BreadcrumbLink href='#'>{product?.category?.name}</BreadcrumbLink>
                    </LinkContainer>
                  </BreadcrumbItem>

                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#'>{product?.name}</BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
              </Col>

              <Col lg={5}>
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
              </Col>

              <Col lg={7}>
                <Row>
                  <Col>
                    <Text className="title" style={{marginBottom: 2, width: '90%'}}>{product.name}</Text>
                    <Text className="header" style={{marginBottom: 10}}>{product.category?.name}</Text>
                  </Col>
                </Row>
                <Row>
                  <Col lg={2}>
                    <Text>
                      <strong>THC:{' '}</strong>
                      {product.thc}%
                    </Text>
                  </Col>
                  <Col lg={2}>
                    <Text>
                      <strong>CBD:{' '}</strong>
                      {product.cbd}%
                    </Text>
                  </Col>
                  <Col lg={5}>
                    <Text>
                      <strong>BRAND:{' '}</strong>
                      {` ${product.brand}`}
                    </Text>
                  </Col>
                </Row>
                
                <br/>
                
                <Row>
                  <Col>
                    {product.description}
                  </Col>
                </Row>
                <br/>
                <Divider/>
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
                    <Text>Select amount: </Text>
                    <br/>
                    {product?.category?.type_of === "Strains" ? (
                      <ButtonGroup>
                        {[1, 3.5, 7, 14, 28].map((variant) => {
                          return (
                            <Button style={{ fontSize: 13, padding: '2px 0px', margin: "0px 4px", fontWeight: 'bold' }} colorScheme='green' onClick={() => dispatch(add({product: product, quantity: variant}))}>
                              {variant}
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

export default ProductShow;