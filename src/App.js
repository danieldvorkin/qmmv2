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

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  let persistor = persistStore(store)
  
  const loader = () => {
    return (
      <div style={{ width: '100%' }}>
        <img style={{ margin: '0 auto' }} src={loading} alt={"loading"}/>
      </div>
    )
  }

  return (
    <ChakraProvider>
      <Provider store={store}>
        <PersistGate loading={loader()} persistor={persistor}>
          <div className={location !== "root" ? '' : "container"}>
            <MainNavbar cartClick={onOpen} />
            <Outlet />
          </div>
          <Cart isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </PersistGate>
      </Provider> 
    </ChakraProvider>
  );
}
export default App;
