import { Button, Divider } from "@chakra-ui/react";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const LandingPage = (props) => {
  const { categories } = props;

  return (
    <Container fluid>
      <Row>
        <Col lg={7} md={12} style={{marginTop: 10, marginRight: '-5px'}}>
          <div className="onHoverPanel img1" style={{ minHeight: 542 }}>
            <h1 className="title">Queen Mary Medical</h1>
            <h5 className="header">Ontario's best cannibas delivery service</h5>
            <Link to="/shop"><Button>SHOP NOW</Button></Link>
          </div>
        </Col>
        <Col lg={5} sm={12}>
          <Row>
            <Col style={{marginTop: 10}}>
              <div className="onHoverPanel img2" style={{ minHeight: 250 }}>
                <h1 className="title">Same Day Delivery</h1>
                <Link to="/shop"><Button style={{ minWidth: 200}}>SHOP NOW</Button></Link>
              </div>
            </Col>
          </Row>
          <Row>
            <Col style={{marginTop: 10}}>
              <div className="onHoverPanel img3" style={{ minHeight: 240 }}>
                <h1 className="title">Specials Everyday</h1>
                <Link to="/shop"><Button style={{ minWidth: 200}}>SHOP NOW</Button></Link>
              </div>  
            </Col>
          </Row>
        </Col>
      </Row>
      
      <Divider style={{marginBottom: 20, marginTop: 20}} />
      
      <Row style={{marginBottom: 20}}>
        <Col>
          <div className="onHoverPanel panel1 happy">
            <h1 className="title" style={{color: 'white'}}>Happy</h1>
          </div>
          <br/>
          <div className="onHoverPanel panel1 calm">
            <h1 className="title" style={{color: 'white'}}>Calm</h1>
          </div>
        </Col>
        <Col style={{marginTop: 20}}>
          <div className="onHoverPanel panel2 energetic">
            <h1 className="title" style={{color: 'white'}}>Energetic</h1>
          </div>
        </Col>
        <Col style={{marginTop: 20}}>
          <div className="onHoverPanel panel1 sleepy">
            <h1 className="title" style={{color: 'white'}}>Sleepy</h1>
          </div>
          <br/>
          <div className="onHoverPanel panel1 creative">
            <h1 className="title" style={{color: 'white'}}>Creative</h1>
          </div>
        </Col>
      </Row>

      <Divider style={{marginBottom: 20, marginTop: 20}} />

      {Object.keys(categories).length > 0 && (
        <Row style={{marginBottom: 50}}>
          <Col lg={7} sm={12}>
            <Row >
              <Col>
                <div className="onHoverPanel shortPanel">
                  <h1 className="header">{Object.keys(categories)[0]}</h1>
                </div>
              </Col>
            </Row>

            <Row style={{marginTop: 20}}>
              <Col lg={6} sm={12}>
                <div className="onHoverPanel shortPanel">
                  <h1 className="header">{Object.keys(categories)[1]}</h1>
                </div>
              </Col>
              <Col lg={6} sm={12} style={{marginTop: 20}}>
                <div className="onHoverPanel shortPanel">
                  <h1 className="header">{Object.keys(categories)[2]}</h1>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg={5} sm={12} style={{marginTop: 20}}>
            <div className="onHoverPanel tallPanel">
              <h1 className="header">{Object.keys(categories)[3]}</h1>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default LandingPage;