
// Get the form and input elements
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');

// Listen for the form submission
form.addEventListener('submit', function(event) {
    // Prevent the form from being submitted
    event.preventDefault();

    // Get the search query
    const query = input.value;

    // Filter the articles based on the query
    // This will require modifying the HTML of your articles to include a data attribute with the article title or keywords
    const articles = document.querySelectorAll('article');
    articles.forEach(function(article) {
        const title = article.getAttribute('data-title');
        if (title.toLowerCase().includes(query.toLowerCase())) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
});
