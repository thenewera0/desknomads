import { chat, chatJSON } from "@/lib/ai/openrouter";

async function main() {
  console.log("--- plain chat() (should fail over Leviathan -> OpenRouter) ---");
  const t0 = Date.now();
  const text = await chat(
    [
      { role: "system", content: "You are terse." },
      { role: "user", content: "Reply with exactly one word: PONG" },
    ],
    { maxTokens: 20, temperature: 0.2 }
  );
  console.log("result:", JSON.stringify(text.slice(0, 80)), "in", Date.now() - t0, "ms");

  console.log("\n--- chatJSON() ---");
  const json = await chatJSON<{ ok: boolean; note: string }>([
    { role: "user", content: 'Return ONLY JSON: {"ok":true,"note":"hello"}' },
  ]);
  console.log("json:", JSON.stringify(json));

  console.log("\nOK — content generation works (via fallback if Leviathan is empty).");
  process.exit(0);
}
main().catch((e) => { console.error("FAILED:", e); process.exit(1); });
