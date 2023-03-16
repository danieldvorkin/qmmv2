import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItem } from "../utils/util";
import { Container } from "react-bootstrap";
import { Card, CardHeader } from "@chakra-ui/react";

const ProductShow = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    async function fetchData() {
      const response = await getItem(slug);
      setProduct(response);
    }
    fetchData();
  }, [slug]);

  return (
    <Container>
      <Card>
        <CardHeader>{product.name}</CardHeader>
      </Card>
      
    </Container>
  )
}

export default ProductShow;