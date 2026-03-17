import express from "express";
import { checkWriting, compareWriting } from "../services/aiService.js";
import pool from "../db/db.js";

const router = express.Router();

router.post("/:level", async (req, res) => {
  const { text } = req.body;
  const level = req.params.level.toUpperCase(); // A1, A2, B1, B2

  if (!text || !level) return res.status(400).json({ error: "Text and level required." });

  const wordCount = text.trim().split(/\s+/).length;

  try {
    // --- First: get corrected text ---
    const correction = await checkWriting(text, level);
    const correctedText = correction.correctedText;
    let grade = correction.grade;
    let explanation = correction.explanation;

    // --- Second: get detailed mistakes ---
    const comparison = await compareWriting(text, correctedText, level);
    const mistakes = Array.isArray(comparison.mistakes) ? comparison.mistakes : [];

    // --- Adjust grade if too short ---
    const typicalLength = { A1: 30, A2: 60, B1: 100, B2: 150 };
    const minWords = typicalLength[level] || 30;

    if (wordCount < minWords) {
      grade = Math.min(grade, 50);
      explanation += ` Text zu kurz (${wordCount} Wörter).`;
    }

    // --- Return everything needed to front-end ---
    res.json({
      correctedText,
      explanation: comparison.generalExplanation || explanation,
      grade: comparison.grade || grade,
      mistakes
    });

  } catch (err) {
    console.error("Route error:", err);
    res.status(500).json({ error: "Server error checking German text." });
  }
});

router.post("/save-feedback", async (req, res) => {
  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).send("No feedback provided");
  }

  try {
    const result = await pool.query(
      "INSERT INTO writings (content) VALUES ($1) RETURNING *",
      [feedback]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving feedback");
  }
});


export default router;