import React from 'react';
import { useParams } from 'react-router-dom';
import LandingPage from '../components/LandingPage';

const Home = () => {
  let params = useParams();

  return (
    <div>
      {params.query ? (
        <h1>Searching for: {params.query}</h1>
      ) : (
        <LandingPage />
      )}
    </div>
  )
}

export default Home;