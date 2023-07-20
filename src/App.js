import './App.css';
import MainNavbar from './components/navbar';
import { Outlet } from "react-router-dom";
import Cart from './components/cart';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import loading from './loading.svg';
import "slick-carousel/slick/slick.css"
import Footer from "./components/Footer";
import "slick-carousel/slick/slick-theme.css";
import AdminNavbar from './components/AdminNavbar';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  let persistor = persistStore(store);
  
  const loader = () => {
    return (
      <div style={{ width: '100%' }}>
        <img style={{ margin: '0 auto' }} src={loading} alt={"loading"}/>
      </div>
    )
  }

  const adminNavbarWidth = () => {
    let pathnames = location.pathname;
    return (pathnames.includes("admin/orders/") || pathnames.includes("admin/products/")) ? '' : "container"
  }

  const onLandingPage = () => {
    let pathnames = location.pathname;
    return pathnames === "/";
  }

  return (
    <ChakraProvider>
      <Provider store={store}>
        <PersistGate loading={loader()} persistor={persistor}>
          {location.pathname.includes("admin") || location.pathname.includes("login") ? (
            <>
              <AdminNavbar />
              <div className={adminNavbarWidth()}>
                <Outlet />
              </div>
            </>
          ) : (
            <>
              <div>
                <MainNavbar cartClick={onOpen} />
                {onLandingPage() ? (
                  <>
                    <div className={'full-bg'}></div>
                    <Outlet/>
                  </>
                ) : (
                  <div style={{ minHeight: 700 }}>
                    <Outlet />
                  </div>
                )}
                
                
                <Footer />
              </div>
              <Cart isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
            </>
          )}
        </PersistGate>
      </Provider> 
    </ChakraProvider>
  );
}
export default App;
