// src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="site-header">
      <nav className="site-nav">
        <button className="hamburger-menu" onClick={toggleMenu} aria-label="Menu">
          <span>&#9776;</span>
        </button>
        <h1 className="logo">
          <span className="brand-color">Fascin</span>
          <Link to="/" style={{ color: '#00bfff', textDecoration: 'none' }}>AI</Link>
          <span className="brand-color">ting</span>
        </h1>
        <ul className={`nav-links nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/about" className="nav-link">About</Link></li>
          <li><Link to="/medical" className="nav-link">Medical</Link></li>
          <li><Link to="/gaming" className="nav-link">Video Games</Link></li>
          <li><Link to="/animal-behavior" className="nav-link">Animal Behavior</Link></li>
          <li><Link to="/medical-devices" className="nav-link">Medical Devices</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
