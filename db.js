const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "host",
    database: "softjobs",
    password: "drew214",
    port: 5432
});

module.exports = pool;