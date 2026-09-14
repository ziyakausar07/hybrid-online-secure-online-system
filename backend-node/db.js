const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const MYSQL_HOST = process.env.MYSQL_HOST || process.env.DB_CONNECTION || "localhost";
const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3306);
const MYSQL_USER = process.env.DB_USER || "root";
const MYSQL_PASSWORD = process.env.DB_PASSWORD || "";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "voting_db";

const DB_CONFIG_AVAILABLE = Boolean(MYSQL_USER && MYSQL_HOST && MYSQL_DATABASE);

let pool;

async function initializePool() {
  if (!DB_CONFIG_AVAILABLE) {
    console.warn(
      "⚠️ MySQL DB is not configured. Starting in degraded mode; set DB_USER, DB_PASSWORD, MYSQL_HOST, and MYSQL_DATABASE to enable database features."
    );
    return false;
  }

  try {
    pool = mysql.createPool({
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("✅ MySQL DB pool created");
    return true;
  } catch (err) {
    console.warn(
      `⚠️ MySQL DB pool could not be created: ${err.message}. Starting in degraded mode.`
    );
    pool = null;
    return false;
  }
}

async function getDBConnection() {
  if (!pool) {
    throw new Error("Pool not initialized. Call initializePool() first.");
  }
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (err) {
    console.error("❌ Error acquiring connection from pool:", err.message);
    throw err;
  }
}

async function execute(sql, params = []) {
  if (!pool) {
    throw new Error("Pool not initialized. Call initializePool() first.");
  }
  try {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("❌ Database Execution Error:", error);
    throw error;
  }
}

function getPool() {
  return pool;
}

module.exports = { initializePool, getDBConnection, execute, getPool };
