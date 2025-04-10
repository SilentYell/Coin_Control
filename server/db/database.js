const { Pool } = require("pg");

const client = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE, // Corrected from 'name' to 'database'
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

client
  .connect()
  .catch(e => console.log(`Error connecting to Postgres server:\n${e}`));


module.exports = client;