import { NextRequest, NextResponse } from "next/server";
import { bloggerRedirects } from "@/lib/blogger-redirects";

/**
 * Blogger & Legacy Domain → DeskNomads Migration Redirect System.
 *
 * Permanently (301) maps every legacy URL shape and old domain so
 * search rankings and backlinks transfer to desknomads.store:
 *   - old domain (desknomads.shop / www.desknomads.shop → www.desknomads.store)
 *   - apex canonicalization (desknomads.store → www.desknomads.store)
 *   - exact post map (generated from imported articles)
 *   - dated post fallback   /YYYY/MM/slug.html → /slug
 *   - static pages          /p/name.html       → /name (or mapped)
 *   - label archives        /search/label/Name → /category/slug
 *   - date archives         /YYYY/MM[/]         → /
 *   - feeds                 /feeds/...          → /feed.xml
 *   - any leftover .html, Blogger ?m=1 mobile param, trailing slashes
 *
 * Note: this runs on the new site (desknomads.store). Redirecting the
 * desknomads.blogspot.com host itself is a Blogger-level setting — see DEPLOY.md.
 */

// Merged/duplicate articles → canonical article (301). Keeps SEO equity on one URL.
const mergeRedirects: Record<string, string> = {
  "/claude-code-vs-codex-cloud-ide-future": "/claude-code-vs-codex-cloud-ai-coding-frav",
  "/agentic-ide-superset-claude-code-vs-code": "/claude-code-vs-codex-cloud-ai-coding-frav",
};

// Blogger label → our category slug (handles name mismatches)
const labelAliases: Record<string, string> = {
  "side hustle": "side-hustles",
  "side hustles": "side-hustles",
  "ai tool": "ai-tools",
  "ai tools": "ai-tools",
  "remote job": "remote-jobs",
  "remote jobs": "remote-jobs",
  "work from home": "work-from-home",
  "passive income": "passive-income",
  productivity: "productivity",
  automation: "automation",
  freelancing: "freelancing",
  freelance: "freelancing",
  "digital products": "digital-products",
  startups: "startups",
  "online income": "online-income",
  "future careers": "future-careers",
  chatgpt: "chatgpt",
  claude: "claude",
  gemini: "gemini",
  "ai agents": "ai-agents",
};

function categoryFromLabel(raw: string): string {
  const decoded = decodeURIComponent(raw).replace(/\+/g, " ").trim();
  const key = decoded.toLowerCase();
  return (
    labelAliases[key] ||
    decoded.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const to = (target: string, code: 301 | 308 = 301) =>
    NextResponse.redirect(new URL(target, request.url), code);

  // -1. Canonical host: send legacy domain and bare apex → www.desknomads.store for PAGES only.
  // Static files (ads.txt, robots.txt, sitemap.xml, feed.xml) are excluded by the matcher, so
  // they serve directly on the apex — letting AdSense fetch desknomads.store/ads.txt
  // with a 200 instead of a redirect.
  const host = (request.headers.get("host") || request.nextUrl.host).toLowerCase();
  if (host.includes("desknomads.shop")) {
    return NextResponse.redirect(
      new URL(pathname + request.nextUrl.search, "https://www.desknomads.store"),
      301
    );
  }
  if (host === "desknomads.store") {
    return NextResponse.redirect(
      new URL(pathname + request.nextUrl.search, "https://www.desknomads.store"),
      301
    );
  }

  // 0. Merged duplicate articles → canonical (301)
  const merged = mergeRedirects[pathname];
  if (merged) return to(merged);

  // 1. Exact Blogger post map (most reliable; generated from imported articles)
  const exact = bloggerRedirects[pathname];
  if (exact) return to(exact);

  // 2. Dated Blogger post fallback: /YYYY/MM/slug.html → /slug
  const post = pathname.match(/^\/\d{4}\/\d{2}\/(.+)\.html$/);
  if (post) return to(`/${post[1]}`);

  // 3. Blogger static pages: /p/name.html → mapped page (or /name)
  if (pathname.startsWith("/p/")) {
    const name = pathname.replace(/^\/p\//, "").replace(/\.html$/, "");
    const pageMap: Record<string, string> = {
      about: "/about",
      contact: "/contact",
      privacy: "/privacy",
      "privacy-policy": "/privacy",
      terms: "/terms",
      "terms-and-conditions": "/terms",
      disclaimer: "/disclaimer",
    };
    return to(pageMap[name] || `/${name}`);
  }

  // 4. Blogger label archives: /search/label/Name → /category/slug
  if (pathname.startsWith("/search/label/")) {
    const label = pathname.replace(/^\/search\/label\//, "").replace(/\/$/, "");
    return to(`/category/${categoryFromLabel(label)}`);
  }

  // 5. Blogger date archives: /YYYY or /YYYY/MM (no .html) → home
  if (/^\/\d{4}(\/\d{2})?\/?$/.test(pathname)) return to("/");

  // 6. Blogger feeds: /feeds/... → RSS
  if (pathname.startsWith("/feeds/")) return to("/feed.xml");

  // 7. Any leftover .html → strip the suffix
  if (pathname.endsWith(".html")) return to(pathname.replace(/\.html$/, ""));

  // 8. Strip Blogger mobile parameter (?m=1) to avoid duplicate URLs
  if (searchParams.has("m")) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("m");
    return NextResponse.redirect(url, 301);
  }

  // 9. Trailing-slash normalization (except root)
  if (pathname !== "/" && pathname.endsWith("/")) {
    return to(pathname.slice(0, -1), 308);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except API, Next internals, and static asset files.
  // (.html is intentionally NOT excluded so legacy Blogger post URLs are caught.)
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpe?g|gif|svg|ico|webp|avif|txt|xml|js|css|woff2?|map)).*)",
  ],
};
