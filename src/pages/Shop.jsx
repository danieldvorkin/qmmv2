
import { Accordion, AccordionIcon, AccordionButton, AccordionItem, AccordionPanel, Divider, Button, Text, Input, Flex, Box, Card, CardBody, Avatar } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Badge, ButtonGroup, Col, Container, Dropdown, DropdownButton, ProgressBar, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Products from "../components/Products";
import { featuredItems, getCategories, getCategory, getItem, getOrder, getOrders } from "../utils/util";
import loading from '../loading.svg';
import CustomSlider from "../components/slider";
import { ChevronUpIcon, CloseIcon } from "@chakra-ui/icons";
import { AppToaster } from "../toast";

const Shop = (props) => {
  const [queryParams, _] = useSearchParams();
  const [filterSlug, setFilterSlug] = useState(null);
  const [filterObject, setFilterObject] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [baseProducts, setBaseProducts] = useState([]);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const containerRef = useRef(null);
  const [scrolledTo, setScrolledTo] = useState(false);
  const [showRecentlyBoughtBadge, setShowRecentlyBoughtBadge] = useState(true);
  const [stopShowingRecentlyBought, setStopShowingRecentlyBought] = useState(false);
  const [mostRecentOrders, setMostRecentOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [previousQuery, setPreviousQuery] = useState('');
  const [recentlyBought, setRecentlyBought] = useState({});
  const [orderCount, setOrderCount] = useState(0);
  const [thcSliderValue, setThcSliderValue] = useState(50);
  const [cbdSliderValue, setCbdSliderValue] = useState(50);
  const [typeFilter, setTypeFilter] = useState('');
  const [emptyCategoryError, setEmptyCategoryError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchOrders();
      if (!!recentlyBought.item) {
        getItem(recentlyBought.item.slug).then((resp) => {
          if (!!resp.id) {
            setRecentlyBought({ ...recentlyBought, item: resp });
          }
        });
      }
    }, 30000);
  
    return () => {
      clearInterval(intervalId);
    };
  }, [orderCount, recentlyBought.item]);

  useEffect(() => {
    setLoader(true);
    
    setTimeout(() => {
      fetchOrders();
    }, 5000);

    const fetchData = async () => {
      try {
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse);

        const featuredItemsResponse = await featuredItems();
        setProducts(featuredItemsResponse);
        setBaseProducts(featuredItemsResponse);
        setLoader(false);
        setDataFetched(true);
      } catch (error) {
        AppToaster.show({ message: "Error fetching data: " + error });
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash && containerRef.current && products.length > 0 && !scrolledTo) {
      const itemSlug = hash.substring(1);
      const element = containerRef.current.querySelector(`#${itemSlug}`);

      if (element) {
        const offset = element.offsetTop;
        containerRef.current.scrollTop = offset - 80;
        setScrolledTo(true);
      }
    }
  }, [products, scrolledTo]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);

        let filteredProducts = baseProducts;

        if (filterSlug?.length > 0) {
          const categoryResponse = await getCategory(filterSlug);
          filteredProducts = categoryResponse.items;
          
          if(filteredProducts?.length > 0){
            setEmptyCategoryError(null)
            setFilterObject(categoryResponse); // Assuming there's only one category item
          } else {
            AppToaster.show({ message: 'There are no products available in that category.' });
            setEmptyCategoryError("No products available for the selected category. Please select a different category.")
            resetFilter();
          }
        }

        if (!!typeFilter && typeFilter.length > 0) {
          filteredProducts = filteredProducts.filter((p) => p.strain_type.includes(typeFilter));
        }

        if (searchQuery.length > 0) {
          filteredProducts = filteredProducts.filter((p) => nameCheck(p, searchQuery));
        }

        if(baseProducts?.length > 0 && filteredProducts?.length <= 0){
          setEmptyCategoryError("No products available....")
        }

        setProducts(filteredProducts);
      } catch (error) {
        AppToaster.show({ message: "Error fetching data: " + error });
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, [filterSlug, typeFilter, searchQuery]);

  const fetchFeaturedItems = async () => {
    const resp = await featuredItems();
    setProducts(resp);
    setBaseProducts(resp);
  };

  const fetchOrders = async () => {
    if (!stopShowingRecentlyBought) {
      try {
        setShowRecentlyBoughtBadge(false);
        let recentlyBoughtItem = null;

        if (mostRecentOrders.length === 0) {
          const resp = await getOrders(1, 'Order Delivered');

          if (resp.orders.length > 0) {
            setMostRecentOrders(resp.orders);
            recentlyBoughtItem = resp.orders[orderCount].line_items[0];
          }
        } else {
          if (!!mostRecentOrders[orderCount]) {
            recentlyBoughtItem = mostRecentOrders[orderCount].line_items[0];
          } else {
            setOrderCount(0);
            recentlyBoughtItem = mostRecentOrders[orderCount].line_items[0];
          }
        }

        if (recentlyBoughtItem?.item?.inventory > 0) {
          setRecentlyBought(recentlyBoughtItem);
          setOrderCount((prevOrderCount) => prevOrderCount + 1);
        }

        setShowRecentlyBoughtBadge(true);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };

  const resetFilter = () => {
    setLoader(true);
    setFilterSlug("");
    setFilterObject({});
    resetTypeFilter();
    fetchFeaturedItems();
  };

  const resetTypeFilter = () => {
    setLoader(true);
    setTypeFilter('');
    if(filterSlug?.length <= 0)
      fetchFeaturedItems();
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const nameCheck = (product, query) => {
    let lcName = product?.name?.toLowerCase();
    return lcName.includes(query.toLowerCase());
  };

  const onSearchChange = (e) => {
    const newSearchQuery = e.target.value;

    setPreviousQuery(searchQuery);
    setLoader(true);

    setSearchQuery(newSearchQuery);
  };

  const determineScale = () => {
    if (!!recentlyBought && !!recentlyBought.item) {
      if (recentlyBought.item?.category?.type_of === "Strains") {
        return "g";
      }
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      {false && !stopShowingRecentlyBought && showRecentlyBoughtBadge && !!recentlyBought.item && (
        <div className="recentlyBought">
          <Card>
            <CardBody>
              <Flex>
                <Avatar name={recentlyBought && recentlyBought.item?.name} src={recentlyBought.item?.cover_photo} />
                <Box ml="3" onClick={() => navigate("/products/" + recentlyBought.item?.slug)} style={{ cursor: 'pointer', width: '100%' }}>
                  <Text fontWeight='bold'>
                    Someone Recently Bought
                  </Text>
                  {recentlyBought && (
                    <Text fontSize='sm'>{recentlyBought?.quantity}{determineScale()} of {recentlyBought.item?.name}</Text>
                  )}
                </Box>
                <CloseIcon style={{ cursor: 'pointer', right: 0, position: 'relative' }} ml="3" onClick={() => setStopShowingRecentlyBought(true)} />
              </Flex>
            </CardBody>
          </Card>
        </div>
      )}

      <div className="container">
        <Row>
          <Col lg="12" style={{ marginBottom: 20 }}>
            {Object.keys(categories).map((key) =>
              <DropdownButton
                as={ButtonGroup}
                id={"filter"}
                size="sm"
                key={`dropdown-${key}`}
                variant="outline-secondary"
                title={key}
                style={{ marginRight: 5, border: 'none !important' }}
              >
                {categories[key].sort((a, b) => a.sort - b.sort).map((category) => {
                  return (
                    <Dropdown.Item
                      eventKey={category.slug}
                      onClick={() => { setFilterSlug(category?.slug) }}
                      style={{ border: 'none' }}>{category.name}</Dropdown.Item>
                  )
                })}

              </DropdownButton>
            )}
            <DropdownButton
              as={ButtonGroup}
              id={"type"}
              size="sm"
              key={`dropdown-type`}
              variant="outline-secondary"
              title={"Strain Types"}
              style={{ marginRight: 5, border: 'none !important' }}
            >
              {["Indica", "Hybrid", "Sativa"].map((option) => {
                return (
                  <Dropdown.Item eventKey={option} value={typeFilter} onClick={(e) => setTypeFilter(e.target.text)} style={{ border: 'none' }}>{option}</Dropdown.Item>
                )
              })}
            </DropdownButton>
            <Input id="shopSearchInput" name="searchItem" placeholder="Search..." onChange={onSearchChange} />
          </Col>
          <Col lg="12" style={{ height: '82vh', overflowY: 'auto', width: '98%' }} ref={containerRef}>
            <div fluid style={{ marginTop: 20 }}>
              {loader ? (
                <div style={{ width: '100%' }}>
                  <img style={{ margin: '0 auto' }} src={loading} alt={"loading"} />
                </div>
              ) : (
                <>
                  <Products
                    loader={loader}
                    dataFetched={dataFetched}
                    selectedFilter={filterObject}
                    products={products}
                    resetFilter={resetFilter}
                    resetTypeFilter={resetTypeFilter}
                    typeFilter={typeFilter}
                    emptyCategoryError={emptyCategoryError}
                  />
                </>

              )}

            </div>
          </Col>
          <Col style={{ maxWidth: 10 }} className={'backToTop'}>
            <Button colorScheme='gray' className="bp4-minimal" onClick={() => scrollToTop()}>
              <ChevronUpIcon /> To Top
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(Shop);