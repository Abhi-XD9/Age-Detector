import React from 'react';
import {HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Search from './components/Search';
import './index.css'
import Homes from './components/Homes';
import Footers from './components/Footers';



function App() {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Navbar />
          <Routes>
            <Route path="/" element={<Homes />} />
            <Route path="/search" element={<Search />} />
          </Routes>
          <Footers />
        </div>
      </div>
    </HashRouter>
  );
}

export default App;