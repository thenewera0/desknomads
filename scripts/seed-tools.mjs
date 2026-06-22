// Seed the `tools` collection with popular AI/productivity tools.
// Run: node --env-file=.env.local scripts/seed-tools.mjs
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const app = getApps()[0] || initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);

const logo = (domain) => `https://logo.clearbit.com/${domain}`;

const tools = [
  { name: "ChatGPT", domain: "openai.com", url: "https://chatgpt.com", category: "AI Assistant", pricing: "freemium", rating: 4.8, isFeatured: true, tags: ["Writing", "Coding", "Research"], description: "OpenAI's conversational AI for writing, coding, analysis, and everyday productivity." },
  { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", category: "AI Assistant", pricing: "freemium", rating: 4.8, isFeatured: true, tags: ["Writing", "Analysis", "Coding"], description: "Anthropic's AI assistant known for long-context reasoning, writing, and safe, helpful answers." },
  { name: "Gemini", domain: "google.com", url: "https://gemini.google.com", category: "AI Assistant", pricing: "freemium", rating: 4.6, isFeatured: true, tags: ["Multimodal", "Search", "Workspace"], description: "Google's multimodal AI integrated with Search and Workspace for real-time, grounded answers." },
  { name: "Perplexity", domain: "perplexity.ai", url: "https://perplexity.ai", category: "AI Search", pricing: "freemium", rating: 4.6, isFeatured: true, tags: ["Search", "Research", "Citations"], description: "An AI answer engine that searches the web and cites its sources for trustworthy research." },
  { name: "Midjourney", domain: "midjourney.com", url: "https://midjourney.com", category: "AI Image", pricing: "paid", rating: 4.7, isFeatured: true, tags: ["Image", "Design", "Art"], description: "State-of-the-art text-to-image generation prized for its cinematic, artistic output." },
  { name: "GitHub Copilot", domain: "github.com", url: "https://github.com/features/copilot", category: "AI Coding", pricing: "paid", rating: 4.5, isFeatured: true, tags: ["Coding", "Autocomplete", "IDE"], description: "AI pair programmer that suggests code and whole functions inside your editor." },
  { name: "Cursor", domain: "cursor.com", url: "https://cursor.com", category: "AI Coding", pricing: "freemium", rating: 4.7, isFeatured: true, tags: ["Coding", "IDE", "Agents"], description: "An AI-first code editor with chat, agents, and codebase-aware edits." },
  { name: "Notion AI", domain: "notion.so", url: "https://notion.so/product/ai", category: "Productivity", pricing: "freemium", rating: 4.5, isFeatured: false, tags: ["Notes", "Docs", "Writing"], description: "AI built into Notion for drafting, summarizing, and organizing your workspace." },
  { name: "Zapier", domain: "zapier.com", url: "https://zapier.com", category: "Automation", pricing: "freemium", rating: 4.5, isFeatured: true, tags: ["Automation", "Integrations", "No-code"], description: "Connect 6,000+ apps and automate workflows without writing code." },
  { name: "Make", domain: "make.com", url: "https://make.com", category: "Automation", pricing: "freemium", rating: 4.4, isFeatured: false, tags: ["Automation", "No-code", "Workflows"], description: "Visual automation platform for building complex, multi-step workflows." },
  { name: "n8n", domain: "n8n.io", url: "https://n8n.io", category: "Automation", pricing: "freemium", rating: 4.6, isFeatured: false, tags: ["Automation", "Open-source", "AI"], description: "Source-available workflow automation with native AI nodes and self-hosting." },
  { name: "ElevenLabs", domain: "elevenlabs.io", url: "https://elevenlabs.io", category: "AI Audio", pricing: "freemium", rating: 4.7, isFeatured: true, tags: ["Voice", "TTS", "Audio"], description: "Ultra-realistic AI voice generation and text-to-speech in many languages." },
  { name: "Runway", domain: "runwayml.com", url: "https://runwayml.com", category: "AI Video", pricing: "freemium", rating: 4.5, isFeatured: false, tags: ["Video", "Generative", "Editing"], description: "Generative AI video tools for creating and editing footage from text and images." },
  { name: "Canva", domain: "canva.com", url: "https://canva.com", category: "Design", pricing: "freemium", rating: 4.7, isFeatured: false, tags: ["Design", "Templates", "AI"], description: "All-in-one design platform with Magic Studio AI for images, copy, and video." },
  { name: "Jasper", domain: "jasper.ai", url: "https://jasper.ai", category: "AI Writing", pricing: "paid", rating: 4.3, isFeatured: false, tags: ["Marketing", "Copywriting", "Brand"], description: "AI writing platform built for marketing teams and on-brand content at scale." },
  { name: "Grammarly", domain: "grammarly.com", url: "https://grammarly.com", category: "AI Writing", pricing: "freemium", rating: 4.6, isFeatured: false, tags: ["Writing", "Editing", "Grammar"], description: "AI writing assistant for grammar, clarity, tone, and generative rewrites." },
];

function slugify(s) { return s.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"); }

let created = 0, skipped = 0;
for (const t of tools) {
  const slug = slugify(t.name);
  const existing = await db.collection("tools").where("slug", "==", slug).limit(1).get();
  if (!existing.empty) { skipped++; continue; }
  await db.collection("tools").add({
    name: t.name, slug, description: t.description, longDescription: "",
    url: t.url, logoUrl: logo(t.domain), screenshotUrl: "",
    category: t.category, pricing: t.pricing, tags: t.tags,
    rating: t.rating, isFeatured: t.isFeatured, isVerified: true,
    submittedBy: "seed", status: "approved", createdAt: FieldValue.serverTimestamp(),
  });
  created++;
}
console.log(`Seeded tools: ${created} created, ${skipped} already existed.`);
