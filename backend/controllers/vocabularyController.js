import { generateSentence } from "../services/vocabularyService.js";

export async function getSentence(req, res) {
  const word = req.params.word.toUpperCase();

  try {
    const sentence = await generateSentence(word);

    res.json({
      text: sentence,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Error generating sentence",
    });
  }
}