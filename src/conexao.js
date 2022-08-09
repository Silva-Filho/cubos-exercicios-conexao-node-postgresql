const { Pool } = require("pg");

const pool = new Pool({
    // user: "postgres",
    user: process.env.DB_USER,
    host: "localhost",
    // database: "biblioteca",
    database: process.env.DB_DATABSE,
    // password: "Hn#1zTj&",
    password: process.env.DB_PASSWORD,
    port: 5432
});

const query = (text, param) => {
    return pool.query(text, param);
}

module.exports = {
    query
}
