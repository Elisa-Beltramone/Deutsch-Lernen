import express from "express";
const router = express.Router();

router.post("/track-time", async (req, res) => {
  const { page, duration } = req.body;

  try {
    await pool.query(
      "INSERT INTO tracking (page, duration) VALUES ($1, $2)",
      [page, duration]
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;