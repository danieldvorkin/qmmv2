import './App.css';
import MainNavbar from './components/navbar';
import { Outlet } from "react-router-dom";
import Cart from './components/cart';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom'

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  return (
    <ChakraProvider>
      <div className={location !== "root" ? '' : "container"}>
        <MainNavbar cartClick={onOpen} />
        <Outlet />
        {/* <Footer /> */}
      </div>
      <Cart isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </ChakraProvider>
  );
}

export default App;
