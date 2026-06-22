"use client";

import { CheckCircle, Warning, XCircle, ArrowUpRight } from "@phosphor-icons/react";

// Demo SEO data
const seoScores = [
  { slug: "chatgpt-vs-claude-vs-gemini-comparison", title: "ChatGPT vs Claude vs Gemini", seoScore: 92, readability: 85, issues: [] },
  { slug: "remote-jobs-100k-no-degree", title: "15 Remote Jobs Paying $100K+", seoScore: 88, readability: 82, issues: ["Missing alt text on 1 image"] },
  { slug: "passive-income-streams-ai-tools", title: "7 Passive Income Streams Using AI", seoScore: 95, readability: 90, issues: [] },
  { slug: "notion-ai-productivity-guide", title: "Notion AI for Productivity", seoScore: 65, readability: 78, issues: ["Meta description too short", "Missing FAQ schema", "No internal links"] },
  { slug: "digital-product-empire-guide", title: "Building a Digital Product Empire", seoScore: 72, readability: 80, issues: ["Title tag too long (72 chars)", "Missing alt text on 3 images"] },
];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "var(--dn-success)" : score >= 60 ? "var(--dn-warning)" : "var(--dn-danger)";
  const bg = score >= 80 ? "rgba(34,197,94,0.1)" : score >= 60 ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)";
  return (
    <span
      className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold"
      style={{ background: bg, color }}
    >
      {score}
    </span>
  );
}

export default function SEOPage() {
  const avgScore = Math.round(seoScores.reduce((acc, s) => acc + s.seoScore, 0) / seoScores.length);
  const issueCount = seoScores.reduce((acc, s) => acc + s.issues.length, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">SEO Dashboard</h1>
        <p className="text-sm text-[var(--dn-text-muted)] mt-1">Monitor and optimize your content for search engines</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)]">
          <div className="text-3xl font-bold text-white">{avgScore}</div>
          <p className="text-[12px] text-[var(--dn-text-muted)] mt-1">Avg. SEO Score</p>
        </div>
        <div className="p-5 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)]">
          <div className="text-3xl font-bold text-white">{seoScores.filter((s) => s.seoScore >= 80).length}/{seoScores.length}</div>
          <p className="text-[12px] text-[var(--dn-success)] mt-1">Articles with good SEO</p>
        </div>
        <div className="p-5 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)]">
          <div className="text-3xl font-bold text-white">{issueCount}</div>
          <p className="text-[12px] text-[var(--dn-warning)] mt-1">Open Issues</p>
        </div>
      </div>

      {/* Article SEO Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white">Article SEO Scores</h2>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {seoScores.map((article) => (
            <div key={article.slug} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <ScoreBadge score={article.seoScore} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white truncate">{article.title}</p>
                  <p className="text-[11px] text-[var(--dn-text-muted)] mt-0.5">
                    Readability: {article.readability}/100
                  </p>
                </div>
                {article.issues.length === 0 ? (
                  <span className="flex items-center gap-1 text-[11px] text-[var(--dn-success)]">
                    <CheckCircle size={13} weight="fill" />
                    No issues
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-[var(--dn-warning)]">
                    <Warning size={13} weight="fill" />
                    {article.issues.length} issue{article.issues.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {article.issues.length > 0 && (
                <div className="mt-3 ml-14 flex flex-col gap-1.5">
                  {article.issues.map((issue, i) => (
                    <p key={i} className="text-[11px] text-[var(--dn-text-muted)] flex items-center gap-1.5">
                      <XCircle size={11} className="text-[var(--dn-warning)] flex-shrink-0" />
                      {issue}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SEO Checklist */}
      <div className="mt-6 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-5">
        <h2 className="text-sm font-semibold text-white mb-4">SEO Checklist</h2>
        <div className="space-y-3">
          {[
            { label: "sitemap.xml generated", done: true },
            { label: "robots.txt configured", done: true },
            { label: "RSS feed active", done: true },
            { label: "Article Schema on all posts", done: true },
            { label: "FAQ Schema on posts with FAQs", done: true },
            { label: "Breadcrumb Schema on all posts", done: true },
            { label: "Open Graph tags on all pages", done: true },
            { label: "301 redirects from Blogger", done: true },
            { label: "Canonical URLs set", done: true },
            { label: "Google Search Console verified", done: false },
            { label: "Google Adsense approved", done: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[13px]">
              {item.done ? (
                <CheckCircle size={16} weight="fill" className="text-[var(--dn-success)] flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-white/[0.2] flex-shrink-0" />
              )}
              <span className={item.done ? "text-[var(--dn-text-secondary)]" : "text-[var(--dn-text-muted)]"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
