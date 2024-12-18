import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Video from './Pages/Video/Video';
import SearchResults from './Components/SearchResults/SearchResults';

const App = () => {
  const [sidebar, setsidebar] = useState(true);

  return (
    <div>
      <Navbar setsidebar={setsidebar} /> 
      
      <Routes>
        <Route path='/' element={<Home sidebar={sidebar} />} />
        <Route path='/video/:categoryId/:videoId' element={<Video />} />
        <Route path="/search" element={<SearchResults />} /> {/* Search results */}
      </Routes>
    </div>
  );
}

export default App;
