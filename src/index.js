import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.js";
import Home from "./pages/Home";

import Category from './pages/Category';
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
import Coupons from './pages/Coupons';
import CouponForm from './pages/CouponForm';
import Register from './pages/Customer/register';
import { loader as ShopLoader } from './pages/Shop/loader.jsx';
import { loader as NewShopLoader } from './pages/Shop/newLoader.jsx';
import Shop from './pages/Shop/Shop.jsx';
import NewShop from './pages/Shop/NewShop.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <NewShop />, loader: NewShopLoader },
      { path: "shop", element: <NewShop />, loader: NewShopLoader },
      { path: "old_shop", element: <Shop />, loader: ShopLoader },
      { path: "home", element: <Home /> },
      { path: "products/:slug", element: <ProductShow /> },
      { path: "category/:slug", element: <Category /> },
      { path: "search/:query", element: <Home /> },
      { path: "checkout", element: <Checkout /> },
      { path: "order/review/:id", element: <OrderReview /> },
      { path: "my_orders", element: <MyOrders /> },
      { path: "my_orders/:id", element: <MyOrders /> },
      { path: "admin", element: <Admin /> },
      { path: "login", element: <Login /> },
      { path: "admin/products", element: <AdminProducts /> },
      { path: "admin/products/new", element: <NewProduct /> },
      { path: "admin/orders", element: <AdminOrders /> },
      { path: "admin/orders/:id", element: <AdminOrder /> },
      { path: "admin/products/:slug", element: <AdminProduct /> },
      { path: "admin/coupons", element: <Coupons /> },
      { path: "admin/coupons/:id", element: <CouponForm /> },
      { path: "admin/coupons/new", element: <CouponForm /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
