import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CitiesTable = () => {
  const [cities, setCities] = useState([]);       
  const [page, setPage] = useState(1);            
  const [loading, setLoading] = useState(false);  
  const [searchTerm, setSearchTerm] = useState(''); 
  const [sortOrder, setSortOrder] = useState('asc'); 

  // Function to fetch city data with useCallback
  const fetchCities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=&rows=20&start=${page}`
      );
      // Append new cities to the existing list
      setCities((prevCities) => [...prevCities, ...response.data.records]);
    } catch (error) {
      console.error('Error fetching cities', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Infinite scroll logic
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // UseEffect to fetch data and handle scroll event
  useEffect(() => {
    fetchCities();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchCities]);

  // Filter cities based on search term
  const filteredCities = cities.filter((city) =>
    city.fields.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort cities based on sortOrder state
  const sortedCities = filteredCities.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.fields.name.localeCompare(b.fields.name);
    } else {
      return b.fields.name.localeCompare(a.fields.name);
    }
  });

  return (
    <div>
      <h1>Cities List</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search cities..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
      />

      {/* Sort Button */}
      <button
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        style={{ marginBottom: '10px' }}
      >
        Sort by Name: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
      </button>

      {/* Cities Table */}
      <table>
        <thead>
          <tr>
            <th>City Name</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {sortedCities.map((city, index) => (
            <tr key={index}>
              <td>{city.fields.name}</td>
              <td>{city.fields.country}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default CitiesTable;
