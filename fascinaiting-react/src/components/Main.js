import React, { useState } from 'react';

const Main = () => {
  // States and handlers
  // ... (existing states and handlers)

  // New JSX code for blog post preview
  const blogPostPreview = articles.map((article) => (
    <article key={article.id} style={{ marginBottom: '20px' }}>
      <h3 style={{ color: 'navy' }}>{article.title}</h3>
      <p>{article.content}</p>
      <a href='#' style={{ color: 'blue' }}>Read more...</a>
    </article>
  ));

  // Existing JSX for the remainder of the Main component
  // ...

  return (
    <main>
      {/* Search, Articles, and Newsletter sections */}
      {/* ... */}
      
      {/* New Blog Post Previews Section */}
      <section id='blog-post-previews'>
        {blogPostPreview}
      </section>
    </main>
  );
};

export default Main;

