/**
 * Tavily Search API client — used for trend discovery and the research layer.
 * Docs: https://docs.tavily.com
 */
import { getTavilyKey, EngineError } from "./config";

const BASE_URL = "https://api.tavily.com";

export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface TavilyResponse {
  query: string;
  answer?: string;
  results: TavilyResult[];
}

interface SearchOptions {
  searchDepth?: "basic" | "advanced";
  topic?: "general" | "news";
  maxResults?: number;
  days?: number; // freshness window for news
  includeAnswer?: boolean;
}

export async function tavilySearch(query: string, opts: SearchOptions = {}): Promise<TavilyResponse> {
  const body = {
    api_key: getTavilyKey(),
    query,
    search_depth: opts.searchDepth || "advanced",
    topic: opts.topic || "general",
    max_results: opts.maxResults ?? 8,
    include_answer: opts.includeAnswer ?? true,
    ...(opts.days ? { days: opts.days } : {}),
  };

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new EngineError("tavily.search", `Network failure: ${String(err)}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new EngineError("tavily.search", `Tavily failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as TavilyResponse;
  return { query, answer: data.answer, results: data.results || [] };
}
