# PROJECT MANIFEST

## 1. PROJECT IDENTITY
**DeskNomads** is a modern, AI-powered content platform and blog recently migrated from Blogger to a custom Next.js architecture. Its core purpose is to serve as an autonomous AI content engine that automatically discovers topics, researches via Tavily, and publishes articles via OpenRouter, while maintaining SEO equity through a robust legacy URL redirection system.

## 2. FRAMEWORKS & STACK
- **Language:** TypeScript (Node.js 22.x)
- **Frontend Framework:** Next.js 16.2.9 (App Router)
- **UI & Styling:** Tailwind CSS v4, Framer Motion, Geist Font
- **Rich Text Editor:** Tiptap
- **Backend (BaaS):** Firebase (Firestore, Storage, Auth), Firebase Admin SDK
- **AI & Integrations:** OpenRouter (LLM routing), Tavily (Research), Google Search Console API
- **Hosting / CI/CD:** Vercel (Hosting), GitHub Actions (Cron Jobs)

## 3. CORE ARCHITECTURE
- **Directory Tree Structure:**
  - `app/`: Next.js App Router containing pages and API routes.
  - `components/`: React UI components.
  - `lib/`: Shared utilities and data fetching logic.
  - `scripts/`: Local utility scripts for blogger importing, redirect building, and testing engine integrations (e.g., `cron.ts`, `import-blogger.ts`).
  - `src/proxy.ts`: Next.js middleware responsible for seamlessly 301-redirecting legacy Blogger URLs (`/YYYY/MM/slug.html`) to clean Next.js slugs.
- **Primary API / Core Engine:** 
  - The autonomous content engine logic isn't bound to Vercel's serverless functions due to execution time limits; instead, it runs externally as scheduled scripts against the Firestore database.

## 4. ACTIVE AUTOMATIONS
- **GitHub Actions (Cron Jobs):** The site runs a fully autonomous AI content engine managed by GitHub Actions:
  - **Discovery:** Runs daily at 6:00 AM IST to find new topics/opportunities.
  - **Publish:** Runs daily at 9:00 AM IST to generate and publish articles.
  - **Performance:** Runs daily at 9:30 AM IST to pull Google Search Console metrics.
- **No Local Next.js Cron:** Automations run entirely through GitHub Actions invoking the local `scripts/cron.ts` to bypass Vercel serverless timeouts.

## 5. UPGRADE LOG & FUTURE TODOS
- **Recent Upgrades:**
  - Full migration from Blogger (`desknomads.blogspot.com`) to Vercel (`desknomads.shop`), complete with a dedicated middleware (`src/proxy.ts`) to preserve SEO rankings via 301 redirects.
  - Implemented the autonomous AI content engine powered by OpenRouter and Tavily.
- **Future Todos & Refactoring:**
  - **AdSense Approval:** Wait for Google AdSense site approval and configure the ad slots.
  - **SEO Monitoring:** Monitor the transition in Google Search Console, ensuring the new `sitemap.xml` gets indexed properly.
  - **Engine Validation:** Manually run the "Publish" workflow to verify the end-to-end capabilities of the newly deployed content engine.
