const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clinica_odontologica'
});

conn.connect((err) => {
    if (err) {
        console.log("Error connecting to the database:", err);
    }
    console.log("Connected to the database.");
});

module.exports = conn;