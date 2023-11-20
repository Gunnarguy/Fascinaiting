import React from 'react';

const Main = () => (
  <main>
    <section id='search'>
      <h2>Search</h2>
      <form id='search-form'>
        <input type='text' id='search-input' placeholder='Search...'/>
        <button type='submit'>Search</button>
      </form>
    </section>
    <section id='articles'>
      {/* Articles will go here */}
    </section>
    <section id='newsletter'>
      <h2>Subscribe to our newsletter</h2>
      <form id='newsletter-form'>
        <input type='email' id='newsletter-input' placeholder='Enter your email...'/>
        <button type='submit'>Subscribe</button>
      </form>
    </section>
  </main>
);

export default Main;
