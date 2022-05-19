require("dotenv").config();

const express = require('express');

const app = express();

const { API_PORT } = process.env;
const port = API_PORT || 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})