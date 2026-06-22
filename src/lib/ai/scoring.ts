/**
 * Topic Scoring System.
 *
 * Produces a Topic Score out of 100 from five weighted factors:
 *   Search Demand 30% · Trend Velocity 20% · Low Competition 15%
 *   · Viral Potential 15% · DeskNomads Relevance 20%
 */
import { SCORE_WEIGHTS } from "./config";
import { chatJSON } from "./openrouter";
import type { CandidateOpportunity } from "./trends";

export interface ScoreBreakdown {
  searchDemand: number;
  trendVelocity: number;
  lowCompetition: number;
  viralPotential: number;
  relevance: number;
}

export interface ScoredOpportunity extends CandidateOpportunity {
  scores: ScoreBreakdown;
  topicScore: number;
}

function weightedTotal(s: ScoreBreakdown): number {
  const total =
    s.searchDemand * SCORE_WEIGHTS.searchDemand +
    s.trendVelocity * SCORE_WEIGHTS.trendVelocity +
    s.lowCompetition * SCORE_WEIGHTS.lowCompetition +
    s.viralPotential * SCORE_WEIGHTS.viralPotential +
    s.relevance * SCORE_WEIGHTS.relevance;
  return Math.round(total);
}

function clamp(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

/**
 * Score a batch of candidate opportunities. The LLM acts as an SEO analyst,
 * estimating each factor 0-100; we apply the canonical weights deterministically.
 */
export async function scoreOpportunities(
  candidates: CandidateOpportunity[]
): Promise<ScoredOpportunity[]> {
  if (candidates.length === 0) return [];

  const list = candidates
    .map(
      (c, i) =>
        `${i}. Title: ${c.title}\n   Keyword: ${c.primaryKeyword}\n   Category: ${c.category}\n   Angle: ${c.angle}`
    )
    .join("\n");

  const system = `You are a senior SEO + content strategy analyst for DeskNomads (AI tools, remote work, online income). You estimate the commercial and search opportunity of article ideas. Be discriminating but fair: a genuinely strong, timely, monetizable topic SHOULD score in the 80-90 range so it can be prioritized — do not artificially suppress good ideas. Reserve 90+ for exceptional opportunities and push weak/generic ideas below 60.`;

  const user = `Score each idea on five factors from 0-100. Calibration anchors apply to every factor: 90-100 = exceptional, 80-89 = strong, 65-79 = decent, 50-64 = mediocre, <50 = weak.

Factors:
- searchDemand: monthly search volume potential for the keyword (high-intent commercial keywords with real volume = 80+).
- trendVelocity: how fast interest is rising right now (a topic tied to a this-week development = 80+).
- lowCompetition: ease of ranking. 80-100 = long-tail/niche with weak competitors; 65-79 = moderate; 40-64 = competitive; <40 = dominated by major authority sites. Judge realistically — do NOT default to a low number.
- viralPotential: shareability and Google Discover potential.
- relevance: fit to DeskNomads' audience and monetization.

Ideas:
${list}

Return ONLY JSON: {"scores":[{"index":0,"searchDemand":0,"trendVelocity":0,"lowCompetition":0,"viralPotential":0,"relevance":0}, ...]} with one entry per idea.`;

  const parsed = await chatJSON<{
    scores: (ScoreBreakdown & { index: number })[];
  }>([
    { role: "system", content: system },
    { role: "user", content: user },
  ]);

  const byIndex = new Map(parsed.scores?.map((s) => [s.index, s]) || []);

  return candidates.map((c, i) => {
    const raw = byIndex.get(i);
    const scores: ScoreBreakdown = {
      searchDemand: clamp(raw?.searchDemand),
      trendVelocity: clamp(raw?.trendVelocity),
      lowCompetition: clamp(raw?.lowCompetition),
      viralPotential: clamp(raw?.viralPotential),
      relevance: clamp(raw?.relevance),
    };
    return { ...c, scores, topicScore: weightedTotal(scores) };
  });
}
