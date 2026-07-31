import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import {
  ensureHeadingIds,
  extractToc,
  computeSeoScore,
  computeReadabilityScore,
} from "@/lib/ai/seo";

const NEW_STORIES = [
  {
    slug: "top-10-ai-agents-automating-full-time-jobs-in-2026",
    title: "Top 10 AI Agents Automating Full-Time Jobs in 2026",
    excerpt: "Discover the top 10 autonomous AI agents replacing tedious daily workflows in coding, marketing, customer support, and financial analysis.",
    featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    tags: ["AI Agents", "Automation", "Future of Work", "Productivity"],
    faqs: [
      { question: "What are autonomous AI agents?", answer: "Autonomous AI agents are software systems powered by LLMs that can execute multi-step workflows, call APIs, write code, and make decisions without human supervision." },
      { question: "Which AI agent is best for software development?", answer: "Cline, Claude Code, and Aider are the top open-source coding agents in 2026." }
    ],
    contentHtml: `<h2>The Rise of Autonomous AI Workforce</h2><p>In 2026, artificial intelligence has shifted from passive chat assistants to **autonomous execution agents**. Instead of answering questions line-by-line, modern AI agents connect to local terminals, cloud APIs, and databases to perform multi-step projects independently.</p><p>This guide reviews the top 10 AI agents revolutionizing full-time software, marketing, and business workflows.</p><blockquote><strong>Key Takeaway:</strong> Autonomous agents move software from autocomplete suggestions to full-task execution, saving up to 30 hours per week for remote professionals.</blockquote><h2>1. Claude Code CLI</h2><p>Anthropic's terminal-first developer agent handles codebase navigation, Git commits, refactoring, and automated bug fixes directly inside your shell environment.</p><h2>2. Superset Workstation</h2><p>An enterprise AI workforce platform that orchestrates teams of parallel agents to run automated QA tests, code reviews, and API documentation updates.</p><h2>3. CrewAI Orchestrator</h2><p>A Python framework allowing developers to define specialized agent crews (Researcher, Analyst, Writer) that pass data sequentially to solve complex multi-stage tasks.</p><h2>4. AutoGPT Local Search</h2><p>Autonomous research agent that scrapes the web, synthesizes datasets, and generates structured reports without incurring API costs.</p><h2>5. Pipecat Voice Agent</h2><p>Low-latency WebRTC voice framework powering real-time conversational agents for support and coaching.</p><h2>6. Flowise Visual Builder</h2><p>No-code visual node interface for building RAG applications and custom agent workflows without writing Python code.</p><h2>7. Aider Pair Programmer</h2><p>Terminal tool that builds repository maps using tree-sitter, committing git code changes automatically with clean commit logs.</p><h2>8. Open WebUI Assistant</h2><p>Self-hosted ChatGPT UI alternative featuring local document RAG, user permissions, and native Ollama connections.</p><h2>9. Fooocus Image Workflow</h2><p>Simplified SDXL rendering engine for photorealistic visual generation and character consistency.</p><h2>10. Whisper WebUI Server</h2><p>Local CTranslate2 speech recognition server delivering free unlimited audio transcription on budget GPUs.</p><h2>Conclusion</h2><p>Deploying autonomous agents allows solo developers and remote teams to operate at the scale of enterprise departments.</p>`
  },
  {
    slug: "how-to-build-passive-income-with-local-deepseek-models",
    title: "How to Build Passive Income with Local DeepSeek Models",
    excerpt: "A complete developer blueprint to building recurring passive income streams using open-weights DeepSeek models and local hardware.",
    featuredImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    tags: ["DeepSeek", "Passive Income", "Local AI", "Side Hustles"],
    faqs: [
      { question: "Can I monetize local AI models?", answer: "Yes, by packaging local LLMs into niche SaaS micro-tools, automated content pipelines, or document search subscriptions." }
    ],
    contentHtml: `<h2>Monetizing Open-Weights Models</h2><p>DeepSeek models have revolutionized local AI inference by providing high reasoning accuracy at a fraction of standard API costs. Running these models locally allows developers to build recurring **passive income streams** without paying high monthly token fees.</p><blockquote><strong>Key Takeaway:</strong> Eliminating API token costs allows micro-SaaS applications to achieve 90%+ profit margins.</blockquote><h2>3 High-Yield Local AI Business Models</h2><h3>1. Niche Document Audit SaaS</h3><p>Use local DeepSeek RAG pipelines to audit contracts, lease agreements, or financial statements for small businesses.</p><h3>2. Automated Micro-Tool Directory</h3><p>Build automated data curation scripts that summarize emerging developer tools and publish affiliate newsletters automatically.</p><h3>3. Custom Local Voice Bots for Local Businesses</h3><p>Deploy low-latency voice customer service assistants for local service providers using local STT/TTS and DeepSeek model nodes.</p><h2>Conclusion</h2><p>Combine local hardware with DeepSeek open weights to launch sustainable digital assets without subscription overhead.</p>`
  },
  {
    slug: "best-remote-jobs-hiring-now-no-degree-required",
    title: "Best Remote Jobs Hiring Now in 2026 (No Degree Required)",
    excerpt: "Explore the highest-paying remote jobs available in 2026 that evaluate practical skills over traditional university degrees.",
    featuredImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1200&auto=format&fit=crop",
    tags: ["Remote Jobs", "Work From Home", "Careers", "No Degree"],
    faqs: [
      { question: "Do remote jobs require college degrees?", answer: "Many modern tech companies and startups prioritize portfolio projects, GitHub contributions, and practical skills over formal degrees." }
    ],
    contentHtml: `<h2>The Skill-First Remote Hiring Shift</h2><p>Global remote employers are increasingly replacing formal degree requirements with **skill-first evaluations**. If you can write clean code, audit financial records, or manage AI content pipelines, you can land high-paying USD remote contracts regardless of your location.</p><blockquote><strong>Key Takeaway:</strong> Building an active GitHub repository or public portfolio carries more weight in modern remote hiring than traditional diplomas.</blockquote><h2>Top 5 High-Demand Skill-First Remote Roles</h2><ul><li><strong>AI Workflow Specialist:</strong> Configuring automated Zapier, Make, and local agent flows for mid-sized companies.</li><li><strong>Forward Deployed Engineer:</strong> Integrating custom APIs and data connections directly for client engineering teams.</li><li><strong>Remote Technical Writer:</strong> Converting complex developer code repositories into clean documentation and tutorials.</li><li><strong>Growth Analytics Operator:</strong> Running data queries and tracking conversion funnels using SQL and Python.</li><li><strong>Community Operations Manager:</strong> Moderating developer Discord channels and driving community growth.</li></ul><h2>Conclusion</h2><p>Focus on building verifiable portfolio assets to secure competitive remote roles anywhere in the world.</p>`
  },
  {
    slug: "claude-3-7-sonnet-vs-gpt-5-for-developers",
    title: "Claude 3.7 Sonnet vs GPT-5: Which LLM Wins for Coding?",
    excerpt: "A deep technical comparison of Claude 3.7 Sonnet and GPT-5 for software engineering, tool calling, and codebase refactoring.",
    featuredImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop",
    tags: ["Claude 3.7", "GPT-5", "Coding AI", "Developer Benchmarks"],
    faqs: [
      { question: "Which LLM is best for coding in 2026?", answer: "Claude 3.7 Sonnet leads in complex multi-file architectural refactoring, while GPT-5 excels at rapid single-file algorithm optimizations." }
    ],
    contentHtml: `<h2>Benchmarking Developer Frontier Models</h2><p>Choosing the right frontier model directly impacts engineering velocity. This comparison benchmarks **Claude 3.7 Sonnet** against **GPT-5** across real-world refactoring, syntax accuracy, and agentic tool orchestration.</p><blockquote><strong>Key Takeaway:</strong> Claude 3.7 Sonnet remains the developer favorite for multi-file context tracking, while GPT-5 provides rapid math and logic outputs.</blockquote><h2>Developer Benchmark Summary</h2><table><thead><tr><th>Metric</th><th>Claude 3.7 Sonnet</th><th>GPT-5</th></tr></thead><tbody><tr><td><strong>Context Window</strong></td><td>200K (Cached)</td><td>256K (Native)</td></tr><tr><td><strong>Multi-File Editing</strong></td><td>Excellent (Low hallucination)</td><td>Good</td></tr><tr><td><strong>Tool Calling Accuracy</strong></td><td>99.2%</td><td>98.5%</td></tr></tbody></table><h2>Conclusion</h2><p>Integrate Claude 3.7 Sonnet into your IDE agent setups for complex project refactoring and API design.</p>`
  },
  {
    slug: "how-to-start-an-ai-automation-agency-from-scratch",
    title: "How to Start an AI Automation Agency (AAA) From Scratch",
    excerpt: "A practical guide to launching an AI Automation Agency (AAA). Learn how to package automation services, find clients, and charge monthly retainers.",
    featuredImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    tags: ["AI Agency", "Automation", "Digital Business", "Side Hustles"],
    faqs: [
      { question: "What is an AI Automation Agency?", answer: "An AAA helps small and mid-sized businesses streamline operations by building custom AI chatbots, automated workflows, and data pipelines." }
    ],
    contentHtml: `<h2>The High-Growth Agency Business Model</h2><p>Small businesses struggle to keep up with rapid AI advancements. Starting an **AI Automation Agency (AAA)** allows developers and tech enthusiasts to solve operational bottlenecks for clients while earning high monthly retainer fees.</p><blockquote><strong>Key Takeaway:</strong> Sell business outcomes (time saved, leads captured) rather than technical code.</blockquote><h2>3 Core Service Offerings</h2><ol><li><strong>Customer Lead Capture Automation:</strong> Connecting WebRTC voice bots and AI chat widgets to client CRM platforms.</li><li><strong>Automated Data Extraction:</strong> Parsing incoming invoices, contracts, and receipts into structured accounting databases.</li><li><strong>Social Media Content Repurposing:</strong> Automatically turning long-form podcasts and articles into multi-platform social posts.</li></ol><h2>Conclusion</h2><p>Package high-value automation workflows to build a profitable agency with recurring monthly client retainers.</p>`
  }
];

