const RSS = require('rss');

// Updated blog posts data
const posts = [
  {
    title: 'Medical Industry',
    description: 'Explore how AI is evolving the medical field.',
    url: 'http://www.fascinaiting.me/src/html/medical.html',
    date: 'April 20, 2023',
  },
  // Future posts will be added here
];

// Updated RSS feed configuration
let feed = new RSS({
    title: 'FascinAIting',
    description: 'Dive into the world of AI with FascinAIting.',
    feed_url: 'http://www.fascinaiting.me/rss.xml',
    site_url: 'http://www.fascinaiting.me',
    language: 'en',
    pubDate: 'April 20, 2023 09:00:00 GMT',
    ttl: '60'
});

// Adding items to the feed from blog content
posts.forEach(post => {
  feed.item({
      title: post.title,
      description: post.description,
      url: post.url,
      date: post.date,
  });
});

// Generating the RSS XML
const xml = feed.xml();

// Outputting the XML to the console for demonstration
console.log(xml);

const fs = require('fs');
fs.writeFileSync('rss.xml', xml);