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
   - `NEXT_PUBLIC_SITE_URL=https://www.desknomads.shop`, `NEXT_PUBLIC_SITE_NAME=DeskNomads`
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
- [ ] Site loads at `https://www.desknomads.shop` with articles + tools.
- [ ] Old Blogger URL redirects (e.g. `/2026/05/…html` → `/…`).
- [ ] Admin login works at `/admin/login` (enable Email/Password in Firebase Auth).
- [ ] `https://www.desknomads.shop/ads.txt` returns the publisher line.
- [ ] Submit `https://www.desknomads.shop/sitemap.xml` in Google Search Console.
- [ ] AdSense: add the site in AdSense + get it approved (ads stay blank until then).
- [ ] Run the **Publish** workflow once manually to confirm the engine end-to-end.

## Blogger migration & redirects (SEO preservation)
All legacy Blogger URLs are 301-redirected to the new pages by the middleware
([`src/proxy.ts`](src/proxy.ts)), so rankings/backlinks transfer:

| Old Blogger URL | Redirects to |
| --- | --- |
| `/2026/05/slug.html` (+ exact map of all imported posts) | `/slug` |
| `/p/about.html` | `/about` (mapped pages) |
| `/search/label/AI%20Tools` | `/category/ai-tools` |
| `/2025/07/` , `/2025/` (date archives) | `/` |
| `/feeds/...` | `/feed.xml` |
| any `?m=1` (Blogger mobile) | clean URL |

The exact post map is generated from the imported articles:
`node --env-file=.env.local scripts/build-blogger-redirects.mjs` → `src/lib/blogger-redirects.ts`
(re-run it whenever you re-import). These all run on **desknomads.shop**.

### Redirecting `desknomads.blogspot.com` → `desknomads.shop`
The `.blogspot.com` host is served by Google, so our app can't 301 it directly.
After you move `desknomads.shop` off Blogger onto Vercel, add this to the Blogger
theme (**Blogger → Theme → Edit HTML**, immediately after `<head>`):

```html
<script>/*<![CDATA[*/
(function(){
  if (location.hostname.indexOf("blogspot.com") > -1) {
    location.replace("https://www.desknomads.shop" + location.pathname + location.search + location.hash);
  }
})();
/*]]>*/</script>
```

This forwards every `blogspot.com` visit to the same path on `desknomads.shop`,
where the middleware finishes the 301 to the correct new page. (Keep the Blogger
blog published so the redirect script keeps serving.)

## Useful local scripts (`node --env-file=.env.local scripts/<file>`)
- `test-engine.mjs` — verify OpenRouter + Tavily keys/models
- `test-gsc.mjs` — verify Search Console access
- `import-blogger-feed.mjs` — re-import Blogger posts
- `cron.ts` — `npx tsx scripts/cron.ts discover|publish|performance`
