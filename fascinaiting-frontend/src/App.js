import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import your page components. Adjust these imports according to your actual page components.
import AboutMe from './pages/AboutMe';
import Animal from './pages/Animal';
import Gaming from './pages/Gaming';
import Medevs from './pages/Medevs';
import Medical from './pages/Medical';

function App() {
  return (
    <Router>
      <div className='App'>
        {/* Navigation Component here (if you have one) */}
        <Routes>
          <Route path='/aboutme' element={<AboutMe />} />
          <Route path='/animal' element={<Animal />} />
          <Route path='/gaming' element={<Gaming />} />
          <Route path='/medevs' element={<Medevs />} />
          <Route path='/medical' element={<Medical />} />
          {/* Add more routes as needed */}
        </Routes>
        {/* Footer Component here (if you have one) */}
      </div>
    </Router>
  );
}

export default App;
