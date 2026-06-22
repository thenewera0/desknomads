/**
 * Google Search Console performance ingestion.
 *
 * Authenticates with a Google service account (JWT) and pulls Search Analytics
 * by page, mapping URLs to DeskNomads articles. Results are stored as
 * PerformanceMetrics and used by the dashboard and (later) the self-learning loop.
 *
 * Setup: add the service-account email as a *user* on the Search Console
 * property (Settings → Users and permissions), and enable the
 * "Google Search Console API" in the Cloud project.
 */
import { JWT } from "google-auth-library";
import { getGscSiteUrl, getGscCredentials, EngineError } from "./config";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export interface SearchAnalyticsRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

let cachedClient: JWT | null = null;

function getClient(): JWT {
  if (cachedClient) return cachedClient;
  const { clientEmail, privateKey } = getGscCredentials();
  cachedClient = new JWT({ email: clientEmail, key: privateKey, scopes: [SCOPE] });
  return cachedClient;
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export interface QueryOptions {
  startDate: string;
  endDate: string;
  dimensions?: ("page" | "query" | "date" | "country" | "device")[];
  rowLimit?: number;
}

/** Run a Search Analytics query against the configured property. */
export async function querySearchAnalytics(opts: QueryOptions): Promise<SearchAnalyticsRow[]> {
  const siteUrl = getGscSiteUrl();
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    siteUrl
  )}/searchAnalytics/query`;

  try {
    const res = await getClient().request<{ rows?: SearchAnalyticsRow[] }>({
      url,
      method: "POST",
      data: {
        startDate: opts.startDate,
        endDate: opts.endDate,
        dimensions: opts.dimensions || ["page"],
        rowLimit: opts.rowLimit ?? 1000,
      },
    });
    return res.data.rows || [];
  } catch (err: unknown) {
    const e = err as { response?: { data?: unknown }; message?: string };
    const detail = e.response?.data ? JSON.stringify(e.response.data).slice(0, 400) : e.message;
    throw new EngineError("search-console.query", `GSC query failed: ${detail}`);
  }
}

/** Default reporting window: 28 days ending 3 days ago (GSC data lag). */
export function defaultWindow(days = 28): { startDate: string; endDate: string } {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days);
  return { startDate: fmtDate(start), endDate: fmtDate(end), days } as { startDate: string; endDate: string };
}

/** Turn a full result URL into a site-relative slug (no leading slash). */
export function urlToSlug(pageUrl: string, siteUrl: string): string {
  try {
    const base = siteUrl.startsWith("sc-domain:") ? "" : siteUrl.replace(/\/+$/, "");
    let path = base && pageUrl.startsWith(base) ? pageUrl.slice(base.length) : new URL(pageUrl).pathname;
    path = path.replace(/^\/+/, "").replace(/\/+$/, "").split(/[?#]/)[0];
    return path;
  } catch {
    return "";
  }
}
