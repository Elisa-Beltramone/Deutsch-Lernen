import db from "../db/db.js";

export async function trackTime(req, res) {
  const userId = 1;
  const { page, duration } = req.body;

  try {
    await db.query(
      `
      INSERT INTO user_activity
      (user_id, session_date, minutes_spent, page)
      VALUES ($1, CURRENT_DATE, $2, $3)
      `,
      [userId, duration, page]
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}