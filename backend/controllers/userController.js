import db from "../db/db.js";

export async function getUsers(req, res) {
  try {
    const result = await db.query("SELECT * FROM users");

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
}