import React, { useRef, useEffect, useState } from "react";
import loading from '../../loading.svg';
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import MobileShop from "../../components/MobileShop";
import WebShop from "../../components/web/WebShop";

const NewShop = () => {
  const containerRef = useRef(null);
  const { categories, products } = useLoaderData();
  const [searchParams] = useSearchParams();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])
  
  const categoryFilter = searchParams.get('category');
  const typeFilter = searchParams.get('type');

  const getBadgeColor = (typeOf) => {
    let strainColors = {
      "indica": "#682D63",
      "sativa": "#F26419",
      "hybrid": "#138A36",
    }

    return strainColors[typeOf];
  }

  const formatCategory = (category, cats) => {
    for (const categoryGroup of Object.keys(cats)) {
      const foundCategory = cats[categoryGroup].find(cat => cat.slug === category);
      
      if (foundCategory) {
        return foundCategory.name;
      }
    }

    return category;
  }

  const titleize = (str) => {
    return str ? (str.charAt(0).toUpperCase() + str.slice(1)) : null;
  }

  return (
    <React.Suspense fallback={
      <div style={{ width: '100%' }}>
        <img style={{ margin: '0 auto' }} src={loading} alt={"loading"} />
      </div>
    }>
      <Await resolve={Promise.all([categories, products])}>
        {(resolvedData) => {
          const [resolvedCategories, resolvedProducts] = resolvedData;
          return (
            screenWidth < 468 ? (
              <MobileShop 
                categories={resolvedCategories} 
                products={resolvedProducts} 
                filterObject={{ name: formatCategory(categoryFilter, resolvedCategories) }}
                typeFilter={titleize(typeFilter)}
              />
            ) : (
              <WebShop 
                products={resolvedProducts} 
                categories={resolvedCategories}
                categoryFilter={categoryFilter}
                typeFilter={typeFilter}
                formatCategory={formatCategory}
                titleize={titleize}
                containerRef={containerRef}
              />
            )
          );
        }}
      </Await>
    </React.Suspense>
  );
}

export default NewShop;