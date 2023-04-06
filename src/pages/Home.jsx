import { Button, ButtonGroup, Divider } from '@chakra-ui/react';
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
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setResults([]);
    setPage(1);

    if(query?.length > 0 ){
      search(query, 1).then((resp) => {
        setResults(resp.items)
        setTotalCount(resp.total_count)
      });
    } else {
      getCategories().then((resp) => setCategories(resp));
    }
  }, [query]);

  useEffect(() => {
    if(query?.length > 0 ){
      search(query, page).then((resp) => {
        setResults([...results, ...resp.items])
        setTotalCount(resp.total_count)
      });
    } else {
      getCategories().then((resp) => setCategories(resp));
    }
  }, [page]);

  return (
    <div>
      {query ? (
        <Container>
          <h1 className="header">Searching for: {query}</h1>
          <br/>
          <Row>
            {results?.length > 0 && results.map((product) => {
              return (
                <Col lg={4} sm={6} key={product.id}>
                  <Product product={product} category={product.category} />
                </Col>
              )
            })}
            {results?.length < totalCount && (
              <ButtonGroup style={{ textAlign: 'center', width: '100%', display: 'block !important', marginTop: 20 }}>
                <Button onClick={() => setPage(page + 1)}>Show More</Button>
              </ButtonGroup>
            )}
            
            
          </Row>
        </Container>
      ) : (
        <LandingPage categories={categories}/>
      )}
    </div>
  )
}

export default Home;