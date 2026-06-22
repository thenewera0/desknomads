// Engine connectivity probe — OpenRouter (models + chat) and Tavily.
// Run: node --env-file=.env.local scripts/test-engine.mjs
const OR = process.env.OPENROUTER_API_KEY;
const TV = process.env.TAVILY_API_KEY;
const textModel = process.env.OPENROUTER_TEXT_MODEL || "google/gemini-3-flash-preview";
const imageModel = process.env.OPENROUTER_IMAGE_MODEL || "google/gemini-3.1-flash-image";

const orHeaders = { Authorization: `Bearer ${OR}`, "Content-Type": "application/json" };

async function checkModels() {
  const res = await fetch("https://openrouter.ai/api/v1/models", { headers: orHeaders });
  if (!res.ok) return console.error(`❌ OpenRouter /models failed: ${res.status} ${await res.text().catch(() => "")}`.slice(0, 300));
  const ids = new Set((await res.json()).data.map((m) => m.id));
  console.log(`OpenRouter reachable — ${ids.size} models available.`);
  console.log(`  text model  "${textModel}": ${ids.has(textModel) ? "✅ exists" : "❌ NOT FOUND"}`);
  console.log(`  image model "${imageModel}": ${ids.has(imageModel) ? "✅ exists" : "❌ NOT FOUND"}`);
  if (!ids.has(textModel)) {
    const sugg = [...ids].filter((i) => /gemini.*flash/i.test(i)).slice(0, 6);
    console.log(`  ↳ gemini-flash options: ${sugg.join(", ") || "(none)"}`);
  }
  if (!ids.has(imageModel)) {
    const sugg = [...ids].filter((i) => /image/i.test(i)).slice(0, 8);
    console.log(`  ↳ image-capable options: ${sugg.join(", ") || "(none)"}`);
  }
}

async function checkChat() {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: orHeaders,
    body: JSON.stringify({ model: textModel, messages: [{ role: "user", content: "Reply with exactly: OK" }], max_tokens: 10 }),
  });
  if (!res.ok) return console.error(`❌ Chat failed (${res.status}): ${(await res.text().catch(() => "")).slice(0, 300)}`);
  const data = await res.json();
  console.log(`✅ Chat OK — model replied: ${JSON.stringify(data.choices?.[0]?.message?.content)}`);
}

async function checkTavily() {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: TV, query: "latest AI tools 2026", max_results: 2, include_answer: true }),
  });
  if (!res.ok) return console.error(`❌ Tavily failed (${res.status}): ${(await res.text().catch(() => "")).slice(0, 300)}`);
  const data = await res.json();
  console.log(`✅ Tavily OK — ${data.results?.length || 0} results. Sample: ${data.results?.[0]?.title || "(none)"}`);
}

console.log("Cron secret set:", !!process.env.CRON_SECRET);
await checkModels();
await checkChat();
await checkTavily();
