const express = require('express');
const ingestor = require('./ingestor');
const query = require('./query');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allow requests from all origins
app.use(cors());
app.use(express.json());

// Mount the ingestor and query interfaces
app.use('/ingestor', ingestor);
app.use('/query', query);

const port = process.env.PORT || 5000;;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
