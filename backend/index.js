const express = require('express');
const path = require('path');
const cors = require('cors');
const conn = require('./db/conn');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const patientsRoutes = require('./routes/patients');
app.use('/patients', patientsRoutes);

app.listen(3001, (err) => {
    if (err) {
        console.log("Error starting the server:", err);
    }
    console.log("Server is running on port 3001.");
});