import db from "../db/db.js";
import { checkWriting, compareWriting } from "./aiService.js";

export async function createWriting({
  originalContent,
  content,
  level,
}) {
  const result = await db.query(
    `
    INSERT INTO writings
    (original_content, content, level)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [originalContent, content, level]
  );

  return result.rows[0];
}

export async function fetchWritings() {
  const result = await db.query(
    `
    SELECT content, level, created_at
    FROM writings
    ORDER BY created_at DESC
    `
  );

  return result.rows;
}

export async function createFeedback(feedback, level) {
  const result = await db.query(
    `
    INSERT INTO writings (content)
    VALUES ($1)
    RETURNING *
    `,
    [`${level}: ${feedback}`]
  );

  return result.rows[0];
}

export async function analyzeWriting(text, level) {
  const wordCount = text.trim().split(/\s+/).length;

  const correction = await checkWriting(text, level);

  const correctedText = correction.correctedText;
  let grade = correction.grade;
  let explanation = correction.explanation;

  const comparison = await compareWriting(
    text,
    correctedText,
    level
  );

  const mistakes = Array.isArray(comparison.mistakes)
    ? comparison.mistakes
    : [];

  const typicalLength = {
    A1: 30,
    A2: 60,
    B1: 100,
    B2: 150,
  };

  const minWords = typicalLength[level] || 30;

  if (wordCount < minWords) {
    grade = Math.min(grade, 50);
    explanation += ` Text zu kurz (${wordCount} Wörter).`;
  }

  return {
    correctedText,
    explanation:
      comparison.generalExplanation || explanation,
    grade: comparison.grade || grade,
    mistakes,
  };
}