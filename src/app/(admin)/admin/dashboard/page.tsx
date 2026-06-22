"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Article,
  Eye,
  Users,
  Wrench,
  TrendUp,
  ArrowUpRight,
  Clock,
  CalendarBlank,
} from "@phosphor-icons/react";

// Demo stats — replace with Firestore getDashboardStats()
const demoStats = {
  totalArticles: 127,
  totalViews: 89420,
  totalSubscribers: 3842,
  totalTools: 215,
};

const recentArticles = [
  {
    id: "1",
    title: "ChatGPT vs Claude vs Gemini: The Ultimate AI Comparison",
    status: "published",
    views: 12400,
    publishedAt: "2025-06-15",
  },
  {
    id: "2",
    title: "15 Remote Jobs Paying $100K+ Without a Degree",
    status: "published",
    views: 8900,
    publishedAt: "2025-06-12",
  },
  {
    id: "3",
    title: "7 Passive Income Streams Using Only AI Tools",
    status: "published",
    views: 15200,
    publishedAt: "2025-06-10",
  },
  {
    id: "4",
    title: "Top 20 Automation Tools That Save 10+ Hours Per Week",
    status: "draft",
    views: 0,
    publishedAt: null,
  },
  {
    id: "5",
    title: "Building a Digital Product Empire: Idea to $10K/Month",
    status: "scheduled",
    views: 0,
    publishedAt: "2025-06-20",
  },
];

function StatCard({
  label,
  value,
  icon: Icon,
  change,
  href,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative p-5 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)]
               hover:border-white/[0.1] hover:bg-[var(--dn-bg-card-hover)]
               transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--dn-primary)]/10 flex items-center justify-center">
          <Icon size={20} className="text-[var(--dn-accent)]" />
        </div>
        <ArrowUpRight
          size={16}
          className="text-[var(--dn-text-muted)] opacity-0 group-hover:opacity-100
                   transition-opacity duration-300"
        />
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[12px] text-[var(--dn-text-muted)]">{label}</span>
        {change && (
          <span className="text-[11px] text-[var(--dn-success)] flex items-center gap-0.5">
            <TrendUp size={11} />
            {change}
          </span>
        )}
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-[var(--dn-success)]/10 text-[var(--dn-success)]",
    draft: "bg-white/[0.06] text-[var(--dn-text-muted)]",
    scheduled: "bg-[var(--dn-warning)]/10 text-[var(--dn-warning)]",
    archived: "bg-[var(--dn-danger)]/10 text-[var(--dn-danger)]",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--dn-text-muted)] mt-1">
          Overview of your publishing platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Articles"
          value={demoStats.totalArticles.toLocaleString()}
          icon={Article}
          change="+12 this month"
          href="/admin/articles"
        />
        <StatCard
          label="Total Views"
          value={demoStats.totalViews >= 1000 ? `${(demoStats.totalViews / 1000).toFixed(1)}K` : demoStats.totalViews.toString()}
          icon={Eye}
          change="+23% vs last month"
          href="/admin/articles"
        />
        <StatCard
          label="Subscribers"
          value={demoStats.totalSubscribers.toLocaleString()}
          icon={Users}
          change="+156 this week"
          href="/admin/newsletter"
        />
        <StatCard
          label="AI Tools"
          value={demoStats.totalTools.toLocaleString()}
          icon={Wrench}
          href="/admin/settings"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
              <h2 className="text-sm font-semibold text-white">Recent Articles</h2>
              <Link
                href="/admin/articles"
                className="text-[12px] text-[var(--dn-accent)] hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="text-[13px] font-medium text-white truncate">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <StatusBadge status={article.status} />
                      {article.publishedAt && (
                        <span className="text-[11px] text-[var(--dn-text-muted)] flex items-center gap-1">
                          <CalendarBlank size={10} />
                          {article.publishedAt}
                        </span>
                      )}
                    </div>
                  </div>
                  {article.views > 0 && (
                    <span className="text-[12px] text-[var(--dn-text-muted)] flex items-center gap-1 flex-shrink-0">
                      <Eye size={12} />
                      {article.views >= 1000 ? `${(article.views / 1000).toFixed(1)}K` : article.views}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Link
                href="/admin/articles/new"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--dn-primary)]/10
                         border border-[var(--dn-primary)]/20 text-[13px] text-[var(--dn-accent)]
                         font-medium hover:bg-[var(--dn-primary)]/15 transition-all duration-200"
              >
                <Article size={16} />
                Write New Article
              </Link>
              <Link
                href="/admin/media"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.03]
                         border border-white/[0.06] text-[13px] text-[var(--dn-text-secondary)]
                         font-medium hover:bg-white/[0.06] hover:text-white transition-all duration-200"
              >
                <Wrench size={16} />
                Upload Media
              </Link>
              <Link
                href="/admin/newsletter"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.03]
                         border border-white/[0.06] text-[13px] text-[var(--dn-text-secondary)]
                         font-medium hover:bg-white/[0.06] hover:text-white transition-all duration-200"
              >
                <Users size={16} />
                Manage Subscribers
              </Link>
            </div>
          </div>

          {/* Publishing Schedule */}
          <div className="rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Upcoming</h2>
            <div className="flex flex-col gap-3">
              {recentArticles
                .filter((a) => a.status === "scheduled")
                .map((article) => (
                  <div key={article.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--dn-warning)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock size={14} className="text-[var(--dn-warning)]" />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-white line-clamp-2">
                        {article.title}
                      </p>
                      <p className="text-[11px] text-[var(--dn-text-muted)] mt-0.5">
                        Scheduled: {article.publishedAt}
                      </p>
                    </div>
                  </div>
                ))}
              {recentArticles.filter((a) => a.status === "scheduled").length === 0 && (
                <p className="text-[12px] text-[var(--dn-text-muted)]">No scheduled posts</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
