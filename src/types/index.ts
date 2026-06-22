// ─── Article ────────────────────────────────────────────────────
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML content
  contentJson?: Record<string, unknown>; // Tiptap JSON for editor
  featuredImage: string;
  authorId: string;
  author?: Author;
  categoryId: string;
  category?: Category;
  status: "draft" | "scheduled" | "published" | "archived";
  publishedAt: string | null;
  scheduledAt: string | null;
  readingTime: number;
  wordCount: number;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string;
  tags: string[];
  faqs: FAQ[];
  toc: TOCItem[];
  internalLinks: InternalLink[];
  seoScore: number;
  readabilityScore: number;
  views: number;
  isFeatured: boolean;
  isTrending: boolean;
  bloggerOriginalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Author ─────────────────────────────────────────────────────
export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatarUrl: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  role: "author" | "editor" | "admin";
  createdAt: string;
}

// ─── Category ───────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  parentId?: string;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  articleCount?: number;
  createdAt: string;
}

// ─── Tool ───────────────────────────────────────────────────────
export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  url: string;
  logoUrl: string;
  screenshotUrl?: string;
  category: string;
  pricing: "free" | "freemium" | "paid";
  tags: string[];
  rating: number;
  isFeatured: boolean;
  isVerified: boolean;
  submittedBy?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// ─── Newsletter ─────────────────────────────────────────────────
export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: "pending" | "active" | "unsubscribed";
  segments: string[];
  confirmedAt?: string;
  subscribedAt: string;
  unsubscribedAt?: string;
}

// ─── Comments ───────────────────────────────────────────────────
export interface Comment {
  id: string;
  articleId: string;
  parentId?: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  status: "pending" | "approved" | "spam";
  createdAt: string;
  replies?: Comment[];
}

// ─── Media ──────────────────────────────────────────────────────
export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  altText: string;
  folder: string;
  tags: string[];
  uploadedBy: string;
  createdAt: string;
}

// ─── Redirect ───────────────────────────────────────────────────
export interface Redirect {
  id: string;
  oldPath: string;
  newPath: string;
  statusCode: number;
  createdAt: string;
}

// ─── SEO ────────────────────────────────────────────────────────
export interface FAQ {
  question: string;
  answer: string;
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface InternalLink {
  text: string;
  url: string;
  articleId: string;
}

// ─── Analytics ──────────────────────────────────────────────────
export interface AnalyticsEvent {
  id: string;
  articleId?: string;
  eventType: "view" | "click" | "scroll_depth" | "ad_impression";
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ─── AI Content Engine ──────────────────────────────────────────

/** A discovered + scored topic opportunity from the trend scanner. */
export interface ContentOpportunity {
  id: string;
  title: string;
  topic: string;
  category: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: "informational" | "commercial" | "transactional" | "navigational";
  angle: string;
  sources: { title: string; url: string; source: string }[];
  // Scoring breakdown (each 0-100 before weighting)
  scores: {
    searchDemand: number;
    trendVelocity: number;
    lowCompetition: number;
    viralPotential: number;
    relevance: number;
  };
  topicScore: number; // weighted total out of 100
  status: "discovered" | "queued" | "generating" | "published" | "rejected" | "failed";
  generatedArticleId?: string;
  discoveredAt: string;
  updatedAt: string;
}

/** Editorial plan produced before article generation. */
export interface ContentPlan {
  seoTitle: string;
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  angle: string;
  metaDescription: string;
  faqTopics: string[];
  outline: { heading: string; level: 2 | 3; points: string[] }[];
}

/** Research findings gathered before writing. */
export interface ResearchData {
  summary: string;
  sources: { title: string; url: string; snippet: string; published?: string }[];
  statistics: string[];
  expertInsights: string[];
}

/** Result of the fact-checking layer. */
export interface FactCheckResult {
  confidence: number; // 0-100
  passed: boolean;
  issues: string[];
}

/** Audit log for every AI generation run. */
export interface GenerationLog {
  id: string;
  opportunityId?: string;
  articleId?: string;
  stage: string;
  status: "success" | "error" | "warning" | "info";
  message: string;
  model?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

/** Settings controlling the autonomous engine (single doc: settings/engine). */
export interface EngineSettings {
  autoPublishEnabled: boolean;
  articlesPerDay: number;
  minTopicScore: number;
  minFactCheckConfidence: number;
  minWordCount: number;
  publishHourIST: number;
  discoverHourIST: number;
  updatedAt: string;
}

// ─── Performance ────────────────────────────────────────────────
export interface PerformanceMetrics {
  articleId: string;
  slug?: string;
  title?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  traffic: number;
  bounceRate: number;
  avgTimeOnPage: number;
  period: string;
  updatedAt: string;
}

// ─── Dashboard ──────────────────────────────────────────────────
export interface DashboardMetrics {
  totalArticles: number;
  totalViews: number;
  totalSubscribers: number;
  totalTools: number;
  recentArticles: Article[];
  topArticles: Article[];
  viewsByDay: { date: string; views: number }[];
}
