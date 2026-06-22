import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp,
  increment,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./client";
import type { Article, Author, Category, Tool, Subscriber, Comment, MediaFile } from "@/types";

// ─── Collection References ──────────────────────────────────────
const articlesCol = collection(db, "articles");
const authorsCol = collection(db, "authors");
const categoriesCol = collection(db, "categories");
const toolsCol = collection(db, "tools");
const subscribersCol = collection(db, "subscribers");
const commentsCol = collection(db, "comments");
const mediaCol = collection(db, "media");
const redirectsCol = collection(db, "redirects");

// ─── Helpers ────────────────────────────────────────────────────
function toDate(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (typeof ts === "string") return ts;
  return new Date().toISOString();
}

function docToArticle(id: string, data: DocumentData): Article {
  return {
    id,
    title: data.title || "",
    slug: data.slug || "",
    excerpt: data.excerpt || "",
    content: data.content || "",
    contentJson: data.contentJson || {},
    featuredImage: data.featuredImage || "",
    authorId: data.authorId || "",
    categoryId: data.categoryId || "",
    status: data.status || "draft",
    publishedAt: data.publishedAt ? toDate(data.publishedAt) : null,
    scheduledAt: data.scheduledAt ? toDate(data.scheduledAt) : null,
    readingTime: data.readingTime || 0,
    wordCount: data.wordCount || 0,
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
    canonicalUrl: data.canonicalUrl || "",
    ogImage: data.ogImage || "",
    tags: data.tags || [],
    faqs: data.faqs || [],
    toc: data.toc || [],
    internalLinks: data.internalLinks || [],
    seoScore: data.seoScore || 0,
    readabilityScore: data.readabilityScore || 0,
    views: data.views || 0,
    isFeatured: data.isFeatured || false,
    isTrending: data.isTrending || false,
    bloggerOriginalUrl: data.bloggerOriginalUrl || "",
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

// ─── Articles ───────────────────────────────────────────────────
export async function getArticles(options: {
  status?: string;
  categoryId?: string;
  authorId?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  tag?: string;
  limitCount?: number;
  lastDoc?: DocumentData;
} = {}): Promise<Article[]> {
  const constraints: QueryConstraint[] = [];

  if (options.status) {
    constraints.push(where("status", "==", options.status));
  }
  if (options.categoryId) {
    constraints.push(where("categoryId", "==", options.categoryId));
  }
  if (options.authorId) {
    constraints.push(where("authorId", "==", options.authorId));
  }
  if (options.isFeatured) {
    constraints.push(where("isFeatured", "==", true));
  }
  if (options.isTrending) {
    constraints.push(where("isTrending", "==", true));
  }
  if (options.tag) {
    constraints.push(where("tags", "array-contains", options.tag));
  }

  constraints.push(orderBy("publishedAt", "desc"));

  if (options.limitCount) {
    constraints.push(limit(options.limitCount));
  }
  if (options.lastDoc) {
    constraints.push(startAfter(options.lastDoc));
  }

  const q = query(articlesCol, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToArticle(d.id, d.data()));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const q = query(articlesCol, where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return docToArticle(d.id, d.data());
}

export async function getArticleById(id: string): Promise<Article | null> {
  const d = await getDoc(doc(articlesCol, id));
  if (!d.exists()) return null;
  return docToArticle(d.id, d.data());
}

export async function createArticle(data: Omit<Article, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(articlesCol, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<void> {
  const { id: _, createdAt, ...rest } = data as Article;
  await updateDoc(doc(articlesCol, id), {
    ...rest,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteArticle(id: string): Promise<void> {
  await deleteDoc(doc(articlesCol, id));
}

export async function incrementArticleViews(id: string): Promise<void> {
  await updateDoc(doc(articlesCol, id), {
    views: increment(1),
  });
}

// ─── Authors ────────────────────────────────────────────────────
export async function getAuthors(): Promise<Author[]> {
  const snap = await getDocs(authorsCol);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Author));
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const q = query(authorsCol, where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Author;
}

// ─── Categories ─────────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  const q = query(categoriesCol, orderBy("sortOrder", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const q = query(categoriesCol, where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Category;
}

// ─── Tools ──────────────────────────────────────────────────────
export async function getTools(options: {
  category?: string;
  pricing?: string;
  status?: string;
  isFeatured?: boolean;
  limitCount?: number;
} = {}): Promise<Tool[]> {
  const constraints: QueryConstraint[] = [];
  if (options.category) constraints.push(where("category", "==", options.category));
  if (options.pricing) constraints.push(where("pricing", "==", options.pricing));
  if (options.status) constraints.push(where("status", "==", options.status));
  if (options.isFeatured) constraints.push(where("isFeatured", "==", true));
  if (options.limitCount) constraints.push(limit(options.limitCount));

  const q = query(toolsCol, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Tool));
}

// ─── Subscribers ────────────────────────────────────────────────
export async function addSubscriber(email: string, name?: string): Promise<string> {
  const existing = query(subscribersCol, where("email", "==", email), limit(1));
  const snap = await getDocs(existing);
  if (!snap.empty) {
    return snap.docs[0].id; // already subscribed
  }
  const docRef = await addDoc(subscribersCol, {
    email,
    name: name || "",
    status: "pending",
    segments: [],
    subscribedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getSubscribers(status?: string): Promise<Subscriber[]> {
  const constraints: QueryConstraint[] = [];
  if (status) constraints.push(where("status", "==", status));
  constraints.push(orderBy("subscribedAt", "desc"));
  const q = query(subscribersCol, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subscriber));
}

// ─── Comments ───────────────────────────────────────────────────
export async function getComments(articleId: string): Promise<Comment[]> {
  const q = query(
    commentsCol,
    where("articleId", "==", articleId),
    where("status", "==", "approved"),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
}

export async function addComment(data: {
  articleId: string;
  parentId?: string;
  authorName: string;
  authorEmail?: string;
  content: string;
}): Promise<string> {
  const docRef = await addDoc(commentsCol, {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ─── Media ──────────────────────────────────────────────────────
export async function getMedia(folder?: string): Promise<MediaFile[]> {
  const constraints: QueryConstraint[] = [];
  if (folder) constraints.push(where("folder", "==", folder));
  constraints.push(orderBy("createdAt", "desc"));
  const q = query(mediaCol, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MediaFile));
}

export async function addMediaRecord(data: Omit<MediaFile, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(mediaCol, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ─── Redirects ──────────────────────────────────────────────────
export async function getRedirect(oldPath: string): Promise<{ newPath: string; statusCode: number } | null> {
  const q = query(redirectsCol, where("oldPath", "==", oldPath), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const data = snap.docs[0].data();
  return { newPath: data.newPath, statusCode: data.statusCode || 301 };
}

// ─── Dashboard Stats ────────────────────────────────────────────
export async function getDashboardStats() {
  const [articlesSnap, subscribersSnap, toolsSnap] = await Promise.all([
    getDocs(query(articlesCol, where("status", "==", "published"))),
    getDocs(query(subscribersCol, where("status", "==", "active"))),
    getDocs(query(toolsCol, where("status", "==", "approved"))),
  ]);

  let totalViews = 0;
  articlesSnap.docs.forEach((d) => {
    totalViews += d.data().views || 0;
  });

  return {
    totalArticles: articlesSnap.size,
    totalSubscribers: subscribersSnap.size,
    totalTools: toolsSnap.size,
    totalViews,
  };
}
