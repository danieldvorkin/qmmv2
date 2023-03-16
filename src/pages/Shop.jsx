import { Button } from "@blueprintjs/core";
import { Accordion, AccordionIcon, AccordionButton, AccordionItem, AccordionPanel, Divider, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Products from "../components/Products";
import { featuredItems, getCategories, getCategory } from "../utils/util";

const Shop = () => {
  const [queryParams, _] = useSearchParams();
  const [filterSlug, setFilterSlug] = useState(null);
  const [filterObject, setFilterObject] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    let slug = queryParams.get('filter');
    setFilterSlug(slug);

    getCategories().then((resp) => setCategories(resp));

    if(slug?.length > 0){
      getCategory(slug).then((resp) => setProducts(resp));
    } else {
      featuredItems().then((resp) => setProducts(resp))
    }
  }, [])

  useEffect(() => {
    if(Object.keys(categories).length > 0){
      let filterHash = Object.keys(categories).map((cat) => {
        const list = categories[cat];
        
        return list.filter((item) => filterSlug === item.slug);
      }).flat();
      
      setFilterObject(filterHash[0]);

      if(filterSlug?.length > 0){
        getCategory(filterSlug).then((resp) => setProducts(resp));
      } else {
        featuredItems().then((resp) => setProducts(resp));
      }
    }
  }, [categories, filterSlug])

  const resetFilter = () => {
    setFilterSlug("");
    setFilterObject({});
    navigate("/shop");
  }
  
  return(
    <div style={{ marginTop: 30 }}>
      <Container>
        <Row>
          <Col lg="3">
            <h1 className="header">Filter</h1>
            <Divider/>
            {Object.keys(categories).length > 0 && (
              <Accordion allowToggle>
                {Object.keys(categories).map((key) => {
                  return (
                    <AccordionItem key={"according-" + key}>
                      <Text><AccordionButton>{key}<AccordionIcon /></AccordionButton></Text>
                      <AccordionPanel>
                        <ul key={key} style={{listStyle: 'none'}}>
                          {categories[key].map((category) => {
                            return (
                              <li key={category.id}>
                                <Link key={category.id} to={"/shop?filter=" + category?.slug} onClick={() => { setFilterSlug(category?.slug) }}>{category?.name}</Link>
                                {filterSlug === category.slug && (
                                  <Button className="bp4-minimal" icon="cross" onClick={() => resetFilter() } />
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </AccordionPanel>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )}
          </Col>
          <Col lg="9">
            <h1 className="header">Products</h1>
            <Divider />
            <Container fluid style={{marginTop: 10}}>
              <Products selectedFilter={filterObject} products={products} resetFilter={resetFilter}/>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Shop;