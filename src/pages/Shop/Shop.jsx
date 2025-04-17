
import { 
  Button, 
  Input, 
  // useDisclosure, 
  // Modal, 
  // ModalOverlay, 
  // ModalContent, 
  // ModalHeader, 
  // ModalCloseButton, 
  // ModalBody, 
  // Tr, 
  // TableContainer, 
  // Table, 
  // TableCaption, 
  // Thead, 
  // Th, 
  // Tbody, 
  // Td 
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { ButtonGroup, Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { 
  connect, 
  // useDispatch 
} from "react-redux";
import { useSearchParams } from "react-router-dom";
import Products from "../../components/Products";
import { getCategory } from "../../utils/util";
import loading from '../../loading.svg';
import { ChevronUpIcon } from "@chakra-ui/icons";
import { AppToaster } from "../../toast";
// import { markBreakdownViewed } from "../manageCart";
import MobileShop from "../../components/MobileShop";
import { client } from "../../App";
import { GET_FEATURED_ITEMS } from "../graphql/featuredItems";
// import { GET_CATEGORIES } from "../graphql/categories";
import RecentlyBought from "../../components/RecentlyBought";
import { useLoaderData } from "react-router-dom";

const Shop = (props) => {
  const loaderData = useLoaderData();
  const [queryParams, _] = useSearchParams();
  const [filterSlug, setFilterSlug] = useState(null);
  const [filterObject, setFilterObject] = useState({});
  const [categories, setCategories] = useState(loaderData.categories || []);
  const [products, setProducts] = useState(loaderData.featuredItems || []);
  const [baseProducts, setBaseProducts] = useState(loaderData.featuredItems || []);
  const [loader, setLoader] = useState(true);
  const containerRef = useRef(null);
  const [scrolledTo, setScrolledTo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previousQuery, setPreviousQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [emptyCategoryError, setEmptyCategoryError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const [shouldShowModal, setShouldShowModal] = useState(false);
  // const dispatch = useDispatch();

  const discountBreakdown = [
    "$50+ | $10 Shipping",
    "$100+ | Free Shipping",
    "$150+ | 5% off",
    "$200+ | 10% off",
    "$300+ | 15% off",
    "$400+ | 20% off",
    "$600+ | 25% off",
    "$800+ | 30% off"
  ]


  useEffect(() => {
    console.log("[useEffect] products and categories updated");
    try {
      if(products?.length > 0 && categories?.length > 0){
        setLoader(false);
        setDataFetched(true);
      }
    } catch (error) {
      AppToaster.show({ message: "Error fetching data: " + error });
    } finally {
      setLoader(false);
      setDataFetched(true);
    }
  }, [products, categories, baseProducts]);

  useEffect(() => {
    console.log("[useEffect] screen width updated");
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial screen width
    setScreenWidth(window.innerWidth);
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  useEffect(() => {
    console.log("[useEffect] scrolled to element based on hash");
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
    console.log("[useEffect] filterSlug, typeFilter, searchQuery updated");
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
          filteredProducts = filteredProducts.filter((p) => p.strain_type?.includes(typeFilter) || p.strainType?.includes(typeFilter));
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

  // useEffect(() => {
  //   if (props?.cart?.viewedBreakdown?.viewedAt) {
  //     const viewedTimestamp = new Date(props.cart.viewedBreakdown.viewedAt);
  //     const currentTime = new Date();

  //     // Calculate the time difference in milliseconds
  //     const timeDifference = currentTime - viewedTimestamp;

  //     // Convert milliseconds to hours
  //     const hoursDifference = timeDifference / (1000 * 60 * 60);

  //     // Show the modal if the difference is greater than 24 hours
  //     setShouldShowModal(hoursDifference >= 24);
  //   }
  // }, [props?.cart?.viewedBreakdown]);

  const fetchFeaturedItems = async () => {
    const resp = await client.query({
      query: GET_FEATURED_ITEMS,
    });
    setProducts(resp.data.featuredItems);
    setBaseProducts(resp.data.featuredItems);
  };

  // const fetchCategories = async () => {
  //   const resp = await client.query({
  //     query: GET_CATEGORIES,
  //     variables: { includeItems: true }
  //   });
  //   setCategories(resp.data.categories);
  // }

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

  // const closeAnnouncement = () => {
  //   dispatch(markBreakdownViewed());
  //   onClose();
  // }

  return (
    <div style={{ marginTop: screenWidth < 475 ? 0 : 20 }}>
      <RecentlyBought />
      
      {/* <Modal onClose={onClose} isOpen={shouldShowModal && isOpen} isCentered size={window.innerWidth < 700 ? "xs" : "lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Discount Breakdown</ModalHeader>
          <ModalCloseButton onClick={closeAnnouncement}/>
          <ModalBody>
            <TableContainer>
              <Table variant='simple' size='sm'>
                <TableCaption>Automatically applied at checkout</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Requirement</Th>
                    <Th isNumeric>Discount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {discountBreakdown.map((db) => {
                    return (
                      <Tr>
                        <Td>{db.split(" | ")[0]}</Td>
                        <Td isNumeric>{db.split(" | ")[1]}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>            
          </ModalBody>
        </ModalContent>
      </Modal> */}

      {screenWidth < 475 ? (
        <MobileShop 
          loading={!dataFetched} 
          products={products} 
          categories={categories} 
          setFilterSlug={setFilterSlug}
          filterObject={filterObject}
          resetFilter={resetFilter}
          onSearchChange={onSearchChange}
        />
      ) : (
        <div className="container">
          <Row>
            <Col lg="12" style={{ marginBottom: 20 }}>
              {Object.keys(categories).map((key) => {
                <p>{categories[key]}</p>
              })}
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
                  {categories[key]?.map((category) => {
                    return (
                      <Dropdown.Item
                        eventKey={category.slug}
                        onClick={() => { setFilterSlug(category?.slug) }}
                        style={{ border: 'none' }}
                        key={category.slug}
                      >
                        {category.name}
                      </Dropdown.Item>
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
      )}
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(Shop);