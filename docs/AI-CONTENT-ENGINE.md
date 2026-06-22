# DeskNomads AI Autonomous Content Engine

An autonomous newsroom that discovers trending topics, scores them, researches,
writes 2,500–4,000 word SEO articles, generates featured images, optimizes SEO &
schema, inserts internal links + AdSense slots, fact-checks, and publishes — with
an admin control panel and a full failsafe path.

## Daily schedule (Vercel Cron, UTC ↔ IST)

| Job                      | Route                 | IST       | UTC (cron)      |
| ------------------------ | --------------------- | --------- | --------------- |
| Content discovery        | `/api/ai/discover`    | 6:00 AM   | `30 0 * * *`    |
| Generate + auto-publish  | `/api/ai/publish`     | 9:00 AM   | `30 3 * * *`    |
| Search Console ingestion | `/api/ai/performance` | 9:30 AM   | `0 4 * * *`     |

Runs via **GitHub Actions** ([`.github/workflows/`](../.github/workflows/)) so
generation isn't bound by serverless time limits — see [`.github/SECRETS.md`](../.github/SECRETS.md)
and [`DEPLOY.md`](../DEPLOY.md). The secured API routes (`/api/ai/*`) still work for
manual/admin triggers, authorized via `Authorization: Bearer $CRON_SECRET`.

## Setup

1. Add keys to `.env.local` (see `.env.example`):
   - `OPENROUTER_API_KEY` — text (`google/gemini-3-flash-preview`) + image (`google/gemini-3.1-flash-image`)
   - `TAVILY_API_KEY` — research + trend discovery
   - `CRON_SECRET` — long random string protecting the cron routes
2. Deploy to Vercel (Pro plan recommended — generation routes set `maxDuration = 300`).
3. Open **Admin → AI Content Center** (`/admin/ai`), then:
   - Click **Run Discovery** to populate topic opportunities.
   - Toggle **Auto-Publish ON** when you're ready for the 9 AM cron to publish.

> Auto-publish defaults to **OFF** as a safety measure. Until enabled, the daily
> publish cron logs and exits without publishing.

## Pipeline stages (`src/lib/ai/`)

| File                | Responsibility |
| ------------------- | -------------- |
| `trends.ts`         | Opportunity Scanner — Hacker News, Reddit, Google Trends, Tavily news → LLM synthesis |
| `scoring.ts`        | Topic Score /100 (Demand 30% · Trend 20% · Competition 15% · Viral 15% · Relevance 20%); ≥80 eligible |
| `research.ts`       | Tavily research → sources, statistics, expert insights |
| `planner.ts`        | SEO title, slug, keywords, intent, angle, meta, FAQ topics, outline |
| `writer.ts`         | 2,500–4,000 word structured HTML article + excerpt + FAQ answers |
| `seo.ts`            | Heading IDs, TOC, keyword density, SEO/readability scores, JSON-LD schema |
| `internal-links.ts` | 3–8 contextual internal links (same category / keyword cluster) |
| `ads.ts`            | In-article AdSense slots (after P3, mid, before conclusion), lazy-loaded |
| `images.ts`         | 16:9 editorial hero via OpenRouter image model → Firebase Storage + media library |
| `factcheck.ts`      | URL liveness + LLM claim verification → confidence (≥85 to auto-publish) |
| `pipeline.ts`       | Orchestrates discovery, single-article generation, and the daily run |
| `store.ts`          | Firestore (Admin SDK): opportunities, logs, settings, articles |

## Failsafe

If any required stage fails (or fact-check < threshold, or no image), the article
is **saved as a draft (review queue)** instead of being published. Every stage
writes to the `generationLogs` collection (visible in the admin panel). One
article failing never aborts the rest of the daily run.

## Firestore collections added

- `opportunities` — discovered + scored topics
- `generationLogs` — per-stage audit trail
- `settings/engine` — engine configuration (editable in admin)
- `media` — generated featured images
- (existing) `articles`, `categories`, `authors`

## Admin API (Bearer = Firebase ID token of a signed-in admin)

| Method | Route                       | Purpose |
| ------ | --------------------------- | ------- |
| POST   | `/api/ai/discover`          | Run discovery now |
| POST   | `/api/ai/publish`           | Run the daily publish now |
| POST   | `/api/ai/generate`          | Generate one article `{opportunityId, autoPublish}` |
| GET    | `/api/ai/opportunities`     | List opportunities |
| GET    | `/api/ai/logs`              | Generation logs |
| GET/POST | `/api/ai/settings`        | Read / update engine settings |
| POST   | `/api/ai/regenerate-image`  | Regenerate an article's featured image |
| GET/POST | `/api/ai/performance`     | Read metrics / ingest Search Console |

## Search Console performance ingestion

Pulls Search Analytics (impressions, clicks, CTR, average position) per page,
maps each URL to its article by slug, and stores a snapshot in the `performance`
collection. Visible in the admin panel ("Performance — Search Console") and via
**Sync Search Console**; also runs daily by cron.

Setup:
1. Set `GSC_SITE_URL` to the exact verified property (URL-prefix `https://desknomads.com/`
   or domain `sc-domain:desknomads.com`).
2. Enable the **Google Search Console API** in the Cloud project.
3. In Search Console → Settings → **Users and permissions**, add the service-account
   email (`FIREBASE_CLIENT_EMAIL`, or a dedicated `GSC_CLIENT_EMAIL`) as a user.
4. Auth uses a service-account JWT (`google-auth-library`); no OAuth consent flow.

Data lags ~2–3 days, so the default window is the 28 days ending 3 days ago.
`getTopPerformers()` exposes the ranked results for the self-learning loop.

## Roadmap (stubbed for a later pass)

- Weekly self-learning loop that feeds `getTopPerformers()` signals back into topic selection.
- GA4 ingestion for `traffic`, `bounceRate`, `avgTimeOnPage` (Search Console covers
  impressions/clicks/CTR/position; these three are currently 0 / clicks-as-proxy).
- WebP/responsive image transforms (currently stored in the model's native format).
