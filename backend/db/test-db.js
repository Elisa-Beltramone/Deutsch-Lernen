import pool from "./db.js";

try {
  const res = await pool.query("SELECT NOW()");
  console.log(res.rows[0]);
} catch (err) {
  console.error(err);
} finally {
  await pool.end();
}