// Get the form and input elements
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');

// Listen for the form submission
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from being submitted

    const query = input.value; // Get the search query

    const articles = document.querySelectorAll('article'); // Filter the articles based on the query
    articles.forEach(function(article) {
        const title = article.getAttribute('data-title');
        const shouldDisplay = title.toLowerCase().includes(query.toLowerCase());
        article.style.display = shouldDisplay ? 'block' : 'none';
    });
});
