import React from 'react';

const Animal = () => (
  <div>
    <header>
      <nav>
        <h1 className='logo'>
          <span className='brand-color'>Fascin</span><a href='/index.html' style={{ color: '#00bfff', textDecoration: 'none' }}>AI</a><span className='brand-color'>ting</span>
        </h1>
        <ul className='nav-links nav-menu'>
          <li><a href='index.html' className='nav-link'>Home</a></li>
          <li><a href='../pages/aboutme.html' className='nav-link'>About</a></li>
          <li><a href='../pages/medical.html' className='nav-link'>Medical</a></li>
          <li><a href='../pages/gaming.html' className='nav-link'>Video Games</a></li>
          <li><a href='../pages/animal.html' className='nav-link active'>Animal Behavior</a></li>
          <li><a href='../pages/medevs.html' className='nav-link'>Medical Devices</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section className='header'>
        <div className='header-content'>
          <h2>Animal Behavior</h2>
          <p>Discover how AI is revolutionizing the study of animal behavior.</p>
        </div>
      </section>

      <section className='articles'>
        <article className='article'>
          <h3>AI in Gaming</h3>
          <p>Exploring the impact of AI on understanding and enhancing animal behavior.</p>
          <a href='link_to_full_article_1.html' className='read-more btn'>Read More</a>
        </article>
        <article className='article'>
          <h3>Article Title 1</h3>
          <p>Introduction to the article content goes here...</p>
          <a href='link_to_full_article_2.html' className='read-more btn'>Read More</a>
        </article>
        <article className='article'>
          <h3>Article Title 2</h3>
          <p>Introduction to the article content goes here...</p>
          <a href='link_to_full_article_3.html' className='read-more btn'>Read More</a>
        </article>
      </section>

      <section className='social-links'>
        <div className='container'>
          <a href='https://twitter.com/Gunzeroni' aria-label='Twitter'>
            <img alt='Twitter logo' src='https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg' width='42' />
          </a>
        </div>
      </section>
    </main>

    <footer className='site-footer'>
      <div className='container'>
        <p>&copy; 2024 FascinAIting - All rights reserved.</p>
      </div>
    </footer>
  </div>
);

export default Animal;
