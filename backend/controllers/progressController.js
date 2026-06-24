import db from "../db/db.js";

export async function getProgress(req, res) {
  try {
    const userId = req.user.userId;

    const writings = await db.query(
      `
      SELECT content, level, created_at
      FROM writings
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    const daily = await db.query(
      `
      SELECT
        session_date,
        COALESCE(SUM(minutes_spent), 0) AS total
      FROM user_activity
      WHERE user_id = $1
      GROUP BY session_date
      ORDER BY session_date
      `,
      [userId]
    );

    const total = await db.query(
      `
      SELECT
        COALESCE(SUM(minutes_spent), 0) AS total
      FROM user_activity
      WHERE user_id = $1
      `,
      [userId]
    );

    res.status(200).json({
      daily: daily.rows,
      total: Number(total.rows[0].total),
      writings: writings.rows,
    });
  } catch (err) {
    console.error("Progress controller error:", err);

    res.status(500).json({
      error: "Failed to fetch progress",
    });
  }
}