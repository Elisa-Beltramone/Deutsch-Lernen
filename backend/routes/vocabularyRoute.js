import express from "express";
import { generateSentence } from "../services/vocabularyService.js";

const router = express.Router();

router.get("/:word", async (req, res) => {

  const word = req.params.word.toUpperCase();

  if (!word) return res.status(400).json({ error: "Word is required" });

  try {

    const sentence = await generateSentence(word);

    res.json({ text: sentence });

  } catch (err) {

    console.error("Vocabulary route error:", err);

    res.status(500).json({
      error: "Error generating sentence"
    });

  }

});

export default router;