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
import Admin from './pages/Admin';
import Login from './pages/Login';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminOrder from './pages/AdminOrder';
import OrderReview from './pages/OrderReview';
import AdminProduct from './pages/AdminProduct';
import NewProduct from './pages/NewProduct';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Shop/>} />
          <Route index path="shop" element={<Shop />} />
          <Route path="home" element={<Home />} />
          <Route path="products/:slug" element={<ProductShow />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="search/:query" element={<Home />} />
          <Route path="checkout" element={<Checkout/>} />
          <Route path="order/review/:id" element={<OrderReview />} />
          <Route path="my_orders" exact element={<MyOrders/>} />
          <Route path="my_orders/:id" exact element={<MyOrders/>} />
          <Route path="admin" element={<Admin/>} />
          <Route path="login" element={<Login />} />
          <Route path="admin/products" exact element={<AdminProducts />} />
          <Route path="admin/products/new" exact element={<NewProduct />} />
          <Route path="admin/orders" exact element={<AdminOrders />} />
          <Route path="admin/orders/:id" exact element={<AdminOrder />} />
          <Route path="admin/products/:slug" exact element={<AdminProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
