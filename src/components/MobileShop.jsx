import React from 'react';
import MobileProduct from './mobile/MobileProduct';
import Filters from './mobile/Filters';
import styled from 'styled-components';
import { Tag, TagCloseButton, TagLabel } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SelectedFilter = styled.div`
  text-align: left;
  padding: 5px 5px;
`;

const MobileShop = ({ 
  products, 
  categories, 
  setFilterSlug, 
  filterObject, 
  typeFilter,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

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
      <Filters 
        categories={categories} 
        setFilterSlug={setFilterSlug}
      />

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
      
      {products.map((product) => (
        <MobileProduct product={product} filterObject={filterObject} />
      ))}
    </div>
  );
}

export default MobileShop;