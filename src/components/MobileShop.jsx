import React from 'react';
import loader from '../loading.svg';
import MobileProduct from './mobile/MobileProduct';
import Filters from './mobile/Filters';
import styled from 'styled-components';
import { Tag, TagCloseButton, TagLabel } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SelectedFilter = styled.div`
  width: 100%;
  text-align: left;
  padding: 10px 15px;
`;

const MobileShop = ({ 
  loading, 
  products, 
  categories, 
  setFilterSlug, 
  filterObject, 
  resetFilter,
  onSearchChange
}) => {
  const location = useLocation();
  console.log('Current route:', location.hash);
  
  useEffect(() => {
    if (!location.hash) return;
  
    const id = location.hash.replace('#', '');
  
    let attempts = 0;
    const maxAttempts = 10;
  
    const scrollToElement = () => {
      const element = document.getElementById(id);
  
      if (element) {
        const offset = 100;
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
      <Filters 
        categories={categories} 
        setFilterSlug={setFilterSlug}
      />

      {loading ? (
        <div style={{ width: '100%' }}>
          <img style={{ margin: '0 auto' }} src={loader} alt={"loading"}/>
        </div>
      ) : (
        <>
          {/* <input 
            type="text" 
            placeholder="Search..." 
            style={{ width: '100%', padding: '10px', margin: '10px 0' }} 
            onChange={onSearchChange}
          /> */}
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
                <TagCloseButton onClick={() => resetFilter()} />
              </Tag>
            </SelectedFilter>
          )}
          {products.map((product) => (
            <MobileProduct product={product} filterObject={filterObject} />
          ))}
        </>
      )}
    </div>
  );
}

export default MobileShop;