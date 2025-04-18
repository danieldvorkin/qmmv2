import React, { useRef, useEffect, useState } from "react";
import loading from '../../loading.svg';
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import Filters from "./Filters";
import { 
  Col, 
  Row,
  Badge,
} from "react-bootstrap";
import { Button } from "@blueprintjs/core";
import Product from "../../components/Product";
import { useSearchParams } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import MobileShop from "../../components/MobileShop";

const NewShop = () => {
  const containerRef = useRef(null);
  const { categories, products } = useLoaderData();
  const [searchParams] = useSearchParams();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])
  
  const categoryFilter = searchParams.get('category');
  const typeFilter = searchParams.get('type');

  const getBadgeColor = (typeOf) => {
    let strainColors = {
      "indica": "#682D63",
      "sativa": "#F26419",
      "hybrid": "#138A36",
    }

    return strainColors[typeOf];
  }

  const formatCategory = (category, cats) => {
    for (const categoryGroup of Object.keys(cats)) {
      const foundCategory = cats[categoryGroup].find(cat => cat.slug === category);
      
      if (foundCategory) {
        return foundCategory.name;
      }
    }

    return category;
  }

  const titleize = (str) => {
    return str ? (str.charAt(0).toUpperCase() + str.slice(1)) : null;
  }

  return (
    screenWidth < 768 ? (
      <React.Suspense fallback={
        <div style={{ width: '100%' }}>
          <img style={{ margin: '0 auto' }} src={loading} alt={"loading"} />
        </div>
      }>
        <Await resolve={Promise.all([categories, products])}>
          {(resolvedData) => {
            const [resolvedCategories, resolvedProducts] = resolvedData;
            if (resolvedProducts.length === 0) {
              return (
                <p>No products available</p>
              );
            }
            return (
              <MobileShop 
                categories={resolvedCategories} 
                products={resolvedProducts} 
                filterObject={{ name: formatCategory(categoryFilter, resolvedCategories) }}
                typeFilter={titleize(typeFilter)}
              />
            );
          }}
        </Await>
      </React.Suspense>
    ) : (
      <React.Suspense fallback={
        <div style={{ width: '100%' }}>
          <img style={{ margin: '0 auto' }} src={loading} alt={"loading"} />
        </div>
      }>
        <Await resolve={categories}>
          {(resolvedCategories) => {
            return (
              <div className="container">
                <Col>
                  <Filters categories={resolvedCategories} />

                  <div style={{ display: 'flex', marginTop: 10 }}>
                    {categoryFilter && resolvedCategories && (
                      <Text style={{fontSize: 20, marginTop: 10, marginBottom: 10, marginRight: 10 }}>
                        <Badge bg="primary" style={{ paddingRight: 5, top: 2, position: 'relative' }}>
                          {` ${formatCategory(categoryFilter, resolvedCategories)}`}
                          <Button 
                            className="bp4-minimal" 
                            style={{ backgroundColor: 'transparent' }} 
                            icon="cross" 
                            onClick={() => {
                              searchParams.delete("category");
                              navigate(`?${searchParams.toString()}`);
                            }}
                          />
                        </Badge>
                      </Text>
                    )}
                    {typeFilter && (
                      <Text style={{fontSize: 20, marginTop: 10, marginBottom: 10 }}>
                        <Badge bg="" style={{ paddingRight: 5, top: 2, position: 'relative', backgroundColor: getBadgeColor(typeFilter) }}>
                          {titleize(typeFilter)}
                          <Button 
                            className="bp4-minimal" 
                            style={{ backgroundColor: 'transparent' }} 
                            icon="cross" 
                            onClick={() => {
                              searchParams.delete("type");
                              navigate(`?${searchParams.toString()}`);
                            }}
                          />
                        </Badge>
                      </Text>
                    )}
                  </div>
                </Col>
              </div>
            );
          }}
        </Await>
        
        <Await resolve={products}>
          {(resolvedProducts) => {
            if (resolvedProducts.length === 0) {
              return (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <h4>No products found</h4>
                </div>
              );
            }
            
            return (
              <div className="container">
                <Row>
                  <Col lg="12" style={{ height: categoryFilter || typeFilter ? '77vh' : '83vh', overflowY: 'auto', width: '98%' }} ref={containerRef}>
                    <Row>
                      {resolvedProducts.map((product) => {
                        if (product?.price > 0 && product?.inventory > 0) {
                          return (
                            <Col xl={3} lg={4} md={6} xs={12} key={product.id}>
                              <Product product={product} category={product.category} />
                            </Col>
                          );
                        }
                      })}
                    </Row>
                  </Col>
                </Row>
              </div>
            );
          }}
        </Await>
      </React.Suspense>
    )
  );
}

export default NewShop;