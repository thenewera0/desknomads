import { NextResponse } from "next/server";
import { getPublishedArticleBySlug } from "@/lib/firebase/server-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return new NextResponse("Story Not Found", { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://desknomads.com";
  const canonicalUrl = article.canonicalUrl || `${siteUrl}/${article.slug}`;
  const publisherLogo = `${siteUrl}/logo.png`; // Fallback logo

  const html = `<!DOCTYPE html>
<html amp lang="en">
  <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
    <title>${article.seoTitle || article.title}</title>
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <style amp-custom>
      amp-story { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      .text-bg { background-color: rgba(0, 0, 0, 0.7); padding: 24px; border-radius: 12px; margin: 24px; }
      h1 { font-size: 2.2em; font-weight: 800; color: white; line-height: 1.2; margin: 0; }
      h2 { font-size: 1.8em; font-weight: 700; color: white; line-height: 1.3; margin: 0; }
      p { font-size: 1.2em; color: rgba(255, 255, 255, 0.9); line-height: 1.5; margin-top: 16px; }
      .bottom { align-content: end; padding-bottom: 40px; }
      .center { align-content: center; justify-content: center; }
    </style>
  </head>
  <body>
    <amp-story standalone
        title="${article.seoTitle || article.title}"
        publisher="DeskNomads"
        publisher-logo-src="${publisherLogo}"
        poster-portrait-src="${article.featuredImage}">
        
      <!-- Cover Page -->
      <amp-story-page id="cover">
        <amp-story-grid-layer template="fill">
          <amp-img src="${article.featuredImage}" width="720" height="1280" layout="responsive" alt="Cover Image"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <div class="text-bg">
            <h1>${article.title}</h1>
            <p>${article.excerpt}</p>
          </div>
        </amp-story-grid-layer>
      </amp-story-page>

      ${article.toc.slice(0, 3).map((item, index) => `
      <amp-story-page id="page-${index + 1}">
        <amp-story-grid-layer template="fill">
          <!-- We reuse the featured image but add a dark overlay -->
          <amp-img src="${article.featuredImage}" width="720" height="1280" layout="responsive" alt="Background"></amp-img>
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.8);"></div>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="center">
          <div class="text-bg">
            <h2>${item.text}</h2>
            <p>Swipe up to read this section in the full article.</p>
          </div>
        </amp-story-grid-layer>
        <amp-story-page-outlink layout="nodisplay">
          <a href="${canonicalUrl}#${item.id}">Read More</a>
        </amp-story-page-outlink>
      </amp-story-page>
      `).join("")}

      <!-- Final CTA Page -->
      <amp-story-page id="cta">
        <amp-story-grid-layer template="fill">
           <div style="background-color: #0f172a; width: 100%; height: 100%;"></div>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="center">
          <div class="text-bg" style="text-align: center;">
            <h2>Read the full guide</h2>
            <p>Get all the details, tips, and insights on DeskNomads.</p>
          </div>
        </amp-story-grid-layer>
        <amp-story-page-outlink layout="nodisplay">
          <a href="${canonicalUrl}">Read Full Article</a>
        </amp-story-page-outlink>
      </amp-story-page>

    </amp-story>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Cache this at the edge for 1 hour, revalidate in background
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
