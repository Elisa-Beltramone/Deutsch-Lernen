import db from "../db/db.js";

export async function getProgress(req, res) {
  const userId = 1;

  try {
    const writings = await db.query(`
      SELECT content, COUNT(*) as count
      FROM writings
      GROUP BY content
    `);

    const daily = await db.query(
      `
      SELECT session_date, SUM(minutes_spent) as total
      FROM user_activity
      WHERE user_id = $1
      GROUP BY session_date
      ORDER BY session_date
      `,
      [userId]
    );

    const total = await db.query(
      `
      SELECT SUM(minutes_spent) as total
      FROM user_activity
      WHERE user_id = $1
      `,
      [userId]
    );

    res.json({
      daily: daily.rows,
      total: total.rows[0].total,
      result: writings.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch progress",
    });
  }
}