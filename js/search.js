// Get the form and input elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Define the event listener function
const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the form from being submitted

    const query = searchInput.value; // Get the search query

    const articleElements = document.querySelectorAll('article'); // Filter the articles based on the query
    articleElements.forEach((article) => {
        const title = article.getAttribute('data-title');
        const shouldDisplay = title.toLowerCase().includes(query.toLowerCase());
        article.style.display = shouldDisplay ? 'block' : 'none';
    });
};

// Listen for the form submission
searchForm.addEventListener('submit', handleFormSubmit);
