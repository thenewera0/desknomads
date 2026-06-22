"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MagnifyingGlass,
  Plus,
  DotsThree,
  Eye,
  PencilSimple,
  Trash,
  CalendarBlank,
  FunnelSimple,
  ArrowsDownUp,
} from "@phosphor-icons/react";

// Demo data — replace with Firestore getArticles()
const demoArticles = [
  {
    id: "1",
    title: "ChatGPT vs Claude vs Gemini: The Ultimate AI Comparison for 2025",
    slug: "chatgpt-vs-claude-vs-gemini-comparison",
    status: "published" as const,
    category: "AI Tools",
    views: 12400,
    publishedAt: "2025-06-15",
    updatedAt: "2025-06-15",
  },
  {
    id: "2",
    title: "15 Remote Jobs Paying $100K+ That Don't Require a Degree",
    slug: "remote-jobs-100k-no-degree",
    status: "published" as const,
    category: "Remote Jobs",
    views: 8900,
    publishedAt: "2025-06-12",
    updatedAt: "2025-06-13",
  },
  {
    id: "3",
    title: "How I Built 7 Passive Income Streams Using Only AI Tools",
    slug: "passive-income-streams-ai-tools",
    status: "published" as const,
    category: "Passive Income",
    views: 15200,
    publishedAt: "2025-06-10",
    updatedAt: "2025-06-10",
  },
  {
    id: "4",
    title: "The Complete Guide to Notion AI for Productivity",
    slug: "notion-ai-productivity-guide",
    status: "draft" as const,
    category: "Productivity",
    views: 0,
    publishedAt: null,
    updatedAt: "2025-06-16",
  },
  {
    id: "5",
    title: "Building a Digital Product Empire: From Idea to $10K/Month",
    slug: "digital-product-empire-guide",
    status: "scheduled" as const,
    category: "Digital Products",
    views: 0,
    publishedAt: "2025-06-20",
    updatedAt: "2025-06-14",
  },
];

const statusFilters = ["All", "Published", "Draft", "Scheduled", "Archived"];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-[var(--dn-success)]/10 text-[var(--dn-success)] border-[var(--dn-success)]/20",
    draft: "bg-white/[0.06] text-[var(--dn-text-muted)] border-white/[0.06]",
    scheduled: "bg-[var(--dn-warning)]/10 text-[var(--dn-warning)] border-[var(--dn-warning)]/20",
    archived: "bg-[var(--dn-danger)]/10 text-[var(--dn-danger)] border-[var(--dn-danger)]/20",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
}

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = demoArticles.filter((a) => {
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || a.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((a) => a.id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Articles</h1>
          <p className="text-sm text-[var(--dn-text-muted)] mt-1">
            {demoArticles.length} total articles
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="h-10 px-5 rounded-lg bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                   text-white text-sm font-medium inline-flex items-center gap-2
                   transition-all duration-300 active:scale-[0.97] w-fit"
        >
          <Plus size={16} weight="bold" />
          New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dn-text-muted)]"
          />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-[var(--dn-bg-card)] border border-white/[0.06]
                     text-sm text-white placeholder-[var(--dn-text-muted)]
                     focus:outline-none focus:border-[var(--dn-primary)] focus:ring-1 focus:ring-[var(--dn-primary)]
                     transition-all duration-300"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap
                       transition-all duration-200 ${
                         statusFilter === s
                           ? "bg-[var(--dn-primary)] text-white"
                           : "bg-white/[0.04] text-[var(--dn-text-secondary)] hover:bg-white/[0.08]"
                       }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-[var(--dn-primary)]/10 border border-[var(--dn-primary)]/20">
          <span className="text-[12px] text-[var(--dn-accent)] font-medium">
            {selectedIds.length} selected
          </span>
          <button className="text-[12px] text-[var(--dn-text-secondary)] hover:text-white transition-colors">
            Publish
          </button>
          <button className="text-[12px] text-[var(--dn-text-secondary)] hover:text-white transition-colors">
            Archive
          </button>
          <button className="text-[12px] text-[var(--dn-danger)] hover:text-white transition-colors">
            Delete
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_120px_100px_100px_48px] gap-4 px-5 py-3 border-b border-white/[0.06] text-[11px] font-semibold uppercase tracking-wider text-[var(--dn-text-muted)]">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedIds.length === filtered.length && filtered.length > 0}
              onChange={toggleAll}
              className="w-3.5 h-3.5 rounded border-white/[0.2] bg-transparent accent-[var(--dn-primary)]"
            />
          </div>
          <div>Title</div>
          <div>Status</div>
          <div className="text-right">Views</div>
          <div>Date</div>
          <div />
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-[var(--dn-text-muted)]">
            No articles found
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((article) => (
              <div
                key={article.id}
                className="grid grid-cols-[auto_1fr_120px_100px_100px_48px] gap-4 px-5 py-3.5
                         items-center hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(article.id)}
                    onChange={() => toggleSelect(article.id)}
                    className="w-3.5 h-3.5 rounded border-white/[0.2] bg-transparent accent-[var(--dn-primary)]"
                  />
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="text-[13px] font-medium text-white hover:text-[var(--dn-accent)]
                           transition-colors truncate block"
                  >
                    {article.title}
                  </Link>
                  <span className="text-[11px] text-[var(--dn-text-muted)]">{article.category}</span>
                </div>
                <div>
                  <StatusBadge status={article.status} />
                </div>
                <div className="text-right text-[12px] text-[var(--dn-text-muted)]">
                  {article.views > 0
                    ? article.views >= 1000
                      ? `${(article.views / 1000).toFixed(1)}K`
                      : article.views
                    : "—"}
                </div>
                <div className="text-[12px] text-[var(--dn-text-muted)]">
                  {article.publishedAt || article.updatedAt}
                </div>
                <div className="flex justify-end">
                  <div className="relative group">
                    <button className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--dn-text-muted)] hover:text-white hover:bg-white/[0.06] transition-all">
                      <DotsThree size={16} weight="bold" />
                    </button>
                    {/* Dropdown would go here */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
