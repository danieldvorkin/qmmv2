
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

const Shop = (props) => {
  const [queryParams, _] = useSearchParams();
  const [filterSlug, setFilterSlug] = useState(null);
  const [filterObject, setFilterObject] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true)
  const [thcSliderValue, setThcSliderValue] = useState(50)
  const [cbdSliderValue, setCbdSliderValue] = useState(50)
  const [typeFilter, setTypeFilter] = useState('');
  const containerRef = useRef(null);
  const [scrolledTo, setScrolledTo] = useState(false);
  const [showRecentlyBoughtBadge, setShowRecentlyBoughtBadge] = useState(true);
  const [stopShowingRecentlyBought, setStopShowingRecentlyBought] = useState(false);
  const [mostRecentOrders, setMostRecentOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [previousQuery, setPreviousQuery] = useState('');
  const [recentlyBought, setRecentlyBought] = useState({});
  const [orderCount, setOrderCount] = useState(0);

  const fetchOrders = async () => {
    if(!stopShowingRecentlyBought){
      try {
        setShowRecentlyBoughtBadge(false);
        if(mostRecentOrders.length === 0){
          const resp = await getOrders(1, 'Order Delivered');
          if (resp.orders.length > 0) {
            setMostRecentOrders(resp.orders);
            setRecentlyBought(resp.orders[orderCount].line_items[0]);
          }
        } else {
          if(!!mostRecentOrders[orderCount]){
            setRecentlyBought(mostRecentOrders[orderCount].line_items[0]);
          } else {
            setOrderCount(0);
            setRecentlyBought(mostRecentOrders[0].line_items[0]);
          }
        }
  
        setOrderCount((prevOrderCount) => prevOrderCount + 1);
        setShowRecentlyBoughtBadge(true);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };
  
  useEffect(() => {
    const intervalId = setInterval(fetchOrders, 30000);
  
    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [orderCount]);

  useEffect(() => {
    setTimeout(() => {
      fetchOrders();
    }, 5000)
  }, []);

  useEffect(() => {
    if(!!recentlyBought.item){
      getItem(recentlyBought.item.slug).then((resp) => {
        if(!!resp.id){
          setRecentlyBought({ ...recentlyBought, item: resp });
        }
      })
    }
  }, [orderCount])

  useEffect(() => {
    let slug = queryParams.get('filter');
    setFilterSlug(slug);

    getCategories().then((resp) => setCategories(resp));
    featuredItems().then((resp) => setProducts(resp));
    
    if(Object.keys(categories).length > 0){
      let filterHash = Object.keys(categories).map((cat) => {
        const list = categories[cat];
        
        return list.filter((item) => filterSlug === item.slug);
      }).flat();
      
      setFilterObject(filterHash[0]);
    }

    setTimeout(() => {
      setLoader(false);  
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

  useEffect(() => {
    if(filterSlug?.length > 0){
      setLoader(true);  
      getCategory(filterSlug).then((resp) => setProducts(resp.items));

      let filterHash = Object.keys(categories).map((cat) => {
        const list = categories[cat];
        
        return list.filter((item) => filterSlug === item.slug);
      }).flat();
      
      setFilterObject(filterHash[0]);
    }
    setTimeout(() => {
      setLoader(false);
    }, 1000)
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSlug])

  useEffect(() => {
    setLoader(true);
    
    if(!!typeFilter && typeFilter?.length > 0){
      setProducts(products.filter((p) => p.strain_type === typeFilter));
      setLoader(false);
    } else {
      featuredItems().then((resp) => {
        setProducts(resp);
        setLoader(false);
      });
    }
  }, [typeFilter]);

  useEffect(() => {
    if(!!typeFilter)
      setTypeFilter('');
  }, [filterObject]);

  const resetFilter = () => {
    setLoader(true);
    setFilterSlug("");
    setFilterObject({});
    navigate("/shop");
    featuredItems().then((resp) => setProducts(resp));
    setTimeout(() => {
      setLoader(false);  
    }, 1000);
  }

  
  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }

  useEffect(() => {
    const hash = window.location.hash;

    if (hash && containerRef.current && products.length > 0 && !scrolledTo) {
      const itemSlug = hash.substring(1);
      const element = containerRef.current.querySelector(`#${itemSlug}`);

      if (element) {
        // Calculate the scroll position based on the element's offset
        const offset = element.offsetTop;
        containerRef.current.scrollTop = offset - 80;
        setScrolledTo(true);
      }
    }
  }, [products]);

  useEffect(() => {
    let debounceTimeout;
  
    const updateProducts = async (query) => {
      if (query) {
        let applicableItems = [];
  
        if (query?.length < previousQuery?.length) {
          const resp = await featuredItems();
          applicableItems = resp.filter((p) => nameCheck(p, query));
        } else {
          applicableItems = products.filter((p) => nameCheck(p, query));
        }
  
        setProducts(applicableItems);
        setLoader(false);
      } else {
        // If the search query is empty, fetch the default data (e.g., featured items)
        const resp = await featuredItems();
        setProducts(resp);
        setLoader(false);
      }
    };
  
    const handleSearch = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
  
      debounceTimeout = setTimeout(() => {
        updateProducts(searchQuery);
      }, 500); // Adjust the delay as needed
    };
  
    handleSearch();
  
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [searchQuery]);

  const nameCheck = (product, query) => {
    let lcName = product?.name?.toLowerCase();

    return lcName.includes(query.toLowerCase());
  }

  const onSearchChange = (e) => {
    const newSearchQuery = e.target.value;
    
    setPreviousQuery(searchQuery);
    setLoader(true);

    setSearchQuery(newSearchQuery);
  }

  const goToProduct = () => {
    navigate("/products/" + recentlyBought.item?.slug)
  }

  const determineScale = () => {
    if(!!recentlyBought && !!recentlyBought.item){
      if(recentlyBought.item?.category?.type_of === "Strains")
        return "g";
    }
  }
  
  return(
    <div style={{ marginTop: 20 }}>
      {!stopShowingRecentlyBought && showRecentlyBoughtBadge && !!recentlyBought.item && (
        <div className="recentlyBought">
          <Card>
            <CardBody>
              <Flex>
                <Avatar name={recentlyBought && recentlyBought.item?.name} src={recentlyBought.item?.cover_photo}/>
                <Box ml="3" onClick={() => goToProduct()} style={{cursor: 'pointer', width: '100%'}}>
                  <Text fontWeight='bold'>
                    Someone Recently Bought
                  </Text>
                  {recentlyBought && (
                    <Text fontSize='sm'>{recentlyBought?.quantity}{determineScale()} of {recentlyBought.item?.name}</Text>  
                  )}
                </Box>
                <CloseIcon style={{cursor: 'pointer', right: 0, position: 'relative' }} ml="3" onClick={() => setStopShowingRecentlyBought(true)}/>
              </Flex>
            </CardBody>
          </Card>
        </div>
      )}
      
      <div className="container">
        <Row>
          <Col lg="12" style={{marginBottom: 20}}>
            {Object.keys(categories).map((key) => 
              <DropdownButton
                as={ButtonGroup}
                id={"filter"}
                size="sm"
                key={`dropdown-${key}`}
                variant="outline-secondary"
                title={key}
                style={{marginRight: 5, border: 'none !important'}}
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
              style={{marginRight: 5, border: 'none !important' }}
              >
                {["Indica", "Indica Hybrid", "Hybrid", "Sativa Hybrid", "Sativa"].map((option) => {
                  return (
                    <Dropdown.Item eventKey={option} value={typeFilter} onClick={(e) => setTypeFilter(e.target.text)} style={{ border: 'none' }}>{option}</Dropdown.Item>
                  )
                })}
              </DropdownButton>
              <Input id="shopSearchInput" name="searchItem" placeholder="Search..." onChange={onSearchChange}/>
          </Col>
          <Col lg="12" style={{height: '82vh', overflowY: 'auto', width: '98%' }} ref={containerRef}>
            <div fluid style={{marginTop: 20}}>
              {loader ? (
                <div style={{ width: '100%' }}>
                  <img style={{ margin: '0 auto' }} src={loading} alt={"loading"}/>
                </div>
              ) : (
                <>
                  {!!typeFilter && (
                    <Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10}}>
                      <Badge bg="secondary" style={{paddingRight: 5}}>
                        {typeFilter}
                        <Button style={{ backgroundColor: 'transparent' }} icon="cross" onClick={() => setTypeFilter('')}>X</Button>
                      </Badge>
                    </Text>
                  )}
                  
                  <Products selectedFilter={filterObject} products={products} resetFilter={resetFilter}/>
                </>
                
              )}
              
            </div>
          </Col>
          <Col style={{maxWidth: 10}} className={'backToTop'}>
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