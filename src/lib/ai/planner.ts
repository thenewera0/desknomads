/**
 * Content Planner — produces the editorial plan (SEO title, slug, keywords,
 * intent, angle, meta description, FAQ topics, outline) before generation.
 */
import slugify from "slugify";
import { chatJSON } from "./openrouter";
import type { ContentPlan } from "@/types";
import type { ScoredOpportunity } from "./scoring";

export function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true }).slice(0, 80);
}

export async function createContentPlan(
  opp: Pick<
    ScoredOpportunity,
    "title" | "topic" | "category" | "primaryKeyword" | "secondaryKeywords" | "searchIntent" | "angle"
  >,
  researchSummary: string
): Promise<ContentPlan> {
  const system = `You are DeskNomads' head of SEO content strategy. You design article blueprints engineered to rank on Google and qualify for Google Discover, without clickbait.`;

  const user = `Create the editorial plan for this article.

Working title: ${opp.title}
Topic: ${opp.topic}
Category: ${opp.category}
Primary keyword: ${opp.primaryKeyword}
Secondary keywords: ${opp.secondaryKeywords.join(", ")}
Search intent: ${opp.searchIntent}
Angle: ${opp.angle}
Research summary: ${researchSummary || "(use general expertise)"}

Return ONLY JSON:
{
  "seoTitle": "<= 60 chars, includes primary keyword, compelling",
  "slug": "kebab-case-url-slug",
  "primaryKeyword": "...",
  "secondaryKeywords": ["6-10 semantic keywords"],
  "searchIntent": "...",
  "angle": "the differentiated angle",
  "metaDescription": "150-160 chars, includes keyword, drives clicks",
  "faqTopics": ["5-7 real questions people ask"],
  "outline": [
    {"heading":"H2 section title","level":2,"points":["key point","key point"]},
    {"heading":"H3 subsection","level":3,"points":["..."]}
  ]
}
The outline must have 7-12 H2 sections covering: intro context, comparisons, case studies/examples, statistics, pros & cons, actionable steps, expert insights, and a conclusion. Use H3s where helpful.`;

  const plan = await chatJSON<ContentPlan>([
    { role: "system", content: system },
    { role: "user", content: user },
  ]);

  // Normalize / guard fields
  plan.slug = toSlug(plan.slug || plan.seoTitle || opp.title);
  plan.primaryKeyword = plan.primaryKeyword || opp.primaryKeyword;
  plan.secondaryKeywords = plan.secondaryKeywords?.length
    ? plan.secondaryKeywords
    : opp.secondaryKeywords;
  plan.faqTopics = plan.faqTopics || [];
  plan.outline = plan.outline || [];
  plan.seoTitle = (plan.seoTitle || opp.title).slice(0, 70);
  plan.metaDescription = (plan.metaDescription || opp.topic).slice(0, 160);
  return plan;
}
