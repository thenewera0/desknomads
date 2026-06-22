"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import type { ContentOpportunity, EngineSettings, GenerationLog, PerformanceMetrics } from "@/types";
import {
  Sparkle,
  MagnifyingGlass,
  RocketLaunch,
  ArrowClockwise,
  CheckCircle,
  Warning,
  XCircle,
  Info,
  FileText,
  ChartLineUp,
} from "@phosphor-icons/react";

type Busy = null | "discover" | "publish" | string;

function scoreColor(score: number): string {
  if (score >= 80) return "var(--dn-success, #22c55e)";
  if (score >= 60) return "#eab308";
  return "var(--dn-text-muted)";
}

const statusIcon = {
  success: CheckCircle,
  error: XCircle,
  warning: Warning,
  info: Info,
} as const;

export default function AIContentCenter() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<EngineSettings | null>(null);
  const [opportunities, setOpportunities] = useState<ContentOpportunity[]>([]);
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [busy, setBusy] = useState<Busy>(null);
  const [toast, setToast] = useState<string>("");

  const authedFetch = useCallback(
    async (url: string, init: RequestInit = {}) => {
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const res = await fetch(url, {
        ...init,
        headers: {
          ...(init.headers || {}),
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.json();
    },
    [user]
  );

  const loadAll = useCallback(async () => {
    if (!user) return;
    try {
      const [s, o, l, p] = await Promise.all([
        authedFetch("/api/ai/settings"),
        authedFetch("/api/ai/opportunities?limit=100"),
        authedFetch("/api/ai/logs?limit=60"),
        authedFetch("/api/ai/performance?limit=50"),
      ]);
      if (s.settings) setSettings(s.settings);
      if (o.opportunities) setOpportunities(o.opportunities);
      if (l.logs) setLogs(l.logs);
      if (p.metrics) setMetrics(p.metrics);
    } catch (e) {
      setToast(`Load error: ${String(e)}`);
    }
  }, [user, authedFetch]);

  useEffect(() => {
    // loadAll is async; state updates occur after awaited fetches, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, [loadAll]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 6000);
  };

  const runDiscovery = async () => {
    setBusy("discover");
    try {
      const r = await authedFetch("/api/ai/discover", { method: "POST" });
      showToast(r.success ? `Discovery complete: ${r.discovered} topics, ${r.eligible} eligible (80+)` : `Failed: ${r.error}`);
      await loadAll();
    } catch (e) {
      showToast(`Error: ${String(e)}`);
    } finally {
      setBusy(null);
    }
  };

  const runPublish = async () => {
    setBusy("publish");
    try {
      const r = await authedFetch("/api/ai/publish", { method: "POST" });
      showToast(r.success ? `Publish run: ${r.published} published, ${r.review} to review, ${r.failed} failed` : `Failed: ${r.error}`);
      await loadAll();
    } catch (e) {
      showToast(`Error: ${String(e)}`);
    } finally {
      setBusy(null);
    }
  };

  const syncPerformance = async () => {
    setBusy("performance");
    try {
      const r = await authedFetch("/api/ai/performance", { method: "POST" });
      showToast(
        r.success
          ? `Search Console synced: ${r.matched} articles matched (${r.rows} rows)`
          : `Failed: ${r.error}`
      );
      await loadAll();
    } catch (e) {
      showToast(`Error: ${String(e)}`);
    } finally {
      setBusy(null);
    }
  };

  const generate = async (oppId: string, autoPublish: boolean) => {
    setBusy(oppId);
    try {
      const r = await authedFetch("/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({ opportunityId: oppId, autoPublish }),
      });
      showToast(
        r.success
          ? `${r.status === "published" ? "Published" : "Saved to review"}: ${r.slug} (${r.wordCount} words, SEO ${r.seoScore}, confidence ${r.factCheckConfidence})`
          : `Failed: ${r.error}`
      );
      await loadAll();
    } catch (e) {
      showToast(`Error: ${String(e)}`);
    } finally {
      setBusy(null);
    }
  };

  const saveSettings = async (patch: Partial<EngineSettings>) => {
    try {
      const r = await authedFetch("/api/ai/settings", { method: "POST", body: JSON.stringify(patch) });
      if (r.settings) setSettings(r.settings);
      showToast("Settings saved");
    } catch (e) {
      showToast(`Error: ${String(e)}`);
    }
  };

  const eligibleCount = opportunities.filter((o) => o.topicScore >= (settings?.minTopicScore ?? 80) && ["discovered", "queued"].includes(o.status)).length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkle size={24} weight="fill" className="text-[var(--dn-accent)]" />
            AI Content Center
          </h1>
          <p className="text-sm text-[var(--dn-text-muted)] mt-1">
            Autonomous newsroom — discover, generate, and publish SEO articles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runDiscovery}
            disabled={busy !== null}
            className="h-9 px-4 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[13px] text-white font-medium flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            <MagnifyingGlass size={16} className={busy === "discover" ? "animate-pulse" : ""} />
            {busy === "discover" ? "Scanning…" : "Run Discovery"}
          </button>
          <button
            onClick={syncPerformance}
            disabled={busy !== null}
            className="h-9 px-4 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[13px] text-white font-medium flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            <ChartLineUp size={16} className={busy === "performance" ? "animate-pulse" : ""} />
            {busy === "performance" ? "Syncing…" : "Sync Search Console"}
          </button>
          <button
            onClick={runPublish}
            disabled={busy !== null}
            className="h-9 px-4 rounded-lg bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)] text-[13px] text-white font-medium flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            <RocketLaunch size={16} className={busy === "publish" ? "animate-pulse" : ""} />
            {busy === "publish" ? "Publishing…" : "Run Publish Now"}
          </button>
        </div>
      </div>

      {toast && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-[var(--dn-primary)]/10 border border-[var(--dn-primary)]/20 text-[13px] text-white">
          {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Opportunities" value={opportunities.length} />
        <StatCard label="Eligible (80+)" value={eligibleCount} accent />
        <StatCard label="Published" value={opportunities.filter((o) => o.status === "published").length} />
        <StatCard
          label="Auto-Publish"
          value={settings?.autoPublishEnabled ? "ON" : "OFF"}
          accent={settings?.autoPublishEnabled}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Opportunities */}
        <section className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-white mb-3">Topic Opportunities</h2>
          <div className="flex flex-col gap-2">
            {opportunities.length === 0 && (
              <div className="p-6 rounded-xl border border-dashed border-white/[0.08] text-center text-[13px] text-[var(--dn-text-muted)]">
                No opportunities yet. Run Discovery to scan trending topics.
              </div>
            )}
            {opportunities.map((o) => (
              <div
                key={o.id}
                className="p-4 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[14px] text-white font-medium leading-snug">{o.title}</p>
                    <p className="text-[12px] text-[var(--dn-text-muted)] mt-1">
                      {o.category} · {o.primaryKeyword} ·{" "}
                      <span className="capitalize">{o.status}</span>
                    </p>
                  </div>
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center border"
                    style={{ borderColor: scoreColor(o.topicScore), color: scoreColor(o.topicScore) }}
                  >
                    <span className="text-[15px] font-bold leading-none">{o.topicScore}</span>
                    <span className="text-[8px] uppercase tracking-wider opacity-70">score</span>
                  </div>
                </div>
                {/* Score breakdown */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-[var(--dn-text-muted)]">
                  <span>Demand {o.scores.searchDemand}</span>
                  <span>Trend {o.scores.trendVelocity}</span>
                  <span>Comp {o.scores.lowCompetition}</span>
                  <span>Viral {o.scores.viralPotential}</span>
                  <span>Rel {o.scores.relevance}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => generate(o.id, false)}
                    disabled={busy !== null || o.status === "published"}
                    className="h-7 px-3 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-[11px] text-white flex items-center gap-1.5 disabled:opacity-40 transition-all"
                  >
                    <FileText size={13} />
                    {busy === o.id ? "Working…" : "Generate Draft"}
                  </button>
                  <button
                    onClick={() => generate(o.id, true)}
                    disabled={busy !== null || o.status === "published"}
                    className="h-7 px-3 rounded-md bg-[var(--dn-primary)]/80 hover:bg-[var(--dn-primary)] text-[11px] text-white flex items-center gap-1.5 disabled:opacity-40 transition-all"
                  >
                    <RocketLaunch size={13} />
                    Generate &amp; Publish
                  </button>
                  {o.generatedArticleId && (
                    <a
                      href={`/admin/articles`}
                      className="text-[11px] text-[var(--dn-accent)] hover:underline ml-auto"
                    >
                      View article →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right column: settings + logs */}
        <aside className="space-y-6">
          {settings && (
            <div className="p-4 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)]">
              <h2 className="text-sm font-semibold text-white mb-3">Engine Settings</h2>
              <label className="flex items-center justify-between py-2 cursor-pointer">
                <span className="text-[13px] text-[var(--dn-text-secondary)]">Auto-Publish</span>
                <button
                  onClick={() => saveSettings({ autoPublishEnabled: !settings.autoPublishEnabled })}
                  className={`relative w-10 h-5.5 rounded-full transition-colors ${settings.autoPublishEnabled ? "bg-[var(--dn-primary)]" : "bg-white/[0.12]"}`}
                  style={{ height: 22 }}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.autoPublishEnabled ? "translate-x-[18px]" : ""}`}
                  />
                </button>
              </label>
              <NumberRow
                label="Articles / day"
                value={settings.articlesPerDay}
                onSave={(v) => saveSettings({ articlesPerDay: v })}
              />
              <NumberRow
                label="Min topic score"
                value={settings.minTopicScore}
                onSave={(v) => saveSettings({ minTopicScore: v })}
              />
              <NumberRow
                label="Min fact-check"
                value={settings.minFactCheckConfidence}
                onSave={(v) => saveSettings({ minFactCheckConfidence: v })}
              />
              <NumberRow
                label="Min word count"
                value={settings.minWordCount}
                onSave={(v) => saveSettings({ minWordCount: v })}
              />
              <p className="text-[10px] text-[var(--dn-text-muted)] mt-2 leading-relaxed">
                Schedules (cron): discovery 6:00 AM IST, publish 9:00 AM IST. Auto-publish only runs when enabled.
              </p>
            </div>
          )}

          <div className="p-4 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Generation Logs</h2>
              <button onClick={loadAll} className="text-[var(--dn-text-muted)] hover:text-white">
                <ArrowClockwise size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto">
              {logs.length === 0 && (
                <p className="text-[12px] text-[var(--dn-text-muted)]">No logs yet.</p>
              )}
              {logs.map((log) => {
                const Icon = statusIcon[log.status] || Info;
                const color =
                  log.status === "success"
                    ? "#22c55e"
                    : log.status === "error"
                    ? "var(--dn-danger)"
                    : log.status === "warning"
                    ? "#eab308"
                    : "var(--dn-text-muted)";
                return (
                  <div key={log.id} className="flex items-start gap-2 text-[11px]">
                    <Icon size={13} weight="fill" style={{ color }} className="flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[var(--dn-text-muted)]">[{log.stage}]</span>{" "}
                      <span className="text-[var(--dn-text-secondary)]">{log.message}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Performance (Google Search Console) */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <ChartLineUp size={16} className="text-[var(--dn-accent)]" />
            Performance — Search Console (last 28 days)
          </h2>
          {metrics.length > 0 && (
            <span className="text-[11px] text-[var(--dn-text-muted)]">
              {metrics.length} tracked · top by impressions
            </span>
          )}
        </div>
        {metrics.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-white/[0.08] text-center text-[13px] text-[var(--dn-text-muted)]">
            No performance data yet. Click <span className="text-white">Sync Search Console</span> to
            ingest impressions, clicks, CTR, and rankings. (Requires the service account to be added
            as a user on the GSC property.)
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-[var(--dn-text-muted)] border-b border-white/[0.06]">
                  <th className="text-left font-medium px-4 py-3">Article</th>
                  <th className="text-right font-medium px-3 py-3">Impressions</th>
                  <th className="text-right font-medium px-3 py-3">Clicks</th>
                  <th className="text-right font-medium px-3 py-3">CTR</th>
                  <th className="text-right font-medium px-4 py-3">Avg. Pos.</th>
                </tr>
              </thead>
              <tbody>
                {metrics.slice(0, 25).map((m) => (
                  <tr key={m.articleId} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-4 py-2.5 text-white max-w-[340px] truncate">
                      <a href={`/${m.slug}`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--dn-accent)]">
                        {m.title || m.slug}
                      </a>
                    </td>
                    <td className="px-3 py-2.5 text-right text-[var(--dn-text-secondary)]">
                      {m.impressions.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right text-[var(--dn-text-secondary)]">
                      {m.clicks.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right text-[var(--dn-text-secondary)]">{m.ctr}%</td>
                    <td className="px-4 py-2.5 text-right text-[var(--dn-text-secondary)]">{m.avgPosition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="p-4 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)]">
      <p className="text-[11px] uppercase tracking-wider text-[var(--dn-text-muted)]">{label}</p>
      <p
        className="text-2xl font-bold mt-1"
        style={{ color: accent ? "var(--dn-accent)" : "white" }}
      >
        {value}
      </p>
    </div>
  );
}

function NumberRow({
  label,
  value,
  onSave,
}: {
  label: string;
  value: number;
  onSave: (v: number) => void;
}) {
  const [v, setV] = useState(value);
  // Re-sync local input when the saved value changes (React's adjust-on-prop pattern).
  const [prev, setPrev] = useState(value);
  if (value !== prev) {
    setPrev(value);
    setV(value);
  }
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[13px] text-[var(--dn-text-secondary)]">{label}</span>
      <input
        type="number"
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        onBlur={() => v !== value && onSave(v)}
        className="w-16 h-7 px-2 rounded-md bg-[var(--dn-bg)] border border-white/[0.08] text-[12px] text-white text-right outline-none focus:border-[var(--dn-primary)]"
      />
    </div>
  );
}
