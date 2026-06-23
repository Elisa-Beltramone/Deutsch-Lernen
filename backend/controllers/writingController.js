import {
  createWriting,
  fetchWritings,
  createFeedback,
  analyzeWriting,
} from "../services/writingService.js";

export async function saveWriting(req, res) {
  try {
    const result = await createWriting(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving text" });
  }
}

export async function getWritings(req, res) {
  try {
    const result = await fetchWritings();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching writings" });
  }
}

export async function saveFeedback(req, res) {
  const { feedback, level } = req.body;

  if (!feedback || !level) {
    return res.status(400).json({
      error: "Feedback and level are required",
    });
  }

  try {
    const result = await createFeedback(feedback, level);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error saving feedback",
    });
  }
}

export async function checkWritingLevel(req, res) {
  const { text } = req.body;
  const level = req.params.level.toUpperCase();

  if (!text) {
    return res.status(400).json({
      error: "Text is required",
    });
  }

  try {
    const result = await analyzeWriting(text, level);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error checking German text",
    });
  }
}