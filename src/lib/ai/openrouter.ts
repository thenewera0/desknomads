/**
 * LLM client — text chat completions + JSON helpers with automatic provider
 * failover, plus image generation.
 *
 * Text generation tries the Leviathan gateway first (own keys / own failover
 * chain) and automatically falls back to OpenRouter on any error, empty body,
 * or unparseable JSON. Both use the same OpenAI-compatible /chat/completions
 * shape and the same prompts, so output quality is unchanged.
 * Docs: https://openrouter.ai/docs
 */
import {
  MODELS,
  SITE,
  LEVIATHAN,
  getLeviathanKey,
  getOpenRouterKey,
  getOpenRouterKeyOptional,
  EngineError,
  EngineConfigError,
} from "./config";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

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

function openrouterHeaders() {
  return {
    Authorization: `Bearer ${getOpenRouterKey()}`,
    "Content-Type": "application/json",
    // OpenRouter attribution headers
    "HTTP-Referer": SITE.url,
    "X-Title": SITE.name,
  };
}

function leviathanHeaders() {
  const key = getLeviathanKey() as string;
  // Send both auth styles the gateway documents (Bearer for the OpenAI SDK,
  // X-API-Key for the raw fetch example).
  return {
    Authorization: `Bearer ${key}`,
    "X-API-Key": key,
    "Content-Type": "application/json",
  };
}

// ── Circuit breaker for the primary provider ────────────────────
// Short-lived serverless/CLI runs make ~10 LLM calls each. If Leviathan is
// unhealthy, this stops us paying a failed round-trip on every one: after a
// couple of consecutive failures it's skipped for a cooldown, then retried.
const breaker = { fails: 0, openUntil: 0 };
const BREAKER_THRESHOLD = 2;
const BREAKER_COOLDOWN_MS = 60_000;

function leviathanAvailable(): boolean {
  if (!LEVIATHAN.enabled || !getLeviathanKey()) return false;
  if (breaker.openUntil && Date.now() < breaker.openUntil) return false;
  return true;
}

function noteLeviathan(ok: boolean): void {
  if (ok) {
    breaker.fails = 0;
    breaker.openUntil = 0;
    return;
  }
  breaker.fails += 1;
  if (breaker.fails >= BREAKER_THRESHOLD) {
    breaker.openUntil = Date.now() + BREAKER_COOLDOWN_MS;
    breaker.fails = 0;
  }
}

interface ProviderReq {
  name: "leviathan" | "openrouter";
  url: string;
  model: string;
  headers: Record<string, string>;
  useResponseFormat: boolean;
  retries: number;
}

/** One provider attempt. Throws on HTTP error, empty body, or missing content. */
async function callCompletion(
  p: ProviderReq,
  messages: ChatMessage[],
  opts: ChatOptions
): Promise<string> {
  const body: Record<string, unknown> = {
    model: p.model,
    messages,
    temperature: opts.temperature ?? 0.7,
  };
  if (opts.maxTokens) body.max_tokens = opts.maxTokens;
  if (opts.json && p.useResponseFormat) body.response_format = { type: "json_object" };

  const res = await fetchWithRetry(
    `${p.url}/chat/completions`,
    { method: "POST", headers: p.headers, body: JSON.stringify(body) },
    { stage: `${p.name}.chat`, retries: p.retries }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new EngineError(`${p.name}.chat`, `Chat failed (${res.status}): ${text.slice(0, 500)}`);
  }

  const data = await res.json().catch(() => null);
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  // Note: covers a gateway that answers HTTP 200 with an empty/JSON-less body.
  if (!content || !content.trim()) {
    throw new EngineError(`${p.name}.chat`, "Empty completion response");
  }
  return content;
}

/** Ordered provider list: Leviathan (if healthy) then OpenRouter fallback. */
function buildProviders(opts: ChatOptions): ProviderReq[] {
  const providers: ProviderReq[] = [];
  if (leviathanAvailable()) {
    providers.push({
      name: "leviathan",
      url: LEVIATHAN.baseUrl,
      model: LEVIATHAN.model,
      headers: leviathanHeaders(),
      // Leviathan routes across many free providers with varying json-mode
      // support; rely on the prompt + loose parsing instead of response_format
      // so a strict-field rejection doesn't force a fallback on every call.
      useResponseFormat: false,
      retries: 1,
    });
  }
  if (getOpenRouterKeyOptional()) {
    providers.push({
      name: "openrouter",
      url: OPENROUTER_BASE,
      model: opts.model || MODELS.text,
      headers: openrouterHeaders(),
      useResponseFormat: true,
      retries: 2,
    });
  }
  if (providers.length === 0) {
    throw new EngineConfigError(
      "No LLM provider configured (set LEVIATHAN_API_KEY or OPENROUTER_API_KEY)"
    );
  }
  return providers;
}

/** Try each provider in order; a thrown transform (e.g. bad JSON) also fails over. */
async function withFailover<R>(
  messages: ChatMessage[],
  opts: ChatOptions,
  transform: (raw: string) => R
): Promise<R> {
  const providers = buildProviders(opts);
  let lastErr: unknown;
  for (const p of providers) {
    try {
      const raw = await callCompletion(p, messages, opts);
      const out = transform(raw);
      if (p.name === "leviathan") noteLeviathan(true);
      return out;
    } catch (err) {
      lastErr = err;
      if (p.name === "leviathan") {
        noteLeviathan(false);
        console.warn(
          `[llm] Leviathan unavailable (${String((err as Error)?.message || err).slice(0, 140)}) — falling back to OpenRouter`
        );
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new EngineError("llm.chat", "All providers failed");
}

/** Run a chat completion and return the assistant text. */
export async function chat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<string> {
  return withFailover(messages, opts, (raw) => raw);
}

/**
 * Run a chat completion expecting JSON and parse it.
 * Tolerates models that wrap JSON in markdown fences.
 */
export async function chatJSON<T = unknown>(
  messages: ChatMessage[],
  opts: ChatOptions = {}
): Promise<T> {
  return withFailover(
    messages,
    { ...opts, json: true, temperature: opts.temperature ?? 0.4 },
    (raw) => parseJSONLoose<T>(raw)
  );
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
    `${OPENROUTER_BASE}/chat/completions`,
    { method: "POST", headers: openrouterHeaders(), body: JSON.stringify(body) },
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
