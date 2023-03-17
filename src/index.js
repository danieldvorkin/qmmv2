import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.js";
import Home from "./pages/Home";

import Category from './pages/Category';
import Shop from './pages/Shop';
import ProductShow from './pages/ProductShow';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="products/:slug" element={<ProductShow />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="search/:query" element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="checkout" element={<Checkout/>} />
          <Route path="my_orders" element={<MyOrders/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
