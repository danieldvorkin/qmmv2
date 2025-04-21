import React from 'react';
import MobileProduct from './mobile/MobileProduct';
import styled from 'styled-components';
import { Tag, TagCloseButton, TagLabel, useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import Cart from './cart';
import { Button, Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';

const SelectedFilter = styled.div`
  text-align: left;
  padding: 5px 5px;
`;

const FloatingButton = styled(Button)`
  position: fixed !important;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  border: 1px solid #e9e9e9 !important;
  border-radius: 50% !important;
  padding: 10px;
  width: 60px;
  height: 60px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  span > svg{
    width: 25px;
    height: 25px;
  }
`;

const CartTag = styled(Tag)`
  position: absolute;
  bottom: 45px;
  right: 35px;
  min-height: 20px;
  min-width: 20px;
  font-size: 12px;
  padding: 0px 6px;
  border-radius: 25px !important;
`;

const MobileShop = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cart, products, filterObject, typeFilter } = props;

  const getBadgeColor = (typeOf) => {
    let strainColors = {
      "indica": "#682D63",
      "sativa": "#F26419",
      "hybrid": "#138A36",
    }

    return strainColors[typeOf];
  }
  
  useEffect(() => {
    if (!location.hash) return;
  
    const id = location.hash.replace('#', '');
  
    let attempts = 0;
    const maxAttempts = 10;
  
    const scrollToElement = () => {
      const element = document.getElementById(id);
  
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(scrollToElement, 100); // Retry after 100ms
      }
    };
  
    scrollToElement();
  }, [location.hash]);

  return (
    <div className="mobile-shop">
      <FloatingButton
        isRound={true}
        icon={<Icon icon="shopping-cart" />}
        onClick={onOpen}
      >
        <CartTag size="lg" color="white" backgroundColor="#2B6CB0">
          {cart?.length}
        </CartTag>
      </FloatingButton>
      <Cart isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      <div style={{ display: 'flex' }}>
        {filterObject?.name && (
          <SelectedFilter>
            <Tag
              size={'lg'}
              key={'lg'}
              borderRadius='full'
              variant='solid'
              colorScheme='green'
            >
              <TagLabel>{filterObject?.name}</TagLabel>
              <TagCloseButton onClick={() => {
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.delete("category");
                navigate(`?${searchParams.toString().toLowerCase()}`);
              }} />
            </Tag>
          </SelectedFilter>
        )}
        {typeFilter && (
          <SelectedFilter>
            <Tag
              size={'lg'}
              key={'lg'}
              borderRadius='full'
              variant='solid'
              backgroundColor={getBadgeColor(typeFilter.toLowerCase())}
            >
              <TagLabel>{typeFilter}</TagLabel>
              <TagCloseButton onClick={() => {
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.delete("type");
                navigate(`?${searchParams.toString().toLowerCase()}`);
              }} />
            </Tag>
          </SelectedFilter>
        )}
      </div>

      {products?.length === 0 && (
        <div className="container"><p>No products available</p></div>
      )}

      {products?.map((product) => (
        <MobileProduct product={product} filterObject={filterObject} />
      ))}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(MobileShop);