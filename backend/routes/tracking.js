import express from "express";
const router = express.Router();

const userId = 1;

router.post("/track-time", async (req, res) => {
  console.log("🔥 track-time called", req.body);
  
  const { page, duration } = req.body;

  try {
    await pool.query(
      `INSERT INTO user_activity (user_id, session_date, minutes_spent, page)
      VALUES ($1, CURRENT_DATE, $2, $3)`,
      [userId, duration, page]
    );

    res.sendStatus(200);
  } catch (err) {
    console.error("Error inserting tracking data:", err);
    res.sendStatus(500);
  }
});

export default router;