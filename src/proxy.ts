import { NextRequest, NextResponse } from "next/server";

// Static redirect map for Blogger migration
// Format: old Blogger path → new DeskNomads path
const staticRedirects: Record<string, string> = {
  // Add Blogger redirects here after migration
  // "/2024/01/ai-tools-for-beginners.html": "/ai-tools-for-beginners",
  // "/p/about.html": "/about",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Blogger URL Redirect (.html suffix) ──────────────────────
  if (pathname.endsWith(".html")) {
    // Check static redirect map first
    const staticTarget = staticRedirects[pathname];
    if (staticTarget) {
      return NextResponse.redirect(new URL(staticTarget, request.url), 301);
    }

    // Fallback: strip .html and Blogger date prefix pattern
    // /2024/01/some-article.html → /some-article
    const bloggerPattern = /^\/\d{4}\/\d{2}\/(.+)\.html$/;
    const match = pathname.match(bloggerPattern);
    if (match) {
      return NextResponse.redirect(new URL(`/${match[1]}`, request.url), 301);
    }

    // Simple .html strip: /some-page.html → /some-page
    const stripped = pathname.replace(/\.html$/, "");
    if (stripped !== pathname) {
      return NextResponse.redirect(new URL(stripped, request.url), 301);
    }
  }

  // ─── Blogger page redirects (/p/page-name.html) ──────────────
  if (pathname.startsWith("/p/")) {
    const pageName = pathname.replace(/^\/p\//, "").replace(/\.html$/, "");
    const pageMap: Record<string, string> = {
      about: "/about",
      contact: "/contact",
      privacy: "/privacy",
      "privacy-policy": "/privacy",
      terms: "/terms",
      "terms-and-conditions": "/terms",
    };
    const target = pageMap[pageName];
    if (target) {
      return NextResponse.redirect(new URL(target, request.url), 301);
    }
  }

  // ─── Trailing slash normalization ─────────────────────────────
  if (pathname !== "/" && pathname.endsWith("/")) {
    return NextResponse.redirect(
      new URL(pathname.slice(0, -1), request.url),
      308
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match .html paths (Blogger URLs)
    "/(.*)\\.html",
    // Match /p/ paths (Blogger pages)
    "/p/:path*",
    // Match paths with trailing slashes (except root)
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..*).*)/",
  ],
};
