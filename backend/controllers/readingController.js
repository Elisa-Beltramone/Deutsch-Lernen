import { generateReading } from "../services/readingService.js";

export async function getReadingExercise(req, res) {
  const level = req.params.level.toUpperCase();

  try {
    const result = await generateReading(level);
    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Error generating reading exercise",
    });
  }
}