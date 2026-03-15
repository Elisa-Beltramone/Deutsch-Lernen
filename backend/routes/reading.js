import express from "express";
import { generateReading } from "../services/readingService.js";

const router = express.Router();

router.get("/:level", async (req, res) => {

  const level = req.params.level.toUpperCase();

  try {

    const result = await generateReading(level);

    res.json(result);

  } catch (err) {

    console.error("Reading route error:", err);

    res.status(500).json({
      error: "Error generating reading exercise"
    });

  }

});

export default router;