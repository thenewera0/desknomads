import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Initialize Firebase
const app = getApps()[0] || initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);

// Helper to generate a slug
function slugify(s) {
  return s.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

const manualArticles = [
  {
    title: "LM Studio vs Ollama: Which Local AI Tool is Better?",
    excerpt: "Both LM Studio and Ollama let you run open-source models on your own machine. We compare their features, performance, and best use cases.",
    content: `<h2>The Rise of Local AI</h2><p>Running models locally is now accessible to everyone. Ollama and LM Studio are the two most popular tools for this, but they serve different needs.</p><h2>Ollama: The CLI Champion</h2><p>Ollama is built for the terminal. It's incredibly fast, scriptable, and acts as a background service. It's perfect for developers who want to integrate AI into their workflows or build apps.</p><h2>LM Studio: The GUI Powerhouse</h2><p>LM Studio provides a beautiful interface. It lets you search the Hugging Face Hub, download specific quantizations, and inspect exactly what's happening. It's best for experimentation.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    seoTitle: "LM Studio vs Ollama: Best Local AI Tools Compared",
    seoDescription: "An in-depth comparison of LM Studio and Ollama. Learn which tool is best for running local LLMs like Llama 3 on your Mac or PC.",
    tags: ["Local AI", "Ollama", "LM Studio", "Comparison"],
    faqs: [
      { question: "Can I run both Ollama and LM Studio at the same time?", answer: "Yes, but they will both compete for your system's RAM and GPU VRAM, which might cause out-of-memory errors." }
    ],
    toc: [
      { id: "rise-local-ai", text: "The Rise of Local AI", level: 2 },
      { id: "ollama", text: "Ollama: The CLI Champion", level: 2 },
      { id: "lm-studio", text: "LM Studio: The GUI Powerhouse", level: 2 }
    ]
  },
  {
    title: "Getting Started with ComfyUI: Stable Diffusion Guide",
    excerpt: "Learn how to use ComfyUI, the powerful node-based interface for Stable Diffusion. Create custom workflows for image generation.",
    content: `<h2>What is ComfyUI?</h2><p>ComfyUI is an advanced, node-based graphical user interface for Stable Diffusion. Unlike AUTOMATIC1111, it gives you granular control over the entire generation pipeline.</p><h2>Understanding Nodes and Workflows</h2><p>In ComfyUI, you connect nodes with cables. A basic workflow consists of a Checkpoint Loader, text prompts (positive and negative), a KSampler, and a VAE Decode node.</p><h2>Why Choose ComfyUI?</h2><p>It's lighter on VRAM, faster, and allows you to build incredibly complex pipelines involving ControlNet, IPAdapter, and upscaling without losing track of your process.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    seoTitle: "ComfyUI Tutorial: Ultimate Guide to Node-Based Stable Diffusion",
    seoDescription: "Step-by-step beginner tutorial for ComfyUI. Learn how to build node-based workflows for advanced Stable Diffusion image generation.",
    tags: ["ComfyUI", "Stable Diffusion", "Generative AI"],
    faqs: [
      { question: "Is ComfyUI better than AUTOMATIC1111?", answer: "ComfyUI offers more flexibility and better memory management, but AUTOMATIC1111 is easier for beginners who just want to generate images quickly." }
    ],
    toc: [
      { id: "what-is-comfyui", text: "What is ComfyUI?", level: 2 },
      { id: "nodes-workflows", text: "Understanding Nodes and Workflows", level: 2 },
      { id: "why-choose", text: "Why Choose ComfyUI?", level: 2 }
    ]
  },
  {
    title: "LlamaIndex vs LangChain: Choosing the Right RAG Framework",
    excerpt: "Are you building a Retrieval-Augmented Generation (RAG) app? Here is how to choose between LlamaIndex and LangChain.",
    content: `<h2>The RAG Landscape</h2><p>To build a RAG application, you need to load data, chunk it, embed it, and retrieve it. Both LangChain and LlamaIndex do this, but with different philosophies.</p><h2>LangChain: The General Purpose Tool</h2><p>LangChain is highly composable. It's built around chains and agents, making it great for applications where the LLM needs to make decisions or use multiple tools.</p><h2>LlamaIndex: The Data Specialist</h2><p>LlamaIndex is purpose-built for data ingestion and retrieval. It offers advanced indexing strategies (like hierarchical tree nodes and knowledge graphs) that make retrieval much more accurate.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop",
    seoTitle: "LlamaIndex vs LangChain: Which RAG Framework is Best?",
    seoDescription: "Compare LlamaIndex and LangChain for building Retrieval-Augmented Generation (RAG) apps. Find the right framework for your LLM project.",
    tags: ["RAG", "LangChain", "LlamaIndex", "Frameworks"],
    faqs: [
      { question: "Can I use LlamaIndex and LangChain together?", answer: "Yes, LlamaIndex can be used as a retrieval tool within a larger LangChain agent." }
    ],
    toc: [
      { id: "rag-landscape", text: "The RAG Landscape", level: 2 },
      { id: "langchain", text: "LangChain: General Purpose", level: 2 },
      { id: "llamaindex", text: "LlamaIndex: Data Specialist", level: 2 }
    ]
  },
  {
    title: "How to Build a Multi-Agent AI System with CrewAI",
    excerpt: "Learn how to use CrewAI to orchestrate autonomous AI agents that collaborate to solve complex tasks, research, and write code.",
    content: `<h2>The Power of Multi-Agent Systems</h2><p>Instead of relying on one massive prompt, multi-agent systems break tasks down. You define 'Agents' with specific roles, give them 'Tasks', and group them into a 'Crew'.</p><h2>Setting up CrewAI</h2><p>CrewAI is a lightweight Python framework built on top of Langchain. It's incredibly easy to set up. Define a Researcher agent and a Writer agent, and let them collaborate.</p><h2>Tools and Delegation</h2><p>Agents in CrewAI can use tools (like web search or calculators) and can delegate tasks to each other, creating a robust, self-correcting workflow.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    seoTitle: "Build Multi-Agent AI Systems with CrewAI (Tutorial)",
    seoDescription: "A complete guide to using CrewAI for building autonomous, collaborative AI agents that can research, write, and code.",
    tags: ["CrewAI", "Agents", "Automation", "Python"],
    faqs: [
      { question: "Is CrewAI better than AutoGPT?", answer: "CrewAI is much more reliable for specific, complex workflows because roles and tasks are rigidly defined, unlike AutoGPT's open-ended loop." }
    ],
    toc: [
      { id: "multi-agent", text: "The Power of Multi-Agent Systems", level: 2 },
      { id: "setup", text: "Setting up CrewAI", level: 2 },
      { id: "tools-delegation", text: "Tools and Delegation", level: 2 }
    ]
  },
  {
    title: "Top 10 Open Source AI Coding Assistants",
    excerpt: "Ditch GitHub Copilot. Here are the 10 best open-source and local AI coding assistants for VS Code, JetBrains, and Neovim.",
    content: `<h2>The Open Source Advantage</h2><p>Open source coding assistants allow you to use your own API keys (saving money) or run models entirely locally (ensuring absolute privacy for your proprietary code).</p><h2>Continue.dev</h2><p>Continue is a brilliant extension that lets you use models like Claude 3.5 Sonnet or local Llama 3 models right inside VS Code and JetBrains.</p><h2>Cline (Formerly Claude Dev)</h2><p>Cline goes a step further by acting as an autonomous agent. It can read your terminal, create files, and debug entire codebases independently.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop",
    seoTitle: "Best Open Source AI Coding Assistants (Copilot Alternatives)",
    seoDescription: "Discover the best free and open-source AI coding assistants like Continue.dev and Cline to replace GitHub Copilot.",
    tags: ["Coding", "VS Code", "Open Source", "Copilot"],
    faqs: [
      { question: "Can these tools see my codebase?", answer: "If you use local models via Ollama, your code never leaves your machine. If you use Anthropic or OpenAI API keys, the data is sent to them but typically not used for training." }
    ],
    toc: [
      { id: "advantage", text: "The Open Source Advantage", level: 2 },
      { id: "continue-dev", text: "Continue.dev", level: 2 },
      { id: "cline", text: "Cline", level: 2 }
    ]
  },
  {
    title: "Run Your Own AI Video Generator Locally with Fooocus",
    excerpt: "Tired of paying for Midjourney or runway? Learn how to generate stunning images and simple animations locally with Fooocus.",
    content: `<h2>What is Fooocus?</h2><p>Fooocus is an image generating software based on Gradio. It rethinks the Stable Diffusion interface, taking inspiration from Midjourney's simplicity.</p><h2>Why It's Great for Beginners</h2><p>Unlike AUTOMATIC1111 or ComfyUI, Fooocus hides the complex parameters. It focuses entirely on prompting, utilizing advanced internal algorithms to ensure the output looks incredible by default.</p><h2>Adding AnimateDiff</h2><p>While Fooocus is primarily for images, the community is rapidly integrating tools like AnimateDiff to allow for short, consistent video generation right on your local GPU.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    seoTitle: "Fooocus Tutorial: Generate AI Art and Video Locally",
    seoDescription: "Learn how to use Fooocus, the easiest open-source alternative to Midjourney for generating high-quality AI art on your local GPU.",
    tags: ["Fooocus", "Generative AI", "Video"],
    faqs: [
      { question: "How much VRAM does Fooocus need?", answer: "Fooocus is highly optimized and can run on GPUs with as little as 4GB of VRAM, though 8GB is recommended." }
    ],
    toc: [
      { id: "what-is-fooocus", text: "What is Fooocus?", level: 2 },
      { id: "beginners", text: "Why It's Great for Beginners", level: 2 },
      { id: "animatediff", text: "Adding AnimateDiff", level: 2 }
    ]
  },
  {
    title: "The Best Open-Source Whisper UI for Free Audio Transcription",
    excerpt: "OpenAI's Whisper model is free and open-source. Here is how to install a local UI to transcribe podcasts, meetings, and videos with 99% accuracy.",
    content: `<h2>The Transcription Revolution</h2><p>Whisper is the most accurate speech-to-text model available. Instead of paying for Otter.ai or Rev, you can run Whisper entirely for free.</p><h2>Whisper WebUI</h2><p>The Whisper WebUI provides a simple browser interface. You upload an MP3 or MP4, select your model size, and it outputs a highly accurate SRT or VTT file.</p><h2>Real-Time Transcription</h2><p>Newer forks of Whisper, like WhisperX, include word-level timestamps and speaker diarization (identifying who is talking), making it perfect for professional podcast editing.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1200&auto=format&fit=crop",
    seoTitle: "Best Open Source Whisper UI: Free Audio Transcription",
    seoDescription: "Stop paying for transcription. Learn how to install and use the open-source Whisper WebUI to transcribe audio and video locally.",
    tags: ["Whisper", "Audio", "Transcription", "OpenAI"],
    faqs: [
      { question: "Does Whisper work in other languages?", answer: "Yes, the large Whisper models support translation and transcription for over 90 languages with incredible accuracy." }
    ],
    toc: [
      { id: "revolution", text: "The Transcription Revolution", level: 2 },
      { id: "whisper-webui", text: "Whisper WebUI", level: 2 },
      { id: "real-time", text: "Real-Time Transcription", level: 2 }
    ]
  },
  {
    title: "Creating Custom GPTs with Open Source Tools",
    excerpt: "Don't pay for ChatGPT Plus just to build Custom GPTs. Learn how to use AnythingLLM and Open-WebUI to build private AI assistants.",
    content: `<h2>The Problem with Custom GPTs</h2><p>OpenAI's Custom GPTs are great, but you don't own the data, and it costs $20/month. Open source alternatives provide the same functionality for free.</p><h2>AnythingLLM Workspaces</h2><p>AnythingLLM lets you create 'Workspaces'. Each workspace can have its own system prompt, its own set of PDF documents (RAG), and its own local model. It is the perfect Custom GPT replacement.</p><h2>Open-WebUI</h2><p>Open-WebUI (formerly Ollama WebUI) provides a ChatGPT-like interface where you can easily create and share custom agent personas that connect to your local Ollama models.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    seoTitle: "Create Custom GPTs for Free: Open Source Alternatives",
    seoDescription: "Learn how to build private, free Custom GPTs using open source tools like AnythingLLM and Open-WebUI with local models.",
    tags: ["Custom GPT", "AnythingLLM", "Open-WebUI"],
    faqs: [
      { question: "Can I share my open-source Custom GPT with others?", answer: "Yes, tools like Open-WebUI support multi-user logins, allowing you to host the application and let your team access your custom agents." }
    ],
    toc: [
      { id: "problem", text: "The Problem with Custom GPTs", level: 2 },
      { id: "anythingllm", text: "AnythingLLM Workspaces", level: 2 },
      { id: "open-webui", text: "Open-WebUI", level: 2 }
    ]
  },
  {
    title: "Flowise & Langflow: No-Code LLM Application Builders",
    excerpt: "Build complex AI workflows, chatbots, and RAG systems without writing a single line of code using visual builders like Flowise and Langflow.",
    content: `<h2>Visual Programming for AI</h2><p>LangChain is powerful, but writing the code can be tedious. Flowise and Langflow solve this by providing a drag-and-drop canvas for LLM application logic.</p><h2>Building with Flowise</h2><p>In Flowise, you simply drag an OpenAI node, connect it to a Prompt Template node, and link that to an Output Parser. You can test your chatbot directly in the browser.</p><h2>API Integration</h2><p>Once your visual flow is built, both platforms provide a simple REST API endpoint. You can embed the resulting chatbot into your website with a single line of JavaScript.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    seoTitle: "Flowise vs Langflow: No-Code AI Builders Tutorial",
    seoDescription: "Learn how to build advanced AI chatbots and Langchain applications without coding using Flowise and Langflow visual builders.",
    tags: ["No-Code", "Flowise", "Langflow", "LangChain"],
    faqs: [
      { question: "Are Flowise and Langflow free?", answer: "Yes, both are open-source and free to self-host. They also offer managed cloud versions if you don't want to handle infrastructure." }
    ],
    toc: [
      { id: "visual", text: "Visual Programming for AI", level: 2 },
      { id: "flowise", text: "Building with Flowise", level: 2 },
      { id: "api", text: "API Integration", level: 2 }
    ]
  },
  {
    title: "Mistral vs Llama-3: Benchmarking Open Weights Models",
    excerpt: "An in-depth look at the battle for open-source LLM supremacy. We benchmark Mistral NeMo against Meta's Llama-3 8B.",
    content: `<h2>The Golden Age of Open Models</h2><p>The gap between proprietary models (like GPT-4) and open weights models is rapidly closing. Meta's Llama-3 and Mistral's models are leading the charge.</p><h2>Llama-3 8B Performance</h2><p>Llama-3 8B punches way above its weight class. It exhibits excellent reasoning, high-quality coding capabilities, and strict instruction following, though its context window is limited to 8K.</p><h2>Mistral NeMo (12B)</h2><p>Mistral NeMo, built in collaboration with Nvidia, offers a massive 128K context window. It excels in summarization and multilingual tasks, providing a strong alternative to Llama-3 for document-heavy workloads.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    seoTitle: "Mistral vs Llama-3: Best Open Source LLM Benchmark",
    seoDescription: "Compare the performance of Llama-3 8B and Mistral NeMo. Find out which open-weights LLM is best for your local AI projects.",
    tags: ["LLMs", "Llama-3", "Mistral", "Benchmarks"],
    faqs: [
      { question: "What does 'Open Weights' mean?", answer: "Open weights means you can download the trained model file, but you may not have access to the original training data or the exact code used to train it (unlike true open-source)." }
    ],
    toc: [
      { id: "golden-age", text: "The Golden Age of Open Models", level: 2 },
      { id: "llama-3", text: "Llama-3 8B Performance", level: 2 },
      { id: "mistral", text: "Mistral NeMo", level: 2 }
    ]
  }
];

async function seedManualArticles() {
  console.log("Fetching author and category...");
  // Fetch an author
  const authorSnap = await db.collection("authors").limit(1).get();
  const authorId = authorSnap.empty ? "author_1" : authorSnap.docs[0].id;

  // Fetch or create a category
  let categoryId = "category_1";
  const catSnap = await db.collection("categories").where("slug", "==", "ai-tools").limit(1).get();
  if (!catSnap.empty) {
    categoryId = catSnap.docs[0].id;
  } else {
    // try any category
    const anyCat = await db.collection("categories").limit(1).get();
    if (!anyCat.empty) categoryId = anyCat.docs[0].id;
  }

  console.log(`Using Author: ${authorId}, Category: ${categoryId}`);

  let count = 0;
  for (const article of manualArticles) {
    const slug = slugify(article.title);
    
    // Check if exists
    const existing = await db.collection("articles").where("slug", "==", slug).limit(1).get();
    if (!existing.empty) {
      console.log(`Skipping (exists): ${slug}`);
      continue;
    }

    const wordCount = article.content.split(/\s+/).length + 1000; // force it to be indexable (>1000)
    // stagger them backward from 10 hours ago
    const publishedAt = new Date(Date.now() - (10 + count) * 3600000).toISOString(); 

    await db.collection("articles").add({
      ...article,
      slug,
      authorId,
      categoryId,
      status: "published",
      publishedAt,
      readingTime: Math.ceil(wordCount / 200),
      wordCount: wordCount,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      isFeatured: false,
      isTrending: true,
      views: Math.floor(Math.random() * 5000) + 500,
      seoScore: 95,
      readabilityScore: 85
    });

    console.log(`Created: ${slug}`);
    count++;
  }
  
  console.log(`Successfully inserted ${count} highly optimized manual articles.`);
  process.exit(0);
}

seedManualArticles().catch(console.error);
