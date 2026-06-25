/**
 * Fact-Checking Layer — validates statistics, dates, and references before
 * publishing. Produces a confidence score (0-100). Articles below the
 * configured threshold are routed to the review queue instead of published.
 */
import { chatJSON } from "./openrouter";
import type { FactCheckResult, ResearchData } from "@/types";

/** Extract http(s) URLs from anchor hrefs in the HTML. */
function extractUrls(html: string): string[] {
  const urls = new Set<string>();
  const re = /href=["'](https?:\/\/[^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) urls.add(m[1]);
  return [...urls];
}

/** Lightweight URL liveness check (HEAD, short timeout). */
async function checkUrl(url: string): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, { method: "HEAD", signal: ctrl.signal, redirect: "follow" });
    clearTimeout(t);
    // Some servers reject HEAD; treat 405 as "exists".
    return res.ok || res.status === 405 || res.status === 403;
  } catch {
    return false;
  }
}

export async function factCheck(
  html: string,
  research: ResearchData
): Promise<FactCheckResult> {
  const issues: string[] = [];
  const nowDate = new Date();
  const today = nowDate.toISOString().slice(0, 10);
  const year = nowDate.getUTCFullYear();

  // 1. Validate outbound reference URLs.
  const urls = extractUrls(html);
  let deadLinks = 0;
  if (urls.length) {
    const results = await Promise.all(urls.slice(0, 15).map(checkUrl));
    deadLinks = results.filter((ok) => !ok).length;
    if (deadLinks) issues.push(`${deadLinks}/${urls.length} reference link(s) appear unreachable`);
  }

  // 2. LLM verification of claims/statistics against research context.
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 9000);
  const researchContext =
    research.sources.map((s) => `${s.title}: ${s.snippet}`).join("\n").slice(0, 6000) ||
    "(no external research provided)";

  let llmConfidence = 70;
  try {
    const verdict = await chatJSON<{
      confidence: number;
      issues: string[];
    }>([
      {
        role: "system",
        content: `You are a meticulous fact-checker. You assess whether an article's specific claims, statistics, and dates are plausible and supported. You flag fabricated-looking numbers and unsupported strong claims. You return a calibrated confidence 0-100.

CRITICAL CONTEXT: Today's date is ${today}. The current year is ${year}. Do NOT treat references to ${year} (or recent ${year} events, releases, or "${year} guide") as anachronisms or "future-dated" — they are the present and are valid. Only flag a date as anachronistic if it is genuinely in the future relative to ${today} or logically impossible. Your knowledge cutoff being earlier than ${today} does not make current-year content wrong.`,
      },
      {
        role: "user",
        content: `Research context (ground truth):\n${researchContext}\n\nArticle text:\n${text}\n\nReturn ONLY JSON: {"confidence":0-100,"issues":["..."]}. Confidence reflects how factually trustworthy the article is for publication. Do not deduct confidence merely because content references the current year (${year}) or recent developments your training data may not include.`,
      },
    ]);
    llmConfidence = Math.max(0, Math.min(100, Math.round(verdict.confidence)));
    if (verdict.issues?.length) issues.push(...verdict.issues.slice(0, 8));
  } catch {
    issues.push("Automated claim verification unavailable; defaulted to neutral confidence");
  }

  // Combine: penalize dead links.
  const linkPenalty = Math.min(20, deadLinks * 7);
  const confidence = Math.max(0, llmConfidence - linkPenalty);

  return { confidence, passed: confidence >= 85, issues };
}
