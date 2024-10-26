import React, { useState } from 'react';
import './Navbar.css';
import menu_icon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import search_icon from '../../assets/search.png';
import upload_icon from '../../assets/upload.png';
import more_icon from '../../assets/more.png';
import notification_icon from '../../assets/notification.png';
import profile_icon from '../../assets/jack.png';
import { Link, useNavigate } from 'react-router-dom';
import { API_KEY } from '../../data';

const Navbar = ({ setsidebar }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=5&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const suggestionList = data.items.map(item => item.snippet.title);
      setSuggestions(suggestionList);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]); // Clear suggestions on error
    }
  };

  const handleInputChange = (event) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);
    fetchSuggestions(searchQuery);
  };

  const handleBlur = () => {
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    navigate(`/search?query=${encodeURIComponent(suggestion)}`); // Navigate to SearchResults with query
    setSuggestions([]); // Clear suggestions after clicking
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      navigate(`/search?query=${encodeURIComponent(query)}`); // Navigate on Enter key press
      setSuggestions([]); // Clear suggestions after pressing Enter
    }
  };

  return (
    <nav className='flex-div'>
      <div className='nav-left flex-div'>
        <img onClick={() => {
          setsidebar(prev => !prev);
        }} className='menu-icon' src={menu_icon} alt='' />
        <Link to="/"><img className='logo' src={logo} alt='' /></Link>
      </div>

      <div className='nav-middle flex-div'>
        <div className='search-box flex-div'>
          <input 
            type='text' 
            placeholder='Search' 
            value={query}
            onChange={handleInputChange}
            onBlur={handleBlur} 
            onKeyPress={handleKeyPress} // Listen for Enter key press
          />
          <img src={search_icon} alt='' />
        </div>
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="suggestion-item" 
                onClick={() => handleSuggestionClick(suggestion)} // Handle suggestion click
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='nav-right flex-div'>
        <img src={upload_icon} alt="" />
        <img src={more_icon} alt="" />
        <img src={notification_icon} alt="" />
        <img src={profile_icon} className='user-icon' alt="" />
      </div>
    </nav>
  );
};

export default Navbar;
