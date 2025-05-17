import React, { useEffect } from 'react';
import loading from '../../loading.svg';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Checkbox, Grid, Select, SimpleGrid, Text } from '@chakra-ui/react';
import Product from '../Product';
import { Stack } from 'react-bootstrap';
import { useLocation, useNavigate, useNavigation, useSearchParams } from 'react-router-dom';
import { Badge } from "react-bootstrap";
import { Button } from "@blueprintjs/core";

const WebShop = ({
  categories,
  products,
  categoryFilter,
  typeFilter,
  formatCategory,
  titleize,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const [checked, setChecked] = React.useState([categoryFilter]);

  const getBadgeColor = (typeOf) => {
    let strainColors = {
      "indica": "#682D63",
      "sativa": "#F26419",
      "hybrid": "#138A36",
    }

    return strainColors[typeOf];
  }

  useEffect(() => {
    if (!location.hash) return;

    let attempts = 0;
    const maxAttempts = 10;
    const id = location.hash.replace('#', '');
    const scrollToElement = () => {
      const element = document.getElementById(id);
  
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(scrollToElement, 100); // Retry after 100ms
      }
    };
  
    scrollToElement();
  }, []);

  const strainTypes = [
    { label: "Indica", value: "indica" },
    { label: "Sativa", value: "sativa" },
    { label: "Hybrid", value: "hybrid" },
  ];

  return (
    <div className="container">
      
      <div style={{ display: 'flex', marginTop: 10, marginLeft: '26%' }}>
        {navigation.state !== "loading" && categoryFilter && categories && (
          <Text style={{fontSize: 20, marginTop: 10, marginBottom: 10, marginRight: 10 }}>
            <Badge bg="primary" style={{ paddingRight: 5, top: 2, position: 'relative' }}>
              {` ${formatCategory(categoryFilter, categories)}`}
              <Button 
                className="bp4-minimal" 
                style={{ backgroundColor: 'transparent' }} 
                icon="cross" 
                onClick={() => {
                  searchParams.delete("category");
                  setChecked([]);
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

      <Grid templateColumns="1fr 3fr" gap={4} marginTop={10}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Strain Type
          </Text>
          <hr/>
          <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as='span' flex='1' textAlign='left'>
                    Strain Type
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Stack direction="row" spacing={4} align="center">
                  {strainTypes.map((type) => (
                    <Checkbox
                      key={type.value}
                      isChecked={typeFilter === type.value}
                      onChange={(e) => {
                        if (e.target.checked) {
                          searchParams.set("type", type.value);
                        } else {
                          searchParams.delete("type");
                        }
                        navigate(`?${searchParams.toString()}`);
                      }}
                      value={type.value}
                    >
                      {type.label}
                    </Checkbox> 
                  ))}
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Categories
          </Text>
          <hr/> 
          <Accordion defaultIndex={[0]} allowMultiple>
            {Object.keys(categories).map((categoryGroup) => (
              <AccordionItem key={categoryGroup}>
                <h2>
                  <AccordionButton>
                    <Box as='span' flex='1' textAlign='left'>
                      {categoryGroup}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Stack direction="row" spacing={4} align="center" key={categoryGroup}>
                    {categories[categoryGroup].map((category) => (
                      <Checkbox
                        key={category.id}
                        isChecked={checked.includes(category.slug)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            searchParams.set("category", category.slug);
                          } else {
                            searchParams.delete("category");
                          }

                          setChecked((prev) => {
                            if (e.target.checked) {
                              return [category.slug];
                            } else {
                              return prev.filter((cat) => cat !== category.slug);
                            }
                          });
                          // Update the URL with the new search parameters
                          navigate(`?${searchParams.toString().toLowerCase()}`);
                        }}
                        value={category.slug}
                      >
                        {category.name}
                      </Checkbox> 
                    ))}
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
        
        {navigation.state === "loading" ? (
          <div style={{ width: '100%' }}>
            <img style={{ margin: '0 auto' }} src={loading} alt={"loading"} />
          </div>
        ) : (
          <SimpleGrid columns={[1, 2, 3]} spacing={5} maxHeight={(categoryFilter || typeFilter) ? "78vh" : "87vh"} overflowY="auto">
            {products?.map((product) => (
              <Product product={product} category={product.category} />  
            ))}
            {products?.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Text fontSize="xl" color="gray.500">
                  No products found.
                </Text>
              </div>
            )}
          </SimpleGrid>
        )}
      </Grid>
    </div>  
  );
}

export default WebShop;