"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, GithubLogo, Crown, RocketLaunch } from "@phosphor-icons/react";

const tools = [
  // Local AI & Inference
  {
    name: "Ollama",
    description: "Get up and running with large language models locally.",
    url: "https://ollama.com",
    github: "https://github.com/ollama/ollama",
    tags: ["Local AI", "MacOS", "Linux", "Windows"],
  },
  {
    name: "LM Studio",
    description: "Discover, download, and run local LLMs. Complete with an OpenAI compatible API.",
    url: "https://lmstudio.ai/",
    github: "https://github.com/lmstudio-ai",
    tags: ["Local AI", "GUI", "API"],
  },
  {
    name: "GPT4All",
    description: "A free-to-use, locally running, privacy-aware chatbot. No GPU required.",
    url: "https://gpt4all.io/",
    github: "https://github.com/nomic-ai/gpt4all",
    tags: ["Local AI", "CPU", "Privacy"],
  },
  {
    name: "Llama.cpp",
    description: "Port of Facebook's LLaMA model in C/C++ for efficient local inference.",
    url: "https://github.com/ggerganov/llama.cpp",
    github: "https://github.com/ggerganov/llama.cpp",
    tags: ["Inference", "C++", "Fast"],
  },
  {
    name: "VLLM",
    description: "A high-throughput and memory-efficient LLM inference and serving engine.",
    url: "https://vllm.ai/",
    github: "https://github.com/vllm-project/vllm",
    tags: ["Serving", "Fast", "GPU"],
  },

  // Developer Tools & Coding
  {
    name: "Cursor",
    description: "The AI Code Editor. Built to make you extraordinarily productive.",
    url: "https://cursor.com/",
    github: "https://github.com/getcursor/cursor",
    tags: ["Dev Tools", "Editor", "Copilot"],
  },
  {
    name: "Continue.dev",
    description: "The leading open-source AI code assistant for VS Code and JetBrains.",
    url: "https://continue.dev/",
    github: "https://github.com/continuedev/continue",
    tags: ["Dev Tools", "Extension", "Open Source"],
  },
  {
    name: "Cline",
    description: "An autonomous coding agent right in your IDE, capable of creating and editing files.",
    url: "https://github.com/cline/cline",
    github: "https://github.com/cline/cline",
    tags: ["Dev Tools", "Agents", "VS Code"],
  },
  
  // Frameworks & Orchestration
  {
    name: "LangChain",
    description: "Building applications with LLMs through composability.",
    url: "https://python.langchain.com/",
    github: "https://github.com/langchain-ai/langchain",
    tags: ["Framework", "Python", "RAG"],
  },
  {
    name: "LlamaIndex",
    description: "Data framework for your LLM applications. Ingest, structure, and access data.",
    url: "https://www.llamaindex.ai/",
    github: "https://github.com/run-llama/llama_index",
    tags: ["Framework", "Data", "RAG"],
  },
  {
    name: "Semantic Kernel",
    description: "Integrate cutting-edge LLM technology quickly and easily into your apps.",
    url: "https://github.com/microsoft/semantic-kernel",
    github: "https://github.com/microsoft/semantic-kernel",
    tags: ["Framework", "Microsoft", "Enterprise"],
  },
  
  // No-Code / Visual Builders
  {
    name: "Flowise",
    description: "Drag & drop UI to build your customized LLM flow using LangchainJS.",
    url: "https://flowiseai.com/",
    github: "https://github.com/FlowiseAI/Flowise",
    tags: ["No-Code", "UI", "LangChain"],
  },
  {
    name: "Langflow",
    description: "Langflow is a UI for LangChain, designed with react-flow.",
    url: "https://www.langflow.org/",
    github: "https://github.com/langflow-ai/langflow",
    tags: ["No-Code", "UI", "Visual Builder"],
  },
  
  // Agents & Automation
  {
    name: "AutoGPT",
    description: "An experimental open-source attempt to make GPT-4 fully autonomous.",
    url: "https://news.agpt.co/",
    github: "https://github.com/Significant-Gravitas/AutoGPT",
    tags: ["Agents", "Automation", "GPT-4"],
  },
  {
    name: "CrewAI",
    description: "Framework for orchestrating role-playing, autonomous AI agents.",
    url: "https://crewai.com/",
    github: "https://github.com/joaomdmoura/crewAI",
    tags: ["Agents", "Multi-Agent", "Python"],
  },
  {
    name: "Open Interpreter",
    description: "A natural language interface for your computer's general-purpose capabilities.",
    url: "https://openinterpreter.com/",
    github: "https://github.com/OpenInterpreter/open-interpreter",
    tags: ["Agents", "Terminal", "Local"],
  },
  {
    name: "n8n",
    description: "Free and open fair-code licensed node based Workflow Automation Tool.",
    url: "https://n8n.io/",
    github: "https://github.com/n8n-io/n8n",
    tags: ["Automation", "Workflow", "Integration"],
  },
  
  // Audio, Video, Image
  {
    name: "ComfyUI",
    description: "The most powerful and modular stable diffusion GUI and backend.",
    url: "https://github.com/comfyanonymous/ComfyUI",
    github: "https://github.com/comfyanonymous/ComfyUI",
    tags: ["Images", "Stable Diffusion", "Nodes"],
  },
  {
    name: "Fooocus",
    description: "Image generating software with a focus on prompting and generating.",
    url: "https://github.com/lllyasviel/Fooocus",
    github: "https://github.com/lllyasviel/Fooocus",
    tags: ["Images", "Generative AI", "Easy"],
  },
  {
    name: "Stable Diffusion WebUI",
    description: "A browser interface based on Gradio library for Stable Diffusion.",
    url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    github: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    tags: ["Images", "Generative AI", "UI"],
  },
  {
    name: "Bark",
    description: "Text-prompted generative audio model by Suno.",
    url: "https://github.com/suno-ai/bark",
    github: "https://github.com/suno-ai/bark",
    tags: ["Audio", "TTS", "Generative AI"],
  },
  
  // Full Desktop Apps
  {
    name: "AnythingLLM",
    description: "The all-in-one Desktop & Docker AI application with built-in RAG.",
    url: "https://useanything.com/",
    github: "https://github.com/Mintplex-Labs/anything-llm",
    tags: ["Desktop", "RAG", "Enterprise"],
  },
  
  // Machine Learning Core
  {
    name: "Hugging Face Transformers",
    description: "State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.",
    url: "https://huggingface.co/docs/transformers",
    github: "https://github.com/huggingface/transformers",
    tags: ["Core", "PyTorch", "Models"],
  },
  {
    name: "Unsloth",
    description: "Finetune Llama 3, Mistral, Gemma & more 2-5x faster with 70% less memory.",
    url: "https://unsloth.ai/",
    github: "https://github.com/unslothai/unsloth",
    tags: ["Core", "Finetuning", "Fast"],
  },
  
  // PDF Guides & Cheat Sheets
  {
    name: "Prompt Engineering Guide",
    description: "A comprehensive guide and repository for prompt engineering by DAIR.AI.",
    url: "https://www.promptingguide.ai/",
    github: "https://github.com/dair-ai/Prompt-Engineering-Guide",
    tags: ["Guide", "Prompting", "Learn"],
  },
  {
    name: "The LLM University",
    description: "Cohere's comprehensive curriculum for natural language processing.",
    url: "https://cohere.com/llmu",
    github: "https://github.com/cohere-ai/llmu",
    tags: ["Course", "LLMs", "Learn"],
  },
  {
    name: "Machine Learning Yearning",
    description: "Free draft of Andrew Ng's book on structuring machine learning projects.",
    url: "https://www.deeplearning.ai/machine-learning-yearning/",
    github: "https://github.com/ajaymache/machine-learning-yearning",
    tags: ["Book", "ML", "Andrew Ng"],
  },

  // Databases & Datasets
  {
    name: "Kaggle Datasets",
    description: "Explore, analyze, and share quality data. Find the perfect dataset for your next ML project.",
    url: "https://www.kaggle.com/datasets",
    github: "https://github.com/Kaggle",
    tags: ["Data", "Community", "ML"],
  },
  {
    name: "Hugging Face Datasets",
    description: "The largest open-source collection of ML datasets for NLP, Vision, and Audio.",
    url: "https://huggingface.co/datasets",
    github: "https://github.com/huggingface/datasets",
    tags: ["Data", "NLP", "Vision"],
  },
  {
    name: "Civitai",
    description: "The premier platform for sharing and discovering custom Stable Diffusion models.",
    url: "https://civitai.com/",
    github: "https://github.com/civitai/civitai",
    tags: ["Models", "Images", "Community"],
  },

  // Assets & UI/UX Productivity
  {
    name: "Vercel v0",
    description: "Generative UI system by Vercel. Build React components with text prompts.",
    url: "https://v0.dev/",
    github: "https://github.com/vercel",
    tags: ["UI", "Generative", "React"],
  },
  {
    name: "Shadcn/ui",
    description: "Beautifully designed components that you can copy and paste into your apps.",
    url: "https://ui.shadcn.com/",
    github: "https://github.com/shadcn-ui/ui",
    tags: ["UI", "Components", "Tailwind"],
  },
  {
    name: "Lucide Icons",
    description: "Beautiful & consistent icon toolkit made by the community.",
    url: "https://lucide.dev/",
    github: "https://github.com/lucide-icons/lucide",
    tags: ["Assets", "Icons", "Design"],
  },

  // AI Productivity & Jugad Tools
  {
    name: "Open WebUI",
    description: "An extensible, feature-rich, and user-friendly self-hosted WebUI for LLMs.",
    url: "https://openwebui.com/",
    github: "https://github.com/open-webui/open-webui",
    tags: ["Productivity", "WebUI", "Local AI"],
  },
  {
    name: "AnythingLLM Desktop",
    description: "Chat with your documents securely on your own device, entirely offline.",
    url: "https://useanything.com/download",
    github: "https://github.com/Mintplex-Labs/anything-llm",
    tags: ["Productivity", "RAG", "Offline"],
  },
];

