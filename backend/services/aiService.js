import fetch from "node-fetch";

// -------------------- FIRST CALL --------------------
export async function checkWriting(text, level) {
  console.log("📡 Calling Hugging Face for correction...");

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
          {
            role: "system",
            content: `
You are an experienced German teacher and official Goethe ${level} examiner.

Return ONLY valid JSON:

{
 "correctedText": "...",
 "grade": number,
 "generalExplanation": "..."
}

Rules:
1. "correctedText" must contain the fully corrected version.
2. "grade" is based on accuracy, grammar, vocabulary, and length.
3. "generalExplanation" gives a short feedback about mistakes.
4. Return ONLY JSON.
`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.2
      })
    }
  );

  if (!hfResponse.ok) {
    const errorText = await hfResponse.text();
    console.error("HF error:", errorText);
    throw new Error("HuggingFace error");
  }

  const hfData = await hfResponse.json();
  const aiContent = hfData?.choices?.[0]?.message?.content || "{}";

  try {
    const parsed = JSON.parse(aiContent);
    return {
      correctedText: parsed.correctedText || text,
      explanation: parsed.generalExplanation || "No explanation.",
      grade: Number(parsed.grade) || 10
    };
  } catch (err) {
    console.warn("⚠️ AI returned non-JSON:", aiContent);
    return { correctedText: text, explanation: "AI response could not be parsed.", grade: 10 };
  }
}

// -------------------- SECOND CALL --------------------
export async function compareWriting(originalText, correctedText, level) {
  // Escape newlines and quotes to safely embed in system prompt
  const escapeForPrompt = str => str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");

  const hfResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [
        {
          role: "system",
          content: `
You are a German teacher. Compare the two texts and find mistakes.

Original Text:
"${escapeForPrompt(originalText)}"

Corrected Text:
"${escapeForPrompt(correctedText)}"

Return a JSON object like this:

{
  "mistakes": [
    {
      "wrong": "text that is wrong in original",
      "correct": "correct version",
      "explanation": "short explanation"
    }
  ],
  "grade": number,
  "generalExplanation": "short summary of mistakes"
}

Rules:
1. Grade is based on accuracy, grammar, vocabulary, and length.
2. If the text is perfect, return grade 100 and empty mistakes array.
3. Return only valid JSON.
`
        }
      ],
      temperature: 0.2
    })
  });

  if (!hfResponse.ok) {
    const errorText = await hfResponse.text();
    console.error("HF error:", errorText);
    return { mistakes: [], grade: 10, generalExplanation: "AI error." };
  }

  const hfData = await hfResponse.json();
  const aiContent = hfData?.choices?.[0]?.message?.content || "{}";

  try {
    const parsed = JSON.parse(aiContent);
    return {
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
      grade: Number(parsed.grade) || 10,
      generalExplanation: parsed.generalExplanation || "No explanation."
    };
  } catch (err) {
    console.warn("⚠️ AI returned non-JSON:", aiContent);
    return { mistakes: [], grade: 10, generalExplanation: "AI response could not be parsed." };
  }
}