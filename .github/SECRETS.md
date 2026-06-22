# GitHub Actions — Secrets Checklist

The autonomous content engine runs in GitHub Actions (free), so it isn't limited
by Vercel's serverless timeout. Add the secrets below, then the workflows run on
schedule automatically.

## Where to add secrets
GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**.
Add each name below with the value from your local `.env.local`.

## Required secrets

| Secret | Value (from `.env.local`) | Used by |
| ------ | -------------------------- | ------- |
| `FIREBASE_PROJECT_ID` | `desknomads` | all |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-…@desknomads.iam.gserviceaccount.com` | all |
| `FIREBASE_PRIVATE_KEY` | the full key **including the `\n` sequences** (copy the value between the quotes, without the quotes) | all |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `desknomads.firebasestorage.app` | publish (image upload) |
| `OPENROUTER_API_KEY` | your OpenRouter key | discover, publish |
| `TAVILY_API_KEY` | your Tavily key | discover, publish |
| `NEXT_PUBLIC_SITE_URL` | `https://desknomads.shop` | all (canonical URLs) |
| `NEXT_PUBLIC_SITE_NAME` | `DeskNomads` | publish |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | `pub-1562600430581360` | publish (ad slots) |
| `GSC_SITE_URL` | `sc-domain:desknomads.shop` | performance |

## Optional secrets (performance workflow)
Only needed if you use a **separate** service account for Search Console. If
omitted, it falls back to the Firebase admin credentials above.

| Secret | Notes |
| ------ | ----- |
| `GSC_CLIENT_EMAIL` | defaults to `FIREBASE_CLIENT_EMAIL` |
| `GSC_PRIVATE_KEY` | defaults to `FIREBASE_PRIVATE_KEY` |

## Schedules (UTC ↔ IST)

| Workflow | File | IST | Cron (UTC) |
| -------- | ---- | --- | ---------- |
| Discovery | `discover.yml` | 6:00 AM | `30 0 * * *` |
| Publish | `publish.yml` | 9:00 AM | `30 3 * * *` |
| Performance | `performance.yml` | 9:30 AM | `0 4 * * *` |

> Auto-publish also requires `autoPublishEnabled: true` in the engine settings
> (Admin → AI Content Center). It's already enabled.

## Manual runs
Every workflow has **`workflow_dispatch`** — trigger any of them on demand from
the repo's **Actions** tab → select the workflow → **Run workflow**.

## Notes
- The repo root must be the `desknomads/` app folder (where `package.json` lives),
  so `.github/` sits at the repo root. `git init` inside `desknomads/`.
- `.env.local` is gitignored and never committed — all config lives in Secrets.
- This is independent of Vercel: keep Vercel on the free **Hobby** plan; it only
  serves the site. You can remove the `crons` block from `vercel.json` if you
  rely solely on GitHub Actions (optional).
