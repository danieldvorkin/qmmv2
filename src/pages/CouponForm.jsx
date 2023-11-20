import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_COUPON, GET_COUPON, UPDATE_COUPON } from './graphql/coupons';
import { Button, ButtonGroup, Card, CardBody, CardHeader, Input, Text } from '@chakra-ui/react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const CouponForm = ({ initialValues }) => {
  const navigate = useNavigate();
  const [couponData, setCouponData] = useState({
    id: initialValues ? initialValues.id : '',
    code: initialValues ? initialValues.code : '',
    amount: initialValues ? initialValues.amount : '',
    limit: initialValues ? initialValues.limit : '',
    expiration: initialValues ? initialValues.expiration : '',
    percentage: initialValues ? initialValues.percentage : false,
    unlimitedUses: initialValues ? initialValues.unlimitedUses : false
  });

  const { id } = useParams();
  const { data: coupon } = useQuery(GET_COUPON, {
    variables: {
      id: id
    }
  });

  useEffect(() => {
    if(!!coupon?.coupon){
      setCouponData({ ...coupon?.coupon })
    }
  }, [coupon])

  const [createCoupon] = useMutation(CREATE_COUPON);

  const [updateCoupon] = useMutation(UPDATE_COUPON);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCouponData((prevData) => ({ ...prevData, [name]: checked }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const variables = {
      code: couponData.code,
      amount: parseFloat(couponData.amount) || 0,
      limit: parseInt(couponData.limit) || 0,
      expiration: couponData.expiration || new Date().toISOString(),
      percentage: couponData.percentage || false,
      unlimitedUses: couponData.unlimitedUses || false,
      active: couponData.active || true
    };

    if (id) {
      variables.id = id;
      updateCoupon({ variables }).then((resp) => {
        if(!!resp.data.updateCoupon){
          navigate("/admin/coupons");
        }
      })
    } else {
      createCoupon({ variables }).then((resp) => {
        if(!!resp.data.createCoupon){
          navigate("/admin/coupons");
        }
      })
    }
  };

  return (
    <Container>
      <Card>
        <CardHeader>
          <Text fontSize={"xl"}>Coupon Form</Text>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={3}>
                <Form.Group className="mb-3" controlId="code">
                  <Form.Label>Code</Form.Label>
                  <Form.Control type="text" placeholder="Enter code" onChange={(e) => handleInputChange(e)} value={couponData?.code} name="code" />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group className="mb-3" controlId="limit">
                  <Form.Label>Limit</Form.Label>
                  <Form.Control type="text" placeholder="Enter limit" onChange={(e) => handleInputChange(e)} value={couponData?.limit} name="limit" />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group className="mb-3" controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="text" placeholder="Enter amount" onChange={(e) => handleInputChange(e)} value={couponData?.amount} name="amount" />
                </Form.Group>
              </Col>
              
              <Col lg={3}>
                <Form.Group className="mb-3" controlId="expiration">
                  <Form.Label>Expiration</Form.Label>
                  <Input placeholder="Select Date" size="md" type="date" onChange={(e) => handleInputChange(e)} value={couponData?.expiration} name="expiration" />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={3}>
                <Form.Group className="mb-3" controlId="percentage" id="coupon-checkbox" >
                  <Form.Label>Percent/Dollar Amount</Form.Label>
                  <Form.Check 
                    type="checkbox" 
                    size='lg' 
                    label={"Checked = Percent"} 
                    onChange={() => handleCheckboxChange({ target: { name: 'percentage', checked: !couponData?.percentage } })}
                    checked={couponData?.percentage} 
                  />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group className="mb-3" controlId="unlimitedUses" id="coupon-checkbox" >
                  <Form.Label>Unlimited Uses?</Form.Label>
                  <Form.Check 
                    type="checkbox" 
                    size='lg' 
                    label={"Turn on to ignore Limit"} 
                    onChange={() => handleCheckboxChange({ target: { name: 'unlimitedUses', checked: !couponData?.unlimitedUses } })}
                    checked={couponData?.unlimitedUses} 
                  />
                </Form.Group>
              </Col>
            </Row>

            <div style={{float: 'right'}}>
              <ButtonGroup>
                <Button onClick={() => navigate("/admin/coupons")}>Cancel</Button>
                <Button colorScheme={"green"} type="submit">Create Coupon</Button>
              </ButtonGroup>
            </div>
            
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default CouponForm;