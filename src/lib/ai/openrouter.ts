/**
 * OpenRouter client — text chat completions, JSON-mode helpers, and image generation.
 * Docs: https://openrouter.ai/docs
 */
import { MODELS, SITE, getOpenRouterKey, EngineError } from "./config";

const BASE_URL = "https://openrouter.ai/api/v1";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  /** Force the model to return a single JSON object. */
  json?: boolean;
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  { retries = 2, backoffMs = 1500, stage = "openrouter" } = {}
): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init);
      // Retry on transient server / rate-limit errors
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`HTTP ${res.status}`);
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, backoffMs * (attempt + 1)));
          continue;
        }
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, backoffMs * (attempt + 1)));
        continue;
      }
    }
  }
  throw new EngineError(stage, `Network failure: ${String(lastErr)}`);
}

function authHeaders() {
  return {
    Authorization: `Bearer ${getOpenRouterKey()}`,
    "Content-Type": "application/json",
    // OpenRouter attribution headers
    "HTTP-Referer": SITE.url,
    "X-Title": SITE.name,
  };
}

/** Run a chat completion and return the assistant text. */
export async function chat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<string> {
  const body: Record<string, unknown> = {
    model: opts.model || MODELS.text,
    messages,
    temperature: opts.temperature ?? 0.7,
  };
  if (opts.maxTokens) body.max_tokens = opts.maxTokens;
  if (opts.json) body.response_format = { type: "json_object" };

  const res = await fetchWithRetry(
    `${BASE_URL}/chat/completions`,
    { method: "POST", headers: authHeaders(), body: JSON.stringify(body) },
    { stage: "openrouter.chat" }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new EngineError("openrouter.chat", `Chat failed (${res.status}): ${text.slice(0, 500)}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new EngineError("openrouter.chat", "Empty completion response");
  return content;
}

/**
 * Run a chat completion expecting JSON and parse it.
 * Tolerates models that wrap JSON in markdown fences.
 */
export async function chatJSON<T = unknown>(
  messages: ChatMessage[],
  opts: ChatOptions = {}
): Promise<T> {
  const raw = await chat(messages, { ...opts, json: true, temperature: opts.temperature ?? 0.4 });
  return parseJSONLoose<T>(raw);
}

export function parseJSONLoose<T = unknown>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Last resort: grab the outermost {...} or [...]
    const objMatch = cleaned.match(/[{[][\s\S]*[}\]]/);
    if (objMatch) {
      try {
        return JSON.parse(objMatch[0]) as T;
      } catch {
        /* fall through */
      }
    }
    throw new EngineError("openrouter.json", `Could not parse JSON from model output: ${cleaned.slice(0, 300)}`);
  }
}

export interface GeneratedImage {
  /** Raw bytes of the generated image. */
  buffer: Buffer;
  mimeType: string;
}

/**
 * Generate an image via OpenRouter's image-capable chat model.
 * Returns decoded bytes ready to upload to storage.
 */
export async function generateImage(prompt: string, opts: { model?: string } = {}): Promise<GeneratedImage> {
  const body = {
    model: opts.model || MODELS.image,
    messages: [{ role: "user", content: prompt }],
    modalities: ["image", "text"],
  };

  const res = await fetchWithRetry(
    `${BASE_URL}/chat/completions`,
    { method: "POST", headers: authHeaders(), body: JSON.stringify(body) },
    { stage: "openrouter.image", retries: 1 }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new EngineError("openrouter.image", `Image gen failed (${res.status}): ${text.slice(0, 500)}`);
  }

  const data = await res.json();
  const message = data?.choices?.[0]?.message;
  // OpenRouter returns generated images under message.images[].image_url.url (data: URI)
  const imageUrl: string | undefined =
    message?.images?.[0]?.image_url?.url || message?.images?.[0]?.url;

  if (!imageUrl) {
    throw new EngineError("openrouter.image", "No image returned by model");
  }

  return decodeImageRef(imageUrl);
}

async function decodeImageRef(ref: string): Promise<GeneratedImage> {
  if (ref.startsWith("data:")) {
    const match = ref.match(/^data:([^;]+);base64,(.*)$/);
    if (!match) throw new EngineError("openrouter.image", "Malformed data URI");
    return { mimeType: match[1], buffer: Buffer.from(match[2], "base64") };
  }
  // Remote URL — fetch the bytes
  const res = await fetch(ref);
  if (!res.ok) throw new EngineError("openrouter.image", `Failed to fetch image url (${res.status})`);
  const arrayBuffer = await res.arrayBuffer();
  const mimeType = res.headers.get("content-type") || "image/png";
  return { mimeType, buffer: Buffer.from(arrayBuffer) };
}
