import { chatJSON } from "@/lib/ai/openrouter";

async function main() {
  console.log("Testing chatJSON...");
  const res = await chatJSON<{ test: string }>([
    { role: "user", content: 'Return ONLY JSON: {"test": "working"}' }
  ]);
  console.log("SUCCESS:", res);
  process.exit(0);
}

main().catch(e => {
  console.error("TEST FAILED:", e);
  process.exit(1);
});
