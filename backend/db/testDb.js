import db from "./db.js";

export async function testDB() {
  try {
    const res = await db.query("SELECT NOW()");
    console.log("✅ DB WORKS:", res.rows[0]);
  } catch (err) {
    console.error("❌ DB ERROR:", err);
  }
}