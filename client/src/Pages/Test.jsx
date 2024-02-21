import React, { useEffect } from 'react';

const Test = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://public.api.careerjet.net/search?locale_code=US_en&pagesize=1&sort=salary&keywords=java&page=124&location=new+york');
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures that the effect runs once after the initial render

  return (
    <div>Test</div>
  );
};

export default Test;
