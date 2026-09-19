export async function callOpenAiCompatible(messages, env, options = {}) {
  const apiKey = env.OPENAI_API_KEY || env.AI_API_KEY;
  if (!apiKey) {
    throw new Error("AI API 키가 설정되지 않았습니다. (OPENAI_API_KEY 또는 AI_API_KEY 필요)");
  }

  const rawBaseUrl = env.OPENAI_BASE_URL || env.AI_BASE_URL || "https://api.openai.com/v1";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const model = env.OPENAI_MODEL || env.AI_MODEL || "gpt-4o-mini";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 800,
      ...options,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI 서버 응답 오류 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}
