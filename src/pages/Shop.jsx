import { Button } from "@blueprintjs/core";
import { Accordion, AccordionIcon, AccordionButton, AccordionItem, AccordionPanel, Divider } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Products from "../components/Products";

const Shop = () => {
  const [queryParams, _] = useSearchParams();
  const filter = queryParams.get('filter');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get("https://queenmarymedical.com/api/v1/categories").then((resp) => {
      setCategories(resp.data);
    });

    axios.get("https://queenmarymedical.com/api/v1/items").then((resp) => {
      setProducts(resp.data);
    })
  }, [])

  
  return(
    <div style={{ marginTop: 30 }}>
      <Container>
        <Row>
          <Col lg="3">
            <h1 className="header">Filters</h1>
            <Divider/>
            {Object.keys(categories).length > 0 && (
              <Accordion allowToggle>
                {Object.keys(categories).map((key) => {
                  return (
                    <AccordionItem key={categories[key].id}>
                      <h2><AccordionButton>{key}<AccordionIcon /></AccordionButton></h2>
                      <AccordionPanel>
                        <ul style={{listStyle: 'none'}}>
                          {categories[key].map((category) => {
                            return (
                              <li key={category.id}>
                                <Link to={"/shop?filter=" + category.slug}>{category.name}</Link>
                                {filter === category.slug && (
                                  <Button className="bp4-minimal" icon="cross" onClick={() => navigate("/shop")} />
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
              <Products selectedFilter={filter} products={products} />
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Shop;