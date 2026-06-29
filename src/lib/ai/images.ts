/**
 * Featured Image Generation — creates a 16:9 editorial hero image and stores it
 * in Firebase Storage (media library).
 *
 * Default provider is Pollinations.ai (free, no API key, Flux model). Set
 * IMAGE_PROVIDER=openrouter to use the paid OpenRouter image model instead.
 */
import { adminStorage, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateImage, type GeneratedImage } from "./openrouter";
import { SITE, EngineError } from "./config";

export interface FeaturedImageResult {
  url: string;
  mediaId: string;
  width: number;
  height: number;
}

const IMAGE_PROVIDER = (process.env.IMAGE_PROVIDER || "pollinations").toLowerCase();

function buildImagePrompt(title: string, category: string): string {
  return `Create a premium 16:9 editorial blog hero image for an article titled "${title}" in the ${category} category.
Style: modern SaaS aesthetic, technology-focused, cinematic lighting, high contrast, realistic, clean composition, depth of field, optimized as an eye-catching Google Discover thumbnail.
Strict requirements: NO text, NO words, NO letters, NO logos, NO watermarks anywhere in the image. Wide 16:9 aspect ratio. Photorealistic / high-end 3D render quality.`;
}

/** Free image generation via Pollinations.ai (Flux). No API key required. */
async function pollinationsImage(prompt: string): Promise<GeneratedImage> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    const seed = Math.floor(Math.random() * 1_000_000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=1280&height=720&nologo=true&model=flux&seed=${seed}`;
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 90_000); // generation can take a while
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 1000) throw new Error("empty image"); // guard against error placeholders
      return { buffer, mimeType: res.headers.get("content-type") || "image/jpeg" };
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
  throw new EngineError("image.pollinations", `Pollinations failed: ${String(lastErr)}`);
}

const ext: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

/**
 * Generate the featured image and upload to Storage. Returns the public URL.
 * Throws on failure so the pipeline can fall back / queue for review.
 */
export async function generateFeaturedImage(
  slug: string,
  title: string,
  category: string,
  altText: string
): Promise<FeaturedImageResult> {
  const prompt = buildImagePrompt(title, category);
  const img =
    IMAGE_PROVIDER === "openrouter"
      ? await generateImage(prompt)
      : await pollinationsImage(prompt);

  const fileExt = ext[img.mimeType] || "jpg";
  const path = `articles/${slug}/featured-${Date.now()}.${fileExt}`;
  const bucket = adminStorage.bucket();
  const file = bucket.file(path);

  await file.save(img.buffer, {
    metadata: {
      contentType: img.mimeType,
      cacheControl: "public, max-age=31536000, immutable",
    },
    resumable: false,
  });
  await file.makePublic();

  const url = `https://storage.googleapis.com/${bucket.name}/${path}`;

  // Record in the media library.
  const mediaRef = await adminDb.collection("media").add({
    filename: path.split("/").pop(),
    url,
    mimeType: img.mimeType,
    sizeBytes: img.buffer.length,
    width: 1280,
    height: 720,
    altText,
    folder: "articles",
    tags: [category],
    uploadedBy: SITE.defaultAuthorId,
    createdAt: FieldValue.serverTimestamp(),
  });

  return { url, mediaId: mediaRef.id, width: 1280, height: 720 };
}
