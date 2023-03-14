import { Accordion, AccordionIcon, AccordionButton, AccordionItem, AccordionPanel, Box, Divider } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Shop = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("https://queenmarymedical.com/api/v1/categories").then((resp) => {
      setCategories(resp.data);
    });
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
            <Divider/>

          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Shop;