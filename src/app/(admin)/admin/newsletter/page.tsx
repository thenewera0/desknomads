"use client";

import { useState } from "react";
import {
  Users,
  Export,
  MagnifyingGlass,
  EnvelopeSimple,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
} from "@phosphor-icons/react";

// Demo data
const demoSubscribers = [
  { id: "1", email: "john@example.com", name: "John Doe", status: "active", segments: ["AI Tools", "Remote Work"], subscribedAt: "2025-06-15" },
  { id: "2", email: "jane@example.com", name: "Jane Smith", status: "active", segments: ["Passive Income"], subscribedAt: "2025-06-14" },
  { id: "3", email: "mike@example.com", name: "", status: "active", segments: ["AI Tools"], subscribedAt: "2025-06-13" },
  { id: "4", email: "sarah@example.com", name: "Sarah Lee", status: "pending", segments: [], subscribedAt: "2025-06-12" },
  { id: "5", email: "alex@example.com", name: "Alex Chen", status: "active", segments: ["Automation"], subscribedAt: "2025-06-11" },
  { id: "6", email: "spam@test.com", name: "", status: "unsubscribed", segments: [], subscribedAt: "2025-06-01" },
];

const stats = {
  total: 3842,
  active: 3612,
  pending: 180,
  unsubscribed: 50,
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    active: { icon: CheckCircle, color: "var(--dn-success)", bg: "rgba(34,197,94,0.1)" },
    pending: { icon: Clock, color: "var(--dn-warning)", bg: "rgba(245,158,11,0.1)" },
    unsubscribed: { icon: XCircle, color: "var(--dn-danger)", bg: "rgba(239,68,68,0.1)" },
  };
  const s = styles[status] || styles.pending;
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider"
      style={{ background: s.bg, color: s.color }}
    >
      <Icon size={10} weight="fill" />
      {status}
    </span>
  );
}

export default function NewsletterPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = demoSubscribers.filter((s) => {
    const matchesSearch = !search || s.email.includes(search) || s.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Newsletter</h1>
          <p className="text-sm text-[var(--dn-text-muted)] mt-1">
            Manage subscribers and campaigns
          </p>
        </div>
        <button className="h-10 px-5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1]
                         text-white text-sm font-medium inline-flex items-center gap-2
                         transition-all duration-300 w-fit">
          <Export size={16} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total", value: stats.total, color: "var(--dn-primary)" },
          { label: "Active", value: stats.active, color: "var(--dn-success)" },
          { label: "Pending", value: stats.pending, color: "var(--dn-warning)" },
          { label: "Unsubscribed", value: stats.unsubscribed, color: "var(--dn-danger)" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)]"
          >
            <div className="text-xl font-bold text-white">{stat.value.toLocaleString()}</div>
            <div className="text-[11px] mt-1" style={{ color: stat.color }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dn-text-muted)]"
          />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-[var(--dn-bg-card)] border border-white/[0.06]
                     text-sm text-white placeholder-[var(--dn-text-muted)]
                     focus:outline-none focus:border-[var(--dn-primary)] transition-all duration-300"
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "active", "pending", "unsubscribed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-[12px] font-medium capitalize
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

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_140px_100px] gap-4 px-5 py-3 border-b border-white/[0.06]
                      text-[11px] font-semibold uppercase tracking-wider text-[var(--dn-text-muted)]">
          <div>Email</div>
          <div>Status</div>
          <div>Segments</div>
          <div>Subscribed</div>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className="grid grid-cols-[1fr_120px_140px_100px] gap-4 px-5 py-3 items-center
                       hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <p className="text-[13px] text-white flex items-center gap-1.5">
                  <EnvelopeSimple size={13} className="text-[var(--dn-text-muted)]" />
                  {sub.email}
                </p>
                {sub.name && (
                  <p className="text-[11px] text-[var(--dn-text-muted)] mt-0.5 ml-[22px]">{sub.name}</p>
                )}
              </div>
              <div><StatusBadge status={sub.status} /></div>
              <div className="flex flex-wrap gap-1">
                {sub.segments.map((seg) => (
                  <span key={seg} className="px-1.5 py-0.5 rounded text-[9px] bg-white/[0.04] text-[var(--dn-text-muted)]">
                    {seg}
                  </span>
                ))}
              </div>
              <div className="text-[12px] text-[var(--dn-text-muted)]">{sub.subscribedAt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
