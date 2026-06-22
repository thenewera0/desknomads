/**
 * Featured Image Generation — creates a 16:9 editorial hero image via the
 * OpenRouter image model and stores it in Firebase Storage (media library).
 */
import { adminStorage, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateImage } from "./openrouter";
import { SITE } from "./config";

export interface FeaturedImageResult {
  url: string;
  mediaId: string;
  width: number;
  height: number;
}

function buildImagePrompt(title: string, category: string): string {
  return `Create a premium 16:9 editorial blog hero image for an article titled "${title}" in the ${category} category.
Style: modern SaaS aesthetic, technology-focused, cinematic lighting, high contrast, realistic, clean composition, depth of field, optimized as an eye-catching Google Discover thumbnail.
Strict requirements: NO text, NO words, NO letters, NO logos, NO watermarks anywhere in the image. Wide 16:9 aspect ratio. Photorealistic / high-end 3D render quality.`;
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
  const img = await generateImage(buildImagePrompt(title, category));

  const fileExt = ext[img.mimeType] || "png";
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
