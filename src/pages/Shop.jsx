import { Button } from "@blueprintjs/core";
import { Accordion, AccordionIcon, AccordionButton, AccordionItem, AccordionPanel, Divider, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Col, Container, ProgressBar, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Products from "../components/Products";
import { featuredItems, getCategories, getCategory } from "../utils/util";

const Shop = (props) => {
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

  const getCurrentTotal = () => {
    return props.cart.map((i) => i.quantity * (i.product.price || i.product.variants[0].price)).reduce((total, curr) => total = total + curr);
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
              <Container fluid style={{marginBottom: 10}}>
                <ProgressBar min={0} max={1000} style={{height: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, fontSize: 12}}>
                  <ProgressBar style={{fontSize: 10, backgroundColor: 'silver' }} key={1} now={50} label={"$50 Min"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#78e978'}} key={2} now={50} label={"$100+ Free Delivery"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#4dcd4d'}} key={3} now={50} label={"$150+ 5% off"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#1d9b1d'}} key={4} now={100} label={"$200+ 10% off"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#027802'}} key={5} now={100} label={"$300+ 15% off"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#035103'}} key={6} now={200} label={"$400+ 20% off"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#022002'}} key={7} now={400} label={"$600+ 25% off"} />
                </ProgressBar>
                <ProgressBar now={getCurrentTotal()} max={1000} label={"You Are Here - $" + getCurrentTotal()} style={{fontSize: 10, height: 25, borderTopLeftRadius: 0, borderTopRightRadius: 0}} />
              </Container>
              
              <Products selectedFilter={filterObject} products={products} resetFilter={resetFilter}/>
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