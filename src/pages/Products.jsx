import { Card, Elevation } from '@blueprintjs/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Products = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/categories").then((resp) => {
      setCategories(resp.data)
    })
  }, []);

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="grid">
        {Object.keys(categories).length > 0 && Object.keys(categories).map((key) => {
          const category = categories[key];

          return (
            <Card className="item" interactive={true} elevation={Elevation.ONE} key={category.id}>
              <p>{key}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Products;