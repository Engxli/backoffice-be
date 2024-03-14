const mysql = require("mysql2/promise");
const config = require("../config").database;
const createCustomerTable = require("./schemas/customerTable");
const createUserTable = require("./schemas/userTable");

async function initializeTables(connection) {
  await createUserTable(connection);
  await createCustomerTable(connection);
}

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.database}\``
  );
  await connection.query(`USE \`${config.database}\``);

  await initializeTables(connection); // Initialize all tables

  console.log("Database and all tables initialized.");
  await connection.end();
}

const pool = mysql.createPool(config);

module.exports = { pool, initializeDatabase };