export default function OpenSourceClient() {
  return (
    <div className="min-h-screen w-full relative pt-24 md:pt-36 pb-32" style={{ backgroundColor: "var(--dn-bg)" }}>
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-16 md:mb-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--dn-bg-card)] border border-[var(--dn-glass-border)] text-white text-xs font-semibold mb-6 shadow-[var(--dn-shadow-inset)]">
            <Crown weight="fill" className="text-[var(--dn-accent)]" />
            <span className="tracking-widest uppercase text-[10px]">Hidden Gems & Resources</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-none">
            Ultimate Resources <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--dn-accent)] to-[var(--dn-primary)] italic font-serif font-normal">Hub</span>
          </h1>
          <p className="text-sm md:text-base text-[var(--dn-text-secondary)] mb-8 max-w-[50ch] mx-auto">
            The best 100% free, open-source AI tools, frameworks, guides, databases, and UI assets curated for developers and creators. No paywalls, just pure value.
          </p>
        </motion.div>
      </section>

      {/* Grid Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.1 }}
              className="h-full"
            >
              <div className="glass-card h-full flex flex-col group hover:bg-white/[0.04] transition-colors duration-[var(--dn-duration)]">
                <div className="glass-core relative p-6 h-full flex flex-col items-start justify-between">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                       style={{ background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 70%)' }} />

                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-all duration-[var(--dn-duration)] -translate-y-4 group-hover:translate-y-0 translate-x-4 group-hover:translate-x-0 z-0">
                    <RocketLaunch size={80} weight="duotone" className="text-[var(--dn-accent)]" />
                  </div>
                  
                  <div className="flex-grow z-10 w-full mb-8">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--dn-accent)] transition-colors duration-[var(--dn-duration-fast)]">
                      {tool.name}
                    </h3>
                    <p className="text-[13px] text-[var(--dn-text-secondary)] leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="z-10 w-full mt-auto">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] uppercase tracking-widest font-bold text-[var(--dn-text-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-5 border-t border-[var(--dn-glass-border)]">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--dn-bg-card)] border border-[var(--dn-glass-border)] text-white rounded-xl text-xs font-semibold hover:bg-white/[0.08] transition-colors group/btn shadow-[var(--dn-shadow-inset)]"
                      >
                        Visit Website
                        <ArrowUpRight weight="bold" className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                      <a
                        href={tool.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 text-[var(--dn-text-muted)] bg-[var(--dn-bg-card)] hover:bg-white/[0.08] hover:text-white border border-[var(--dn-glass-border)] rounded-xl transition-colors shadow-[var(--dn-shadow-inset)]"
                        aria-label="GitHub Repository"
                      >
                        <GithubLogo size={18} weight="fill" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
