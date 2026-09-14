const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const RAW_ORIGINS = process.env.CORS_ORIGIN || "http://localhost:3000";
const ALLOWED_ORIGINS = RAW_ORIGINS
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-key-1234567890";
const JWT_ISSUER = process.env.JWT_ISSUER || "hybrid-voting-gateway";
const JWT_AUD = process.env.JWT_AUD || "hybrid-voting-client";
const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || "http://localhost:7070/backend";
const PORT = Number(process.env.PORT || 5000);
const SESSION_SECRET = process.env.SESSION_SECRET || JWT_SECRET;

module.exports = {
  ALLOWED_ORIGINS,
  JWT_SECRET,
  JWT_ISSUER,
  JWT_AUD,
  JAVA_BACKEND_URL,
  PORT,
  SESSION_SECRET,
};
