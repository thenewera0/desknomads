export interface ResourceItem {
  name: string;
  description: string;
  url: string;
  github: string;
  tags: string[];
}

export interface ResourceCategory {
  title: string;
  description: string;
  items: ResourceItem[];
}

export const resourceCategories: ResourceCategory[] = [
  {
    title: "Local AI & Inference",
    description: "Run LLMs and AI models locally with complete privacy and control.",
    items: [
      { name: "Ollama", description: "Get up and running with large language models locally.", url: "https://ollama.com", github: "https://github.com/ollama/ollama", tags: ["Local AI", "MacOS", "Linux", "Windows"] },
      { name: "LM Studio", description: "Discover, download, and run local LLMs. Complete with an OpenAI compatible API.", url: "https://lmstudio.ai/", github: "https://github.com/lmstudio-ai", tags: ["Local AI", "GUI", "API"] },
      { name: "GPT4All", description: "A free-to-use, locally running, privacy-aware chatbot. No GPU required.", url: "https://gpt4all.io/", github: "https://github.com/nomic-ai/gpt4all", tags: ["Local AI", "CPU", "Privacy"] },
      { name: "Llama.cpp", description: "Port of Facebook's LLaMA model in C/C++ for efficient local inference.", url: "https://github.com/ggerganov/llama.cpp", github: "https://github.com/ggerganov/llama.cpp", tags: ["Inference", "C++", "Fast"] },
      { name: "VLLM", description: "A high-throughput and memory-efficient LLM inference and serving engine.", url: "https://vllm.ai/", github: "https://github.com/vllm-project/vllm", tags: ["Serving", "Fast", "GPU"] },
      { name: "Jan", description: "Jan is an open source alternative to ChatGPT that runs 100% offline on your computer.", url: "https://jan.ai/", github: "https://github.com/janhq/jan", tags: ["Local AI", "Privacy", "Desktop"] },
      { name: "LocalAI", description: "Drop-in replacement REST API that's compatible with OpenAI API specifications.", url: "https://localai.io/", github: "https://github.com/go-skynet/LocalAI", tags: ["API", "Local", "OpenAI Drop-in"] },
      { name: "ExLlamaV2", description: "Fast inference library for running local LLMs on consumer GPUs.", url: "https://github.com/turboderp/exllamav2", github: "https://github.com/turboderp/exllamav2", tags: ["Inference", "GPU", "Fast"] }
    ]
  },
  {
    title: "Developer Tools & Coding Assistants",
    description: "IDE extensions, coding agents, and tools to make developers extraordinarily productive.",
    items: [
      { name: "Cursor", description: "The AI Code Editor. Built to make you extraordinarily productive.", url: "https://cursor.com/", github: "https://github.com/getcursor/cursor", tags: ["Dev Tools", "Editor", "Copilot"] },
      { name: "Continue.dev", description: "The leading open-source AI code assistant for VS Code and JetBrains.", url: "https://continue.dev/", github: "https://github.com/continuedev/continue", tags: ["Dev Tools", "Extension", "Open Source"] },
      { name: "Cline", description: "An autonomous coding agent right in your IDE, capable of creating and editing files.", url: "https://github.com/cline/cline", github: "https://github.com/cline/cline", tags: ["Dev Tools", "Agents", "VS Code"] },
      { name: "Aider", description: "Aider is AI pair programming in your terminal.", url: "https://aider.chat/", github: "https://github.com/paul-gauthier/aider", tags: ["Terminal", "Agents", "Dev Tools"] },
      { name: "Tabby", description: "Self-hosted AI coding assistant. An open-source and on-premises alternative to GitHub Copilot.", url: "https://tabbyml.com/", github: "https://github.com/TabbyML/tabby", tags: ["Self-hosted", "Copilot", "Open Source"] },
      { name: "SWE-agent", description: "Takes a GitHub issue and tries to automatically fix it using an LLM.", url: "https://swe-agent.com/", github: "https://github.com/princeton-nlp/SWE-agent", tags: ["Agents", "Automation", "GitHub"] },
      { name: "Chatbox", description: "Open-source desktop client for multiple AI models, available on Windows, Mac, Linux.", url: "https://chatboxai.app/", github: "https://github.com/Bin-Huang/chatbox", tags: ["Desktop", "Client", "Multi-model"] },
      { name: "Devika", description: "Open-source AI software engineer that can understand high-level human instructions.", url: "https://github.com/stitionai/devika", github: "https://github.com/stitionai/devika", tags: ["Agents", "Engineer", "Automation"] }
    ]
  },
  {
    title: "Frameworks & Orchestration",
    description: "Libraries for building applications with LLMs through composability and multi-agent workflows.",
    items: [
      { name: "LangChain", description: "Building applications with LLMs through composability.", url: "https://python.langchain.com/", github: "https://github.com/langchain-ai/langchain", tags: ["Framework", "Python", "RAG"] },
      { name: "LlamaIndex", description: "Data framework for your LLM applications. Ingest, structure, and access data.", url: "https://www.llamaindex.ai/", github: "https://github.com/run-llama/llama_index", tags: ["Framework", "Data", "RAG"] },
      { name: "Semantic Kernel", description: "Integrate cutting-edge LLM technology quickly and easily into your apps.", url: "https://github.com/microsoft/semantic-kernel", github: "https://github.com/microsoft/semantic-kernel", tags: ["Framework", "Microsoft", "Enterprise"] },
      { name: "CrewAI", description: "Framework for orchestrating role-playing, autonomous AI agents.", url: "https://crewai.com/", github: "https://github.com/joaomdmoura/crewAI", tags: ["Agents", "Multi-Agent", "Python"] },
      { name: "AutoGen", description: "A programming framework for agentic AI by Microsoft.", url: "https://microsoft.github.io/autogen/", github: "https://github.com/microsoft/autogen", tags: ["Multi-Agent", "Framework", "Microsoft"] },
      { name: "Haystack", description: "Open source NLP framework to build production-ready LLM applications.", url: "https://haystack.deepset.ai/", github: "https://github.com/deepset-ai/haystack", tags: ["NLP", "RAG", "Framework"] },
      { name: "Guidance", description: "A guidance language for controlling large language models.", url: "https://github.com/guidance-ai/guidance", github: "https://github.com/guidance-ai/guidance", tags: ["Prompting", "Control", "Microsoft"] },
      { name: "DSPy", description: "The framework for programming—not prompting—foundation models.", url: "https://dspy-docs.vercel.app/", github: "https://github.com/stanfordnlp/dspy", tags: ["Framework", "Prompting", "Research"] }
    ]
  },
  {
    title: "UI/UX, Assets & Frontend Resources",
    description: "Open-source UI components, icon packs, and design systems for beautiful web apps.",
    items: [
      { name: "Shadcn/ui", description: "Beautifully designed components that you can copy and paste into your apps.", url: "https://ui.shadcn.com/", github: "https://github.com/shadcn-ui/ui", tags: ["UI", "Components", "Tailwind"] },
      { name: "Aceternity UI", description: "Copy and paste the most trending components and use them in your websites.", url: "https://ui.aceternity.com/", github: "https://github.com/aceternity/ui", tags: ["UI", "Animations", "Tailwind"] },
      { name: "Magic UI", description: "50+ free and open-source animated components built with React, Typescript, Tailwind CSS, and Framer Motion.", url: "https://magicui.design/", github: "https://github.com/magicuidesign/magicui", tags: ["UI", "Animated", "React"] },
      { name: "Lucide Icons", description: "Beautiful & consistent icon toolkit made by the community.", url: "https://lucide.dev/", github: "https://github.com/lucide-icons/lucide", tags: ["Assets", "Icons", "Design"] },
      { name: "Radix UI", description: "Unstyled, accessible components for building high‑quality design systems.", url: "https://www.radix-ui.com/", github: "https://github.com/radix-ui/primitives", tags: ["UI", "Accessible", "Primitives"] },
      { name: "Vercel v0", description: "Generative UI system by Vercel. Build React components with text prompts.", url: "https://v0.dev/", github: "https://github.com/vercel", tags: ["UI", "Generative", "React"] },
      { name: "Tremor", description: "The React library to build dashboards fast.", url: "https://tremor.so/", github: "https://github.com/tremorlabs/tremor", tags: ["UI", "Dashboards", "React"] },
      { name: "Heroicons", description: "Beautiful hand-crafted SVG icons, by the makers of Tailwind CSS.", url: "https://heroicons.com/", github: "https://github.com/tailwindlabs/heroicons", tags: ["Icons", "Assets", "Tailwind"] },
      { name: "Tailwind CSS", description: "A utility-first CSS framework for rapidly building custom user interfaces.", url: "https://tailwindcss.com/", github: "https://github.com/tailwindlabs/tailwindcss", tags: ["CSS", "Framework", "Design"] }
    ]
  },
  {
    title: "Databases, Datasets & Vector Stores",
    description: "Vector databases for RAG and open datasets for training machine learning models.",
    items: [
      { name: "Chroma", description: "The AI-native open-source embedding database.", url: "https://www.trychroma.com/", github: "https://github.com/chroma-core/chroma", tags: ["Database", "Vector", "Embeddings"] },
      { name: "Milvus", description: "A cloud-native vector database, built for scalable similarity search.", url: "https://milvus.io/", github: "https://github.com/milvus-io/milvus", tags: ["Database", "Vector", "Scalable"] },
      { name: "Qdrant", description: "Vector Database for the next generation of AI applications.", url: "https://qdrant.tech/", github: "https://github.com/qdrant/qdrant", tags: ["Database", "Vector", "Rust"] },
      { name: "Weaviate", description: "Open source, AI-native vector database.", url: "https://weaviate.io/", github: "https://github.com/weaviate/weaviate", tags: ["Database", "Vector", "Search"] },
      { name: "Hugging Face Datasets", description: "The largest open-source collection of ML datasets for NLP, Vision, and Audio.", url: "https://huggingface.co/datasets", github: "https://github.com/huggingface/datasets", tags: ["Data", "NLP", "Vision"] },
      { name: "Kaggle Datasets", description: "Explore, analyze, and share quality data. Find the perfect dataset for your next ML project.", url: "https://www.kaggle.com/datasets", github: "https://github.com/Kaggle", tags: ["Data", "Community", "ML"] },
      { name: "Open Assistant Datasets", description: "Crowdsourced datasets for training AI assistants.", url: "https://open-assistant.io/", github: "https://github.com/LAION-AI/Open-Assistant", tags: ["Data", "Crowdsourced", "Chat"] },
      { name: "LAION", description: "Large-scale open datasets for AI training (LAION-5B).", url: "https://laion.ai/", github: "https://github.com/LAION-AI", tags: ["Data", "Vision", "Large Scale"] }
    ]
  },
  {
    title: "No-Code & Visual Builders",
    description: "Drag-and-drop interfaces to build complex LLM flows without writing code.",
    items: [
      { name: "Flowise", description: "Drag & drop UI to build your customized LLM flow using LangchainJS.", url: "https://flowiseai.com/", github: "https://github.com/FlowiseAI/Flowise", tags: ["No-Code", "UI", "LangChain"] },
      { name: "Langflow", description: "Langflow is a UI for LangChain, designed with react-flow.", url: "https://www.langflow.org/", github: "https://github.com/langflow-ai/langflow", tags: ["No-Code", "UI", "Visual Builder"] },
      { name: "n8n", description: "Free and open fair-code licensed node based Workflow Automation Tool.", url: "https://n8n.io/", github: "https://github.com/n8n-io/n8n", tags: ["Automation", "Workflow", "Integration"] },
      { name: "Activepieces", description: "Your friendliest open source all-in-one automation tool.", url: "https://www.activepieces.com/", github: "https://github.com/activepieces/activepieces", tags: ["Automation", "No-Code", "Zapier Alt"] },
      { name: "Dify", description: "An open-source LLM app development platform.", url: "https://dify.ai/", github: "https://github.com/langgenius/dify", tags: ["Platform", "No-Code", "LLMOps"] }
    ]
  },
  {
    title: "Audio, Video & Image Generation",
    description: "Open-source models and GUIs for Stable Diffusion, Flux, Voice TTS, and Video.",
    items: [
      { name: "ComfyUI", description: "The most powerful and modular stable diffusion GUI and backend.", url: "https://github.com/comfyanonymous/ComfyUI", github: "https://github.com/comfyanonymous/ComfyUI", tags: ["Images", "Stable Diffusion", "Nodes"] },
      { name: "Stable Diffusion WebUI", description: "A browser interface based on Gradio library for Stable Diffusion.", url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui", github: "https://github.com/AUTOMATIC1111/stable-diffusion-webui", tags: ["Images", "Generative AI", "UI"] },
      { name: "Fooocus", description: "Image generating software with a focus on prompting and generating.", url: "https://github.com/lllyasviel/Fooocus", github: "https://github.com/lllyasviel/Fooocus", tags: ["Images", "Generative AI", "Easy"] },
      { name: "InvokeAI", description: "A creative engine for Stable Diffusion models, empowering professionals.", url: "https://invoke.com/", github: "https://github.com/invoke-ai/InvokeAI", tags: ["Images", "Professional", "UI"] },
      { name: "Bark", description: "Text-prompted generative audio model by Suno.", url: "https://github.com/suno-ai/bark", github: "https://github.com/suno-ai/bark", tags: ["Audio", "TTS", "Generative AI"] },
      { name: "Coqui TTS", description: "A deep learning toolkit for Text-to-Speech, battle-tested in research and production.", url: "https://coqui.ai/", github: "https://github.com/coqui-ai/TTS", tags: ["Audio", "TTS", "Voice"] },
      { name: "Whisper", description: "Robust Speech Recognition via Large-Scale Weak Supervision.", url: "https://openai.com/research/whisper", github: "https://github.com/openai/whisper", tags: ["Audio", "Transcription", "OpenAI"] },
      { name: "Sadtalker", description: "Learning 3D Motion Coefficients for Audio-driven Video Generation.", url: "https://sadtalker.github.io/", github: "https://github.com/OpenTalker/SadTalker", tags: ["Video", "Avatars", "Audio-driven"] }
    ]
  },
  {
    title: "AI Productivity & Chat Interfaces",
    description: "Self-hosted WebUIs, desktop apps, and offline chat clients for LLMs.",
    items: [
      { name: "Open WebUI", description: "An extensible, feature-rich, and user-friendly self-hosted WebUI for LLMs.", url: "https://openwebui.com/", github: "https://github.com/open-webui/open-webui", tags: ["Productivity", "WebUI", "Local AI"] },
      { name: "AnythingLLM", description: "The all-in-one Desktop & Docker AI application with built-in RAG.", url: "https://useanything.com/", github: "https://github.com/Mintplex-Labs/anything-llm", tags: ["Desktop", "RAG", "Enterprise"] },
      { name: "Lobe Chat", description: "An open-source, modern-design LLMs/AI chat framework.", url: "https://lobehub.com/", github: "https://github.com/lobehub/lobe-chat", tags: ["Chat", "UI", "Modern"] },
      { name: "LibreChat", description: "Enhanced ChatGPT clone: free, open source, and works with multiple providers.", url: "https://librechat.ai/", github: "https://github.com/danny-avila/LibreChat", tags: ["Chat", "Clone", "Multi-provider"] },
      { name: "Big-AGI", description: "Personal AI application powered by GPT-4 and other LLMs.", url: "https://big-agi.com/", github: "https://github.com/enricoros/big-AGI", tags: ["Chat", "Web", "Advanced"] }
    ]
  },
  {
    title: "Guides, Cheat Sheets & Learning",
    description: "Curated roadmaps, free books, and engineering guides.",
    items: [
      { name: "Prompt Engineering Guide", description: "A comprehensive guide and repository for prompt engineering by DAIR.AI.", url: "https://www.promptingguide.ai/", github: "https://github.com/dair-ai/Prompt-Engineering-Guide", tags: ["Guide", "Prompting", "Learn"] },
      { name: "Developer Roadmap", description: "Interactive roadmaps, guides and other educational content to help developers grow.", url: "https://roadmap.sh/", github: "https://github.com/kamranahmedse/developer-roadmap", tags: ["Guide", "Career", "Learning"] },
      { name: "System Design Primer", description: "Learn how to design large-scale systems. Prep for the system design interview.", url: "https://github.com/donnemartin/system-design-primer", github: "https://github.com/donnemartin/system-design-primer", tags: ["Guide", "System Design", "Interview"] },
      { name: "The LLM University", description: "Cohere's comprehensive curriculum for natural language processing.", url: "https://cohere.com/llmu", github: "https://github.com/cohere-ai/llmu", tags: ["Course", "LLMs", "Learn"] },
      { name: "Machine Learning Yearning", description: "Free draft of Andrew Ng's book on structuring machine learning projects.", url: "https://www.deeplearning.ai/machine-learning-yearning/", github: "https://github.com/ajaymache/machine-learning-yearning", tags: ["Book", "ML", "Andrew Ng"] },
      { name: "Deep Learning Specialization", description: "Notes and resources for Andrew Ng's Deep Learning Specialization.", url: "https://github.com/mbadry1/DeepLearning.ai-Summary", github: "https://github.com/mbadry1/DeepLearning.ai-Summary", tags: ["Notes", "Deep Learning", "Course"] }
    ]
  }
];
