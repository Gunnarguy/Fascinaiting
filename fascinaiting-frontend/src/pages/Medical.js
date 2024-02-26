import React from 'react';

const Medical = () => (
  <div>
    <header>
      <nav>
        <h1 className='logo'>
          <span className='brand-color'>Fascin</span><a href='/index.html' style={{ color: '#00bfff', textDecoration: 'none' }}>AI</a><span className='brand-color'>ting</span>
        </h1>
        <ul className='nav-links nav-menu'>
          <li><a href='index.html' className='nav-link'>Home</a></li>
          <li><a href='../pages/aboutme.html' className='nav-link'>About</a></li>
          <li><a href='../pages/medical.html' className='nav-link active'>Medical</a></li>
          <li><a href='../pages/gaming.html' className='nav-link'>Video Games</a></li>
          <li><a href='../pages/animal.html' className='nav-link'>Animal Behavior</a></li>
          <li><a href='../pages/medevs.html' className='nav-link'>Medical Devices</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section className='header'>
        <div className='header-content'>
          <h2>Healthcare and AI</h2>
          <p>Exploring how AI is revolutionizing healthcare and medicine.</p>
        </div>
      </section>

      <section className='articles'>
        <article className='article'>
          <h3>Advancement in AI Technology</h3>
          <p>Advancements in AI technology are transforming the landscape of healthcare.</p>
          <a href='link_to_full_article_1.html' className='read-more btn'>Read More</a>
        </article>
        <article className='article'>
          <h3>Introduction to AI in Healthcare</h3>
          <p>Introduction to the article content goes here...</p>
          <a href='link_to_full_article_2.html' className='read-more btn'>Read More</a>
        </article>
        <article className='article'>
          <h3>Future of AI in Medicine</h3>
          <p>Introduction to the article content goes here...</p>
          <a href='link_to_full_article_3.html' className='read-more btn'>Read More</a>
        </article>
      </section>

      <blockquote className='twitter-tweet'>
        <p lang='en' dir='ltr'>📢 Revolutionary AI advancements in healthcare! Discover how AI is transforming medical diagnosis, treatment, and healthcare efficiency... <a href='https://t.co/b9A6RjyViP'>https://t.co/b9A6RjyViP</a></p>&mdash; NerfGun (@Gunzeroni) <a href='https://twitter.com/Gunzeroni/status/1759799411075657890?ref_src=twsrc%5Etfw'>February 20, 2024</a>
      </blockquote>
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

export default Medical;
