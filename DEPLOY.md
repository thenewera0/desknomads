# DeskNomads — Deploy Guide

The stack: **Vercel** serves the Next.js site (free Hobby plan is fine), **GitHub
Actions** runs the autonomous content engine on schedule, and **Firebase**
(Firestore + Storage + Auth) is the database. AI via **OpenRouter**, research via
**Tavily**, metrics via **Google Search Console**.

## 1. Push to GitHub
The repo root is this `desknomads/` folder (where `package.json` lives).

```bash
git init
git add .
git commit -m "DeskNomads site + autonomous AI content engine"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

`.env.local` is gitignored — no secrets are committed. `.env.example` is the
template.

## 2. Deploy to Vercel (hosting)
1. [vercel.com](https://vercel.com) → **Add New → Project** → import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected). Root directory: repo root.
3. **Environment Variables** — add everything from `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_*` (7), `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
   - `NEXT_PUBLIC_SITE_URL=https://desknomads.shop`, `NEXT_PUBLIC_SITE_NAME=DeskNomads`
   - `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`, `NEXT_PUBLIC_ADSENSE_SLOT` (when you have it)
   - `OPENROUTER_API_KEY`, `TAVILY_API_KEY`, `CRON_SECRET`
   - `GSC_SITE_URL`, `GSC_CLIENT_EMAIL` (optional)
   - For `FIREBASE_PRIVATE_KEY`, paste the value **with `\n` sequences** (as in `.env.local`).
4. **Deploy.**
5. **Domain:** Project → Settings → Domains → add `desknomads.shop` and `www.desknomads.shop`, and update DNS at your registrar as Vercel instructs. *(This moves the domain off Blogger onto the new site — your old `/YYYY/MM/slug.html` URLs auto-301 to the new slugs.)*

> The content engine does **not** run on Vercel (article generation exceeds
> Hobby's 60s function limit). It runs in GitHub Actions — see below.

## 3. Enable the content engine (GitHub Actions)
1. Add the repository secrets listed in [`.github/SECRETS.md`](.github/SECRETS.md).
2. Workflows then run automatically:
   - **Discovery** 6:00 AM IST · **Publish** 9:00 AM IST · **Performance** 9:30 AM IST.
3. Trigger any manually from the repo's **Actions** tab → **Run workflow**.
4. Auto-publish is already enabled (`settings/engine.autoPublishEnabled = true`).

## 4. Post-deploy checklist
- [ ] Site loads at `https://desknomads.shop` with articles + tools.
- [ ] Old Blogger URL redirects (e.g. `/2026/05/…html` → `/…`).
- [ ] Admin login works at `/admin/login` (enable Email/Password in Firebase Auth).
- [ ] `https://desknomads.shop/ads.txt` returns the publisher line.
- [ ] Submit `https://desknomads.shop/sitemap.xml` in Google Search Console.
- [ ] AdSense: add the site in AdSense + get it approved (ads stay blank until then).
- [ ] Run the **Publish** workflow once manually to confirm the engine end-to-end.

## Useful local scripts (`node --env-file=.env.local scripts/<file>`)
- `test-engine.mjs` — verify OpenRouter + Tavily keys/models
- `test-gsc.mjs` — verify Search Console access
- `import-blogger-feed.mjs` — re-import Blogger posts
- `cron.ts` — `npx tsx scripts/cron.ts discover|publish|performance`
