import { adminDb } from "../src/lib/firebase/admin";

const manualSlugs = [
  // seed-manual-articles.mjs
  "the-ultimate-guide-to-running-local-llms-ollama-llamacpp",
  "10-hidden-open-source-ai-tools-that-will-save-you-1000month",
  "how-to-build-your-own-autonomous-ai-agent-with-autogpt",
  "mastering-rag-chat-with-your-documents-locally",
  "top-5-hugging-face-spaces-every-developer-should-bookmark",
  "how-to-fine-tune-llama-3-on-your-own-dataset",
  "vllm-vs-tgi-which-llm-inference-engine-is-best",
  "understanding-quantization-gguf-awq-and-gptq-explained",
  "building-voice-ai-agents-with-pipecat",
  "the-ultimate-developer-workspace-vscode-cline-anthropic",
  
  // seed-manual-articles-2.mjs
  "lm-studio-vs-ollama-which-local-ai-tool-is-better",
  "getting-started-with-comfyui-stable-diffusion-guide",
  "llamaindex-vs-langchain-choosing-the-right-rag-framework",
  "how-to-build-a-multi-agent-ai-system-with-crewai",
  "top-10-open-source-ai-coding-assistants",
  "run-your-own-ai-video-generator-locally-with-fooocus",
  "the-best-open-source-whisper-ui-for-free-audio-transcription",
  "creating-custom-gpts-with-open-source-tools",
  "flowise-langflow-no-code-llm-application-builders",
  "mistral-vs-llama-3-benchmarking-open-weights-models",

  // seed-manual-articles-3.mjs
  "how-to-get-github-copilot-features-for-free-in-vs-code-the-continue.dev-jugad",
  "bypassing-api-costs-how-to-run-free-web-searches-with-autogpt-locally",
  "the-best-free-midjourney-alternatives-in-2024-no-discord-required",
  "how-to-train-an-ai-on-your-company's-data-without-paying-for-chatgpt-enterprise",
  "free-unlimited-audio-transcription-setting-up-whisper-ai-on-a-low-end-pc",
  "how-to-access-claude-3.5-sonnet-for-free-without-anthropic-limits",
  "the-ultimate-jugad-for-ai-video-creating-animations-with-free-tools",
  "running-70b-llms-on-8gb-vram-the-secret-to-quantization-and-gguf",
  "scraping-the-web-with-ai-how-to-extract-data-for-free-no-coding-required",
  "how-to-get-a-free-gpu-for-ai-training-google-colab-kaggle-hacks"
];

async function main() {
  console.log("Checking Firestore for manual articles...");
  const snap = await adminDb.collection("articles").get();
  
  let checked = 0;
  let shortCount = 0;
  let expandedCount = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    if (manualSlugs.includes(data.slug)) {
      checked++;
      const content = data.content || "";
      const actualWords = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
      
      console.log(`- Slug: ${data.slug}`);
      console.log(`  Actual Words: ${actualWords} | DB wordCount field: ${data.wordCount}`);
      if (actualWords < 500) {
        shortCount++;
      } else {
        expandedCount++;
      }
    }
  }

  console.log(`\nSummary: Checked ${checked}/30. Short (need expansion): ${shortCount}, Already expanded: ${expandedCount}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
