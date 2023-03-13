import React from "react";
import { Card, CardHeader, CardBody, Heading, Stack, StackDivider, Box, Text, Progress } from '@chakra-ui/react';
import CurrencyFormat from 'react-currency-format';
import { Col, Row } from "react-bootstrap";

const CategoryDetail = (props) => {
  let { category } = props;
  const avgPriceOfItems = category?.items?.reduce((a,v) =>  a = a + v.price , 0 );
  return (
    <Card>
      <CardHeader>
        <Heading size='md'>{category.name}</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing='4'>
          <Row>
            <Col>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                  Summary
                </Heading>
                <Text pt='1' pb='5' fontSize='sm'>
                  Total of {category?.items?.length} items
                </Text>

                <Heading size='xs' textTransform='uppercase'>
                  Average Price per Product
                </Heading>
                <Text pt='1' pb='5' fontSize='sm'>
                  <CurrencyFormat value={avgPriceOfItems} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Text>
              </Box>
            </Col>

            <Col>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                  THC Range
                </Heading>
                <Text pt='1' pb='5' fontSize='sm'>
                  21% - 27%
                </Text>

                <Heading size='xs' textTransform='uppercase'>
                  Statistics
                </Heading>
                <Stack spacing={5}>
                  <div className="stats-section">
                    <Text>Pine - 20%</Text>
                    <Progress hasStripe colorScheme='green' size='sm' value={20} />
                  </div>

                  <div className="stats-section">
                    <Text>Citrus - 50%</Text>
                    <Progress hasStripe colorScheme='blue' size='sm' value={50} />
                  </div>

                  <div className="stats-section">
                    <Text>Earth - 10%</Text>
                    <Progress hasStripe colorScheme='red' size='sm' value={10} />
                  </div>

                  <div className="stats-section">
                    <Text>Sweet & Sour - 80%</Text>
                    <Progress hasStripe colorScheme='orange' size='sm' value={80} />
                  </div>
                </Stack>
              </Box>
            </Col>
          </Row>
          
        </Stack>
      </CardBody>
    </Card>
  )
}

export default CategoryDetail;