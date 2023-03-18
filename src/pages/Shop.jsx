import { Button } from "@blueprintjs/core";
import { Accordion, AccordionIcon, AccordionButton, AccordionItem, AccordionPanel, Divider, Text, Slider, SliderMark, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Col, Container, ProgressBar, Row } from "react-bootstrap";
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

    if(slug?.length > 0){
      getCategory(slug).then((resp) => setProducts(resp));
    } else {
      featuredItems().then((resp) => setProducts(resp));
    }

    setTimeout(() => {
      setLoader(false);  
    }, 2000);
  }, [])

  useEffect(() => {
    setLoader(true);
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
      setTimeout(() => {
        setLoader(false);  
      }, 2000);
    }
  }, [categories, filterSlug])

  const resetFilter = () => {
    setFilterSlug("");
    setFilterObject({});
    navigate("/shop");
  }

  const getCurrentTotal = () => {
    if(props.cart.length > 0)
      return props.cart.map((i) => i.quantity * (i.product.price || i.product.variants[0].price)).reduce((total, curr) => total = total + curr);
    else {
      return 0;
    }
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
                <AccordionItem key={"according-thc"}>
                  <Text><AccordionButton>> THC %<AccordionIcon /></AccordionButton></Text>
                  <AccordionPanel style={{paddingTop: 40}}>
                    <CustomSlider setValue={(e) => setThcSliderValue(e)} sliderValue={thcSliderValue} />
                  </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem key={"according-cbd"}>
                  <Text><AccordionButton>> CBD %<AccordionIcon /></AccordionButton></Text>
                  <AccordionPanel style={{paddingTop: 40}}>
                    <CustomSlider setValue={(e) => setCbdSliderValue(e)} sliderValue={cbdSliderValue} />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            )}
          </Col>
          <Col lg="9">
            <h1 className="header">Products</h1>
            <Divider />
            <Container fluid style={{marginTop: 10}}>
              <Container fluid style={{marginBottom: 10}}>
                <ProgressBar min={0} max={1000} style={{height: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, fontSize: 12}}>
                  <ProgressBar style={{fontSize: 10, backgroundColor: 'silver' }} key={1} now={50} label={"0%"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#78e978'}} key={2} now={50} label={"Free Delivery"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#4dcd4d'}} key={3} now={50} label={"5% off"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#1d9b1d'}} key={4} now={50} label={"10% off"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#027802'}} key={5} now={100} label={"15% off"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#0c680c'}} key={6} now={100} label={"20% off"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#124712'}} key={7} now={200} label={"25% off"} />
                  <ProgressBar style={{fontSize: 10, backgroundColor: '#022002'}} key={8} now={400} label={"30% off"} />
                </ProgressBar>
                <ProgressBar now={getCurrentTotal()} max={1000} label={"You Are Here - $" + getCurrentTotal()} style={{fontSize: 10, height: 25, borderTopLeftRadius: 0, borderTopRightRadius: 0}} />
              </Container>
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