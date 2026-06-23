import fetch from "node-fetch";

const HF_URL = "https://router.huggingface.co/v1/chat/completions";
const MODEL = "Qwen/Qwen2.5-7B-Instruct";

export async function callAI(messages, temperature = 0.2) {
  const response = await fetch(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();

  return data?.choices?.[0]?.message?.content ?? "";
}