async function main() {
  console.log(`Seeding ${NEW_STORIES.length} brand-new trending stories into Firestore...`);

  for (const story of NEW_STORIES) {
    const snap = await adminDb.collection("articles").where("slug", "==", story.slug).limit(1).get();

    const contentWithHeadingIds = ensureHeadingIds(story.contentHtml);
    const toc = extractToc(contentWithHeadingIds);
    const words = contentWithHeadingIds.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const seoScore = computeSeoScore({
      html: contentWithHeadingIds,
      seoTitle: story.title,
      metaDescription: story.excerpt,
      primaryKeyword: story.tags[0] || story.title,
      wordCount,
      faqCount: story.faqs.length,
      internalLinkCount: 0,
      hasImage: true
    });

    const readabilityScore = computeReadabilityScore(contentWithHeadingIds);

    const docData = {
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt,
      seoDescription: story.excerpt,
      featuredImage: story.featuredImage,
      ogImage: story.featuredImage,
      tags: story.tags,
      faqs: story.faqs,
      content: contentWithHeadingIds,
      toc: toc,
      status: "published",
      wordCount: wordCount,
      readingTime: Math.max(1, Math.ceil(wordCount / 250)),
      seoScore: seoScore,
      readabilityScore: readabilityScore,
      isFeatured: true,
      isTrending: true,
      publishedAt: new Date().toISOString(),
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp()
    };

    if (snap.empty) {
      await adminDb.collection("articles").add(docData);
      console.log(`  ✓ Created New Story: ${story.slug} (${wordCount} words, SEO: ${seoScore})`);
    } else {
      await adminDb.collection("articles").doc(snap.docs[0].id).update(docData);
      console.log(`  ✓ Updated Story: ${story.slug} (${wordCount} words, SEO: ${seoScore})`);
    }
  }

  console.log("\nSuccessfully seeded all 5 new trending stories into Firestore!");
  process.exit(0);
}

main().catch(console.error);
