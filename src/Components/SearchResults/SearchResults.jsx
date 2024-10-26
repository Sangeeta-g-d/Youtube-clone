import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './SearchResults.css'; // You can create this CSS file for styling
import { API_KEY } from '../../data';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search).get('query');

  const fetchSearchResults = async () => {
    if (!query) return;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=10&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setResults(data.items);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  return (
    <div className="search-results">
      
      <div className="results-list">
        {results.map((item) => {
          const videoId = item.id.videoId;
          const categoryId = item.snippet.channelId; // This is just a placeholder. You need to set this based on your actual category logic.

          return (
            <Link 
              key={videoId} 
              to={`/video/${categoryId}/${videoId}`} // Link to the Video page
              className="result-item"
            >
              <img src={item.snippet.thumbnails.default.url} alt={item.snippet.title} />
              <div className="result-info">
                <h3>{item.snippet.title}</h3>
                <p>{item.snippet.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
