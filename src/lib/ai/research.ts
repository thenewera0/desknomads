/**
 * Research Layer — gathers recent sources, statistics, and expert insights
 * via Tavily before article generation. Findings are fed into the writer and
 * cited in the final article.
 */
import { chatJSON } from "./openrouter";
import { tavilySearch } from "./tavily";
import type { ResearchData } from "@/types";

export async function gatherResearch(
  topic: string,
  primaryKeyword: string
): Promise<ResearchData> {
  const queries = [
    `${primaryKeyword} latest statistics and data`,
    `${topic} expert analysis and insights`,
    `${primaryKeyword} recent news and developments`,
  ];

  const responses = await Promise.allSettled(
    queries.map((q) => tavilySearch(q, { searchDepth: "advanced", maxResults: 6, days: 90 }))
  );

  const sources: ResearchData["sources"] = [];
  const answers: string[] = [];
  const seen = new Set<string>();

  for (const r of responses) {
    if (r.status !== "fulfilled") continue;
    if (r.value.answer) answers.push(r.value.answer);
    for (const item of r.value.results) {
      if (seen.has(item.url)) continue;
      seen.add(item.url);
      sources.push({
        title: item.title,
        url: item.url,
        snippet: (item.content || "").slice(0, 500),
        published: item.published_date,
      });
    }
  }

  // If research returned nothing (e.g. API hiccup), degrade gracefully.
  if (sources.length === 0) {
    return { summary: "", sources: [], statistics: [], expertInsights: [] };
  }

  // Distill the raw sources into a tight research brief.
  const digest = sources
    .map((s, i) => `[${i + 1}] ${s.title} (${s.url})\n${s.snippet}`)
    .join("\n\n")
    .slice(0, 12000);

  const parsed = await chatJSON<{
    summary: string;
    statistics: string[];
    expertInsights: string[];
  }>([
    {
      role: "system",
      content:
        "You are a research analyst. Extract only concrete, verifiable, recent facts from the provided sources. Never invent numbers. Each statistic must be traceable to a source.",
    },
    {
      role: "user",
      content: `Topic: ${topic}\nKeyword: ${primaryKeyword}\n\nSources:\n${digest}\n\nReturn ONLY JSON: {"summary":"2-3 sentence synthesis","statistics":["stat with figure ...","..."],"expertInsights":["insight ...","..."]}. Include up to 8 statistics and 6 insights, each citing what it came from.`,
    },
  ]);

  return {
    summary: parsed.summary || answers.join(" ").slice(0, 600),
    sources,
    statistics: parsed.statistics || [],
    expertInsights: parsed.expertInsights || [],
  };
}
