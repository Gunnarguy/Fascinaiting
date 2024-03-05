import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(express.static('public')); // Serve static files

app.get('/search', async (req, res) => {
    const drugName = req.query.drugName;
    const API_KEY = 'QOrSiF0h8WolGmVNIu1ORyuE9YWUBBHugmsLnp07';
    const url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${drugName}"&limit=1&api_key=${API_KEY}`;

    if (!fetch) return res.status(503).send('Fetch not initialized');

    try {
        const apiResponse = await fetch(url);
        const data = await apiResponse.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching drug information');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
