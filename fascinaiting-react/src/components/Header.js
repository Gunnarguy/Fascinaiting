import React, { useState } from 'react';

const Header = () => {
  // State to manage the dropdown visibility
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  }

  return (
    <header>
      <h1>Fascinating</h1>
      <nav>
        <a href='#'>Home</a>
        <div className='dropdown'>
          <button onClick={toggleDropdown}>About</button>
          {isDropdownVisible && (
            <div className='dropdown-content'>
              <a href='#'>Our Mission</a>
              <a href='#'>The Team</a>
              <a href='#'>History</a>
            </div>
          )}
        </div>
        <a href='#'>Contact</a>
      </nav>
    </header>
  );
}

export default Header;

