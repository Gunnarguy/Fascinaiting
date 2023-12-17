import React from 'react';

const NavigationBar = () => (
  <nav style={{ marginBottom: '20px' }}>
    <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-around' }}>
      <li><a href='#'>Home</a></li>
      <li><a href='#'>About</a></li>
      <li><a href='#'>Blog</a></li>
      <li><a href='#'>Contact</a></li>
    </ul>
  </nav>
);

const BlogPostPreview = ({ title, excerpt }) => (
  <article style={{ marginBottom: '20px' }}>
    <h2>{title}</h2>
    <p>{excerpt}</p>
    <a href='#'>Read more...</a>
  </article>
);

const AdPlaceholder = () => (
  <div style={{ marginBottom: '20px', textAlign: 'center', padding: '20px', background: 'lightgrey' }}>
    Advertisement
  </div>
);

const SubscriptionForm = () => (
  <section style={{ textAlign: 'center', padding: '20px' }}>
    <h2>Subscribe to Our Newsletter</h2>
    <form>
      <input type="email" placeholder='Enter your email' style={{ marginRight: '10px' }}/>
      <button type="submit">Subscribe</button>
    </form>
  </section>
);

const App = () => (
  <div style={{ width: '70%', margin: '0 auto' }}>
    <NavigationBar />
    <h1>Welcome to the Blog!</h1>
    {/* Blog posts list */}
    <BlogPostPreview title="Blog Post 1" excerpt="This is an excerpt from the first blog post." />
    <BlogPostPreview title="Blog Post 2" excerpt="This is an excerpt from the second blog post." />
    {/* Advertisement */}
    <AdPlaceholder />
    {/* Subscription form */}
    <SubscriptionForm />
  </div>
);

export default App;

