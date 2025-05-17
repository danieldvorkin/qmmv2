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
import "slick-carousel/slick/slick-theme.css";
import AdminNavbar from './components/AdminNavbar';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';


const isDev = process.env.NODE_ENV === "development";
export const client = new ApolloClient({
  uri: isDev ?
    'http://localhost:3000/graphql' :
    'https://queenmarymedical.herokuapp.com/graphql',
  cache: new InMemoryCache(),
});

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
    return pathnames === "/" || pathnames == "/shop";
  }

  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Provider store={store}>
          <PersistGate loading={loader()} persistor={persistor}>
            {location.pathname.includes("admin") ? (
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
                  <Outlet />
                </div>
                <Cart isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
              </>
            )}
          </PersistGate>
        </Provider> 
      </ChakraProvider>
    </ApolloProvider>
  );
}
export default App;
