import { NextResponse } from "next/server";
import { getPublishedArticleBySlug } from "@/lib/firebase/server-data";

export const dynamic = "force-dynamic";

function escapeXml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  let article = null;
  try {
    article = await getPublishedArticleBySlug(slug);
  } catch (err) {
    console.error(`Failed to fetch story for slug ${slug}:`, err);
    return new NextResponse("Service Unavailable", { status: 503 });
  }

  if (!article) {
    return new NextResponse("Story Not Found", { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.desknomads.store";
  const canonicalUrl = article.canonicalUrl || `${siteUrl}/${article.slug}`;
  const storyUrl = `${siteUrl}/stories/${article.slug}`;
  const publisherLogo = `${siteUrl}/logo.png`;
  const featuredImg = article.featuredImage || `${siteUrl}/og-image.png`;

  // Prepare slides from TOC or content paragraphs
  let slides: { title: string; desc: string; id: string }[] = [];

  if (article.toc && article.toc.length > 0) {
    slides = article.toc.slice(0, 5).map((item, idx) => ({
      title: item.text,
      desc: "Tap or swipe up to read this complete section in the main guide.",
      id: item.id || `section-${idx + 1}`,
    }));
  } else {
    // Fallback: extract key paragraphs from body
    const plainText = stripHtml(article.content);
    const sentences = plainText.split(/(?<=[.!?])\s+/).filter(Boolean);

    if (sentences.length >= 3) {
      const chunkSize = Math.ceil(sentences.length / 3);
      for (let i = 0; i < 3; i++) {
        const slice = sentences.slice(i * chunkSize, (i + 1) * chunkSize).join(" ");
        slides.push({
          title: `Key Insight ${i + 1}`,
          desc: slice.length > 180 ? slice.slice(0, 185) + "..." : slice,
          id: `insight-${i + 1}`,
        });
      }
    } else {
      slides.push({
        title: article.title,
        desc: article.excerpt || "Read the full guide on DeskNomads.",
        id: "key-takeaway",
      });
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": storyUrl,
    },
    "headline": article.seoTitle || article.title,
    "image": [featuredImg],
    "datePublished": article.publishedAt || article.createdAt,
    "dateModified": article.updatedAt || article.createdAt,
    "author": {
      "@type": "Organization",
      "name": "DeskNomads",
      "url": siteUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": "DeskNomads",
      "logo": {
        "@type": "ImageObject",
        "url": publisherLogo,
      },
    },
    "description": article.seoDescription || article.excerpt,
  };

  const html = `<!DOCTYPE html>
<html amp lang="en">
  <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
    <title>${escapeXml(article.seoTitle || article.title)}</title>
    <link rel="canonical" href="${escapeXml(canonicalUrl)}">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <script type="application/ld+json">
      ${JSON.stringify(jsonLd)}
    </script>
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <style amp-custom>
      amp-story { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      .text-bg { background-color: rgba(5, 5, 5, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.12); padding: 24px; border-radius: 16px; margin: 20px; }
      .badge { display: inline-block; background-color: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px; }
      h1 { font-size: 2.1em; font-weight: 800; color: #ffffff; line-height: 1.25; margin: 0; }
      h2 { font-size: 1.7em; font-weight: 700; color: #ffffff; line-height: 1.3; margin: 0; }
      p { font-size: 1.1em; color: rgba(255, 255, 255, 0.85); line-height: 1.5; margin-top: 12px; }
      .bottom { align-content: end; padding-bottom: 48px; }
      .center { align-content: center; justify-content: center; }
    </style>
  </head>
  <body>
    <amp-story standalone
        title="${escapeXml(article.seoTitle || article.title)}"
        publisher="DeskNomads"
        publisher-logo-src="${escapeXml(publisherLogo)}"
        poster-portrait-src="${escapeXml(featuredImg)}"
        poster-square-src="${escapeXml(featuredImg)}"
        poster-landscape-src="${escapeXml(featuredImg)}">
        
      <!-- Cover Page -->
      <amp-story-page id="cover">
        <amp-story-grid-layer template="fill">
          <amp-img src="${escapeXml(featuredImg)}" width="720" height="1280" layout="responsive" alt="Cover Image"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <div class="text-bg">
            <span class="badge">${escapeXml(article.category?.name || "Web Story")}</span>
            <h1>${escapeXml(article.title)}</h1>
            <p>${escapeXml(article.excerpt)}</p>
          </div>
        </amp-story-grid-layer>
      </amp-story-page>

      ${slides.map((item, index) => `
      <amp-story-page id="slide-${index + 1}">
        <amp-story-grid-layer template="fill">
          <amp-img src="${escapeXml(featuredImg)}" width="720" height="1280" layout="responsive" alt="Background"></amp-img>
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(5,5,5,0.7), rgba(5,5,5,0.95));"></div>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="center">
          <div class="text-bg">
            <span class="badge">Part ${index + 1} of ${slides.length}</span>
            <h2>${escapeXml(item.title)}</h2>
            <p>${escapeXml(item.desc)}</p>
          </div>
        </amp-story-grid-layer>
        <amp-story-page-outlink layout="nodisplay">
          <a href="${escapeXml(canonicalUrl)}${item.id ? `#${item.id}` : ""}">Read Full Guide</a>
        </amp-story-page-outlink>
      </amp-story-page>
      `).join("")}

      <!-- Final CTA Page -->
      <amp-story-page id="cta">
        <amp-story-grid-layer template="fill">
           <div style="background: radial-gradient(circle at center, #1e293b 0%, #050505 100%); width: 100%; height: 100%;"></div>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="center">
          <div class="text-bg" style="text-align: center;">
            <span class="badge">DeskNomads Guide</span>
            <h2>Enjoyed this story?</h2>
            <p>Read the complete step-by-step article, access tutorials, and explore remote workflows on DeskNomads.</p>
          </div>
        </amp-story-grid-layer>
        <amp-story-page-outlink layout="nodisplay">
          <a href="${escapeXml(canonicalUrl)}">Read Full Article</a>
        </amp-story-page-outlink>
      </amp-story-page>

    </amp-story>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
