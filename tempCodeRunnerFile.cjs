const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); // to serve static files

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
