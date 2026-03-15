import fetch from "node-fetch";

export async function generateReading(level) {

  const prompt = `
Create a German reading comprehension exercise for level ${level} CEFR.

- Exactly 3 questions.
- Each question has exactly 3 options.
- Include the correct answer index (0,1,2).

Return ONLY valid JSON in this format:

{
  "text": "German text here",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A","Option B","Option C"],
      "answer": 0
    },
    {
      "question": "Question text",
      "options": ["Option A","Option B","Option C"],
      "answer": 1
    },
    {
      "question": "Question text",
      "options": ["Option A","Option B","Option C"],
      "answer": 2
    }
  ]
}

Do not include any explanation outside the JSON.
`;

  const hfResponse = await fetch(
    "https://router.huggingface.co/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
          { role: "system", content: "You are a German teacher." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5
      })
    }
  );

  if (!hfResponse.ok) {
    const errorText = await hfResponse.text();
    console.error("HF error:", errorText);
    throw new Error("Reading AI error");
  }

  const data = await hfResponse.json();

  let aiContent = data?.choices?.[0]?.message?.content || "";

  aiContent = aiContent
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(aiContent);
  } catch {
    throw new Error("Invalid AI JSON response");
  }
}