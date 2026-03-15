import fetch from "node-fetch";

export async function generateSentence(word) {

  const prompt = `
Write one short German sentence using the word "${word}". Only return the sentence.
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

  console.log("HF RESPONSE:", data);

  const sentence = data?.choices?.[0]?.message?.content?.trim();

  if (!sentence) {
    throw new Error("AI returned empty sentence");
  }

  return sentence;
}