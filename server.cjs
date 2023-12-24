const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/message', (req, res) => {
       // Get the message from the request's body
       const messageText = req.body.message;

       // For now, we'll just echo the message back.
       // Here you would typically integrate with AI logic or database
       const responseText = `Echo: ${messageText}`;

       // Respond with JSON
       res.json({ response: responseText });
});

const port = 5500;
app.listen(port, () => {
       console.log(`Server running on port ${port}`);
});
