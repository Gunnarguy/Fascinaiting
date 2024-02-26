// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';
import Navigation from './components/navigation';
import SocialLinks from './components/SocialLinks';
import ArticleComponent from './components/ArticleComponent';
import Canvas from './components/canvas';
import './App.css'; // Your main styles

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<MainContent />} />
          {/* Define other routes and components as needed */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
