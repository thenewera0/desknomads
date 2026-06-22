/**
 * Article Generation — produces a 2500-4000 word, human-feeling, structured
 * HTML article from a content plan + research, with FAQs and an excerpt.
 */
import { chat, chatJSON } from "./openrouter";
import { MODELS } from "./config";
import type { ContentPlan, ResearchData, FAQ } from "@/types";

export interface GeneratedArticle {
  contentHtml: string;
  excerpt: string;
  faqs: FAQ[];
  wordCount: number;
}

const QUALITY_RULES = `QUALITY RULES (strict):
- Write like an experienced human expert, not an AI. Vary sentence length and rhythm.
- Never use filler/fluff phrases ("In today's fast-paced world", "In conclusion, it is important to note", "Let's dive in", "the realm of", "navigating the landscape").
- No repetition of ideas or padded sentences. Every paragraph must add new information.
- Solve a real problem with concrete, actionable detail, real examples, comparisons, and recent references.
- Use specific numbers, names, and steps. Cite research with inline <a> links to the provided source URLs where a claim depends on them.
- CRITICAL — do NOT fabricate data. Never invent statistics, percentages, study results, dollar figures, dates, or quotes. Only state a specific figure if it appears in the RESEARCH block, and link it to its source. If you lack a figure, describe the trend qualitatively or omit it. Never attribute made-up numbers to real companies or studies.
- Use a confident, helpful editorial voice.`;

function htmlInstructions(plan: ContentPlan): string {
  const outline = plan.outline
    .map((s) => `${s.level === 2 ? "##" : "###"} ${s.heading}${s.points?.length ? ` — cover: ${s.points.join("; ")}` : ""}`)
    .join("\n");
  return `Output clean semantic HTML for the article BODY only (no <html>/<head>/<body>, no markdown fences).
Allowed tags: <h2 id="..."> <h3 id="..."> <p> <ul> <ol> <li> <strong> <em> <a href> <blockquote> <table> <thead> <tbody> <tr> <th> <td>.
- Do NOT include an <h1> (the title is rendered separately).
- Every <h2> and <h3> MUST have a unique, kebab-case id attribute (used for the table of contents and anchor links).
- Open with a 2-3 paragraph introduction (no heading) that hooks the reader and states what they'll learn.
- Follow this outline (expand each section substantially):
${outline}
- Include at least one comparison <table>, one real-world case study/example, a "Pros and Cons" treatment (e.g. two <ul>s), concrete statistics, numbered actionable steps, and an expert-insights section.
- End with a strong "Conclusion" <h2> and a "Related Resources" <h2> with a short <ul> of further-reading links.
- Target 2500-4000 words. Do not pad to reach length; earn it with depth.`;
}

export async function generateArticle(
  plan: ContentPlan,
  research: ResearchData,
  category: string,
  options: { minWords?: number } = {}
): Promise<GeneratedArticle> {
  const minWords = options.minWords ?? 2500;
  const researchBlock = research.sources.length
    ? `RESEARCH (cite these where relevant, link with <a href>):
Summary: ${research.summary}
Statistics:\n${research.statistics.map((s) => `- ${s}`).join("\n")}
Expert insights:\n${research.expertInsights.map((s) => `- ${s}`).join("\n")}
Sources:\n${research.sources.map((s, i) => `[${i + 1}] ${s.title} — ${s.url}`).join("\n")}`
    : "No external research available — rely on accurate, general domain expertise and avoid inventing specific statistics.";

  const system = `You are a senior staff writer for DeskNomads, an authority publication on AI tools, remote work, and online income. You write deeply researched, genuinely useful long-form articles in the ${category} category. ${QUALITY_RULES}`;

  const user = `Write the full article.

SEO Title: ${plan.seoTitle}
Primary keyword: ${plan.primaryKeyword} (use naturally; do not keyword-stuff)
Secondary keywords: ${plan.secondaryKeywords.join(", ")}
Search intent: ${plan.searchIntent}
Angle: ${plan.angle}

${researchBlock}

${htmlInstructions(plan)}`;

  const contentHtml = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    { model: MODELS.text, temperature: 0.75, maxTokens: 16000 }
  );

  let cleanHtml = stripFences(contentHtml);
  let wordCount = countWords(cleanHtml);

  // Enforce the minimum length with a single expansion pass (deepen, don't pad).
  if (wordCount < minWords) {
    try {
      const expanded = await chat(
        [
          { role: "system", content: system },
          {
            role: "user",
            content: `The following article is only ${wordCount} words but must be at least ${minWords}. Expand it to ${minWords}-4000 words by deepening existing sections with more concrete examples, comparisons, data from the research, and actionable detail — and by adding any missing required sections (case study, pros & cons, actionable steps, expert insights). Do NOT repeat existing sentences or pad with fluff, and do NOT fabricate statistics. Preserve all existing headings/ids and structure. Return the COMPLETE expanded article as HTML body only.\n\nRESEARCH:\n${research.summary}\n\nCURRENT ARTICLE:\n${cleanHtml}`,
          },
        ],
        { model: MODELS.text, temperature: 0.7, maxTokens: 16000 }
      );
      const expandedClean = stripFences(expanded);
      const expandedCount = countWords(expandedClean);
      if (expandedCount > wordCount) {
        cleanHtml = expandedClean;
        wordCount = expandedCount;
      }
    } catch {
      // Keep the original draft if expansion fails.
    }
  }

  // Generate excerpt + FAQ answers in one structured call.
  const meta = await chatJSON<{ excerpt: string; faqs: FAQ[] }>([
    {
      role: "system",
      content: "You write concise SEO metadata and FAQ answers grounded in an article.",
    },
    {
      role: "user",
      content: `Based on this article, produce:
1. An excerpt: 1-2 sentences (<= 200 chars) that summarize the value.
2. Answers to these FAQ questions (2-4 sentences each), accurate to the article:
${(plan.faqTopics.length ? plan.faqTopics : ["What is this about?"]).map((q) => `- ${q}`).join("\n")}

Article (truncated):
${cleanHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 9000)}

Return ONLY JSON: {"excerpt":"...","faqs":[{"question":"...","answer":"..."}]}`,
    },
  ]);

  return {
    contentHtml: cleanHtml,
    excerpt: (meta.excerpt || "").slice(0, 240),
    faqs: (meta.faqs || []).filter((f) => f.question && f.answer),
    wordCount,
  };
}

function stripFences(html: string): string {
  return html
    .trim()
    .replace(/^```(?:html)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export function countWords(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}
