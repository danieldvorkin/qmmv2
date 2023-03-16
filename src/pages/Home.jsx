import { Divider } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import { getCategories, search } from '../utils/util';
import Product from '../components/Product';

const Home = () => {
  let { query } = useParams();
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if(query?.length > 0 ){
      search(query).then((resp) => setResults(resp))
    } else {
      getCategories().then((resp) => setCategories(resp));
    }
  }, [query]);

  return (
    <div>
      {query ? (
        <Container>
          <h1 className="header">Searching for: {query}</h1>
          <Divider /><br/>
          <Row>
            {results?.length > 0 && results.map((product) => {
              return (
                <Col lg={4} sm={6}>
                  <Product product={product} category={product.category} />
                </Col>
              )
            })}
          </Row>
        </Container>
      ) : (
        <LandingPage categories={categories}/>
      )}
    </div>
  )
}

export default Home;