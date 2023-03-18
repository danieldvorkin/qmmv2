import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getItem, featuredItems } from "../utils/util";
import { Badge, Carousel, Col, Container, Image, Row } from "react-bootstrap";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, ButtonGroup, Card, CardBody, CardHeader, Divider, Stack, Text } from "@chakra-ui/react";
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

  useEffect(() => {
    window.scrollTo(0, 0)
    async function fetchData() {
      const response = await getItem(slug);
      setProduct(response);

      const featuredItemResponse = await featuredItems();
      setProductFeaturedItems(featuredItemResponse);
      setLoader(false);
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
                    <Text className="title" style={{marginBottom: 2}}>{product.name}</Text>
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
                <Row>
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
                <br/>
                <Row>
                  <Col>
                    <ButtonGroup spacing='2' style={{width: '100%'}}>
                      <Button colorScheme='green' onClick={() => dispatch(add({product: product}))} style={{width: '100%'}}>
                        Add to cart
                      </Button>
                    </ButtonGroup>
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