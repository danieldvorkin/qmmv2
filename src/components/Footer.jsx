import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <Container>
      <Row>
        <Col>
          <ul style={{ listStyle: 'none' }}>
            <li>
              List 1 Item 1
            </li>
          </ul>
        </Col>
        <Col>
          <ul style={{ listStyle: 'none' }}>
            <li>
              List 2 Item 1
            </li>
          </ul>
        </Col>
        <Col>
          <ul style={{ listStyle: 'none' }}>
            <li>
              List 3 Item 1
            </li>
          </ul>
        </Col>
        <Col>
          <ul style={{ listStyle: 'none' }}>
            <li>
              List 4 Item 1
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  )
}

export default Footer;