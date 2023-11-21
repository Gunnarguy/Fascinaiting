import React, { useState } from 'react';

const Main = () => {
  // Mock array of articles
  const initialArticles = [
    { id: 1, title: 'Article One', content: 'Content for article one...' },
    { id: 2, title: 'Article Two', content: 'Content for article two...' },
    // Add more articles as needed
  ];
  const [articles, setArticles] = useState(initialArticles);
  // State for the search input
  const [searchQuery, setSearchQuery] = useState('');
  // State for the newsletter email input
  const [email, setEmail] = useState('');

  // Handle search form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Filter articles based on the search query
    const filteredArticles = initialArticles.filter((article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setArticles(filteredArticles);
  };

  // Handle newsletter form submission
  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    // Simulate an API call to subscribe to the newsletter
    console.log('Newsletter subscription:', email);
    // Reset the email input after submission
    setEmail('');
    // Show a success message or handle errors as needed
  };

  return (
    <main>
      <section id='search'>
        <h2>Search</h2>
        <form id='search-form' onSubmit={handleSearchSubmit}>
          <input
            type='text'
            id='search-input'
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type='submit'>Search</button>
        </form>
      </section>
      <section id='articles'>
        {articles.map((article) => (
          <article key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
          </article>
        ))}
      </section>
      <section id='newsletter'>
        <h2>Subscribe to our newsletter</h2>
        <form id='newsletter-form' onSubmit={handleNewsletterSubmit}>
          <input
            type='email'
            id='newsletter-input'
            placeholder='Enter your email...'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type='submit'>Subscribe</button>
        </form>
      </section>
    </main>
  );
};

export default Main;
