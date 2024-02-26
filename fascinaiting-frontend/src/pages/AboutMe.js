import React from 'react';
import '../styles/aboutme.css';

const AboutMe = () => (
  <div>
    <header>
      <nav>
        <h1 className='logo'>
          <span className='brand-color'>Fascin</span><a href='/index.html' style={{ color: '#00bfff', textDecoration: 'none' }}>AI</a><span className='brand-color'>ting</span>
        </h1>
        <ul className='nav-links nav-menu'>
          <li><a href='index.html' className='nav-link'>Home</a></li>
          <li><a href='fascinaiting-frontend/src/pages/aboutme.html' className='nav-link'>About</a></li>
          <li><a href='fascinaiting-frontend/src/pages/medical.html' className='nav-link'>Medical</a></li>
          <li><a href='fascinaiting-frontend/src/pages/gaming.html' className='nav-link'>Video Games</a></li>
          <li><a href='fascinaiting-frontend/src/pages/animal.html' className='nav-link active'>Animal Behavior</a></li>
          <li><a href='fascinaiting-frontend/src/pages/medevs.html' className='nav-link'>Medical Devices</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section className='header'>
        <div className='header-content'>
          <h2>About Gunzino</h2>
          <p>A bit more about who I am and what I do.</p>
        </div>
      </section>

      <section className='bio-info'>
        <h3>Personal Biography</h3>
        <p>Hello! I'm Gunzino, and I have a deep passion for the intersection of technology and fitness...</p>
      </section>
    </main>
  </div>
);

export default AboutMe;
