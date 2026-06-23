import fetch from "node-fetch";

const HF_URL = "https://router.huggingface.co/v1/chat/completions";
const MODEL = "Qwen/Qwen2.5-7B-Instruct";

function buildPrompt(level) {
  return `
Create a German reading comprehension exercise for CEFR level ${level}.

Requirements:
- One German text.
- Exactly 3 comprehension questions.
- Each question must have exactly 3 answer options.
- Include the correct answer index (0, 1, or 2).

Return ONLY valid JSON:

{
  "text": "German text here",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C"],
      "answer": 0
    }
  ]
}

Do not include markdown.
Do not include explanations.
Return JSON only.
`;
}

function cleanResponse(content) {
  return content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

function validateExercise(data) {
  if (!data?.text || !Array.isArray(data?.questions)) {
    throw new Error("Invalid exercise structure");
  }

  if (data.questions.length !== 3) {
    throw new Error("Exercise must contain exactly 3 questions");
  }

  for (const question of data.questions) {
    if (
      !question.question ||
      !Array.isArray(question.options) ||
      question.options.length !== 3 ||
      ![0, 1, 2].includes(question.answer)
    ) {
      throw new Error("Invalid question structure");
    }
  }

  return data;
}

export async function generateReading(level) {
  const response = await fetch(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: "You are an experienced German language teacher.",
        },
        {
          role: "user",
          content: buildPrompt(level),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log(process.env.HF_TOKEN);


    console.error("Hugging Face Error:", errorText);

    throw new Error("Failed to generate reading exercise");
  }

  const data = await response.json();
  const aiContent =
    data?.choices?.[0]?.message?.content ?? "";


  if (!aiContent) {
    throw new Error("Empty AI response");
  }

  try {
    const parsed = JSON.parse(cleanResponse(aiContent));

    return validateExercise(parsed);
  } catch (error) {
    console.error("Invalid JSON:", aiContent);

    throw new Error("AI returned invalid JSON");
  }
}