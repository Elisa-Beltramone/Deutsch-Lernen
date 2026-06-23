import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;
console.log("PASSWORD:", process.env.DB_PASSWORD);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

db.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

export default db;