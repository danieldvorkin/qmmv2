import { Button } from "@blueprintjs/core";
import { Accordion, AccordionIcon, AccordionButton, AccordionItem, AccordionPanel, Divider, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ButtonGroup, Col, Container, Dropdown, DropdownButton, ProgressBar, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Products from "../components/Products";
import { featuredItems, getCategories, getCategory } from "../utils/util";
import loading from '../loading.svg';
import CustomSlider from "../components/slider";

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
  
  return(
    <div style={{ marginTop: 30 }}>
      <Container>
        <Row>
          <Col lg="12">
            <h1 className="header">Menu</h1>
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
          </Col>
          <Col lg="12">
            <Container fluid style={{marginTop: 20}}>
              {loader ? (
                <div style={{ width: '100%' }}>
                  <img style={{ margin: '0 auto' }} src={loading} alt={"loading"}/>
                </div>
              ) : (
                <Products selectedFilter={filterObject} products={products} resetFilter={resetFilter}/>
              )}
              
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(Shop);