import { Button } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [featuredOfferings, setFeaturedOfferings] = useState([]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/items/featured_items").then((resp) => {
      setFeaturedOfferings(resp.data);
    });
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md="7" sm="12" style={{marginTop: 10, marginRight: '-5px'}}>
          <div className="onHoverPanel img1" style={{ minHeight: 542, backgroundColor: 'silver', borderRadius: 5, padding: '50px 50px' }}>
            <h1 className="title">Queen Mary Medical</h1>
            <h5 className="header">Ontario's best cannibas delivery service</h5>
            <Link to="/shop"><Button style={{ minWidth: 400}}>SHOP NOW</Button></Link>
          </div>
        </Col>
        <Col md="5" sm="12">
          <Row>
            <Col style={{marginTop: 10}}>
              <div className="onHoverPanel img2" style={{ minHeight: 250, backgroundColor: 'silver', borderRadius: 5, padding: '50px 50px' }}>
                <h1 className="title">Same Day Delivery</h1>
                <Link to="/shop"><Button style={{ minWidth: 200}}>SHOP NOW</Button></Link>
              </div>
            </Col>
          </Row>
          <Row>
            <Col style={{marginTop: 10}}>
              <div className="onHoverPanel img3" style={{ minHeight: 240, backgroundColor: 'silver', borderRadius: 5, padding: '50px 50px' }}>
                <h1 className="title">Specials Everyday</h1>
                <Link to="/shop"><Button style={{ minWidth: 200}}>SHOP NOW</Button></Link>
              </div>  
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default LandingPage;