import React from 'react';

const Medevs = () => (
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
          <li><a href='../pages/animal.html' className='nav-link'>Animal Behavior</a></li>
          <li><a href='../pages/medevs.html' className='nav-link active'>Medical Devices</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section className='header'>
        <div className='header-content'>
          <h2>Medical Devices</h2>
          <p>Discover how AI is innovating the development of medical devices.</p>
        </div>
      </section>

      <section className='articles'>
        <article className='article'>
          <h3>AI in Medical Devices</h3>
          <p>Progress in AI is driving the creation of more sophisticated and intelligent medical devices.</p>
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

      <blockquote className='twitter-tweet'>
        <p lang='en' dir='ltr'>📢 The Rise of AI in Medical Devices 🩺💻<br /><br />In 2023 alone, 91 innovative devices were cleared.<br /><br />📈 A Growing Field: The number of AI-enabled medical devices has surged in the past five years, with a staggering 33% increase in 2023. Medical specialties like radiology,…</p>&mdash; NerfGun (@Gunzeroni) <a href='https://twitter.com/Gunzeroni/status/1759801570185855263?ref_src=twsrc%5Etfw'>February 20, 2024</a>
      </blockquote>
      <script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script>

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

export default Medevs;
