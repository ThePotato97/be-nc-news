const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

console.log("env", process.env.PGDATABASE)
if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}
if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not set');
}


const config =
  ENV === 'production'
    ? {
      connectionString: process.env.DATABASE_URL,
      max: 2,
    }
    : {};

module.exports = new Pool(config);
