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
];

export default function OpenSourceClient() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-32">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-sm font-semibold mb-6">
            <Crown weight="fill" className="text-amber-400" />
            Hidden Gems
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Open Source <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Treasures</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            The best 100% free, open-source AI tools, frameworks, and models curated for developers and creators. No paywalls, just pure value.
          </p>
        </motion.div>
      </section>

      {/* Grid Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <RocketLaunch size={64} weight="duotone" className="text-blue-600" />
              </div>
              
              <div className="flex-grow z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{tool.name}</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="z-10 mt-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Visit Website
                    <ArrowUpRight weight="bold" />
                  </a>
                  <a
                    href={tool.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    aria-label="GitHub Repository"
                  >
                    <GithubLogo size={20} weight="fill" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
