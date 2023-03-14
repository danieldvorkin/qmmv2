import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LandingPage from '../components/LandingPage';

const Home = () => {
  let params = useParams();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if(!params.query){
      axios.get("https://queenmarymedical.com/api/v1/categories").then((resp) => {
        setCategories(resp.data)
      });
    }
  }, []);


  return (
    <div>
      {params.query ? (
        <h1>Searching for: {params.query}</h1>
      ) : (
        <LandingPage categories={categories}/>
      )}
    </div>
  )
}

export default Home;