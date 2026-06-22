"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FloppyDisk,
  Eye,
  Gear,
  X,
  CaretDown,
  Image as ImageIcon,
  ListBullets,
  TextB,
  TextItalic,
  TextStrikethrough,
  Quotes,
  Code,
  LinkSimple,
  ListNumbers,
  Minus,
  ArrowCounterClockwise,
  ArrowClockwise,
} from "@phosphor-icons/react";

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published" | "scheduled";
  faqs: { question: string; answer: string }[];
}

const categories = [
  "AI Tools",
  "Remote Jobs",
  "Passive Income",
  "Automation",
  "Digital Products",
  "Productivity",
  "Freelancing",
  "Startups",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NewArticlePage() {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState<ArticleFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    featuredImage: "",
    seoTitle: "",
    seoDescription: "",
    status: "draft",
    faqs: [],
  });

  const updateField = <K extends keyof ArticleFormData>(
    key: K,
    value: ArticleFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "title" && !form.slug) {
      setForm((prev) => ({ ...prev, slug: slugify(value as string) }));
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      updateField("tags", [...form.tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    updateField("tags", form.tags.filter((t) => t !== tag));
  };

  const addFaq = () => {
    updateField("faqs", [...form.faqs, { question: "", answer: "" }]);
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...form.faqs];
    updated[index][field] = value;
    updateField("faqs", updated);
  };

  const removeFaq = (index: number) => {
    updateField("faqs", form.faqs.filter((_, i) => i !== index));
  };

  const handleSave = async (status: "draft" | "published" | "scheduled") => {
    setSaving(true);
    updateField("status", status);

    // TODO: Save to Firestore via createArticle()
    console.log("Saving article:", { ...form, status });
    await new Promise((r) => setTimeout(r, 1000));

    setSaving(false);
    // router.push("/admin/articles");
  };

  const seoTitleLength = (form.seoTitle || form.title).length;
  const seoDescLength = (form.seoDescription || form.excerpt).length;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] flex-shrink-0 bg-[var(--dn-bg)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/admin/articles")}
            className="text-[13px] text-[var(--dn-text-muted)] hover:text-white transition-colors"
          >
            ← Articles
          </button>
          <span className="text-[var(--dn-text-muted)] text-[11px]">/</span>
          <span className="text-[13px] text-[var(--dn-text-secondary)]">
            {form.title ? form.title.slice(0, 40) + (form.title.length > 40 ? "..." : "") : "New Article"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="h-8 px-3 rounded-lg text-[12px] text-[var(--dn-text-muted)]
                     hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
          >
            <Gear size={14} />
            Settings
          </button>
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="h-8 px-4 rounded-lg bg-white/[0.06] hover:bg-white/[0.1]
                     text-[12px] text-white font-medium transition-all
                     disabled:opacity-50 flex items-center gap-1.5"
          >
            <FloppyDisk size={14} />
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="h-8 px-4 rounded-lg bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                     text-[12px] text-white font-medium transition-all
                     disabled:opacity-50 flex items-center gap-1.5"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-8 px-6">
            {/* Title */}
            <input
              type="text"
              placeholder="Article title..."
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full text-3xl font-bold text-white placeholder-white/[0.15]
                       bg-transparent border-none outline-none mb-2 tracking-tight leading-tight"
            />

            {/* Slug */}
            <div className="flex items-center gap-2 mb-6 text-[12px] text-[var(--dn-text-muted)]">
              <span>desknomads.com/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField("slug", slugify(e.target.value))}
                className="bg-transparent border-b border-dashed border-white/[0.1] text-[var(--dn-text-secondary)]
                         outline-none max-w-xs focus:border-[var(--dn-primary)] transition-colors"
              />
            </div>

            {/* Excerpt */}
            <textarea
              placeholder="Write a compelling excerpt (1-2 sentences)..."
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              rows={2}
              className="w-full text-base text-[var(--dn-text-secondary)] placeholder-white/[0.1]
                       bg-transparent border-none outline-none resize-none mb-6 leading-relaxed"
            />

            {/* Featured Image */}
            {form.featuredImage ? (
              <div className="relative rounded-xl overflow-hidden mb-8 border border-white/[0.06]">
                <img
                  src={form.featuredImage}
                  alt="Featured"
                  className="w-full aspect-[2/1] object-cover"
                />
                <button
                  onClick={() => updateField("featuredImage", "")}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white
                           flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  // TODO: Open media picker
                  updateField("featuredImage", "https://picsum.photos/seed/editor-demo/1200/600");
                }}
                className="w-full aspect-[3/1] rounded-xl border-2 border-dashed border-white/[0.08]
                         flex items-center justify-center gap-2 text-sm text-[var(--dn-text-muted)]
                         hover:border-[var(--dn-primary)]/30 hover:text-[var(--dn-accent)]
                         transition-all duration-300 mb-8"
              >
                <ImageIcon size={20} />
                Add Featured Image
              </button>
            )}

            {/* Rich Text Toolbar */}
            <div className="flex items-center gap-0.5 px-2 py-2 mb-4 rounded-lg border border-white/[0.06] bg-[var(--dn-bg-card)] overflow-x-auto">
              {[
                { icon: TextB, title: "Bold" },
                { icon: TextItalic, title: "Italic" },
                { icon: TextStrikethrough, title: "Strikethrough" },
                { icon: Code, title: "Code" },
                { icon: LinkSimple, title: "Link" },
              ].map(({ icon: Icon, title }) => (
                <button
                  key={title}
                  title={title}
                  className="w-8 h-8 rounded-md flex items-center justify-center
                           text-[var(--dn-text-muted)] hover:text-white hover:bg-white/[0.06]
                           transition-all"
                >
                  <Icon size={16} />
                </button>
              ))}
              <div className="w-px h-5 bg-white/[0.06] mx-1" />
              {[
                { icon: ListBullets, title: "Bullet List" },
                { icon: ListNumbers, title: "Numbered List" },
                { icon: Quotes, title: "Blockquote" },
                { icon: Minus, title: "Divider" },
                { icon: ImageIcon, title: "Image" },
              ].map(({ icon: Icon, title }) => (
                <button
                  key={title}
                  title={title}
                  className="w-8 h-8 rounded-md flex items-center justify-center
                           text-[var(--dn-text-muted)] hover:text-white hover:bg-white/[0.06]
                           transition-all"
                >
                  <Icon size={16} />
                </button>
              ))}
              <div className="flex-1" />
              <button
                title="Undo"
                className="w-8 h-8 rounded-md flex items-center justify-center
                         text-[var(--dn-text-muted)] hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <ArrowCounterClockwise size={14} />
              </button>
              <button
                title="Redo"
                className="w-8 h-8 rounded-md flex items-center justify-center
                         text-[var(--dn-text-muted)] hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <ArrowClockwise size={14} />
              </button>
            </div>

            {/* Content Editor (textarea placeholder — will be replaced with Tiptap) */}
            <textarea
              placeholder="Start writing your article content here...

Use markdown-like formatting:
• ## for headings
• **bold** for emphasis  
• - for bullet points
• > for blockquotes

The full Tiptap rich-text editor will be integrated for the production build."
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              className="w-full min-h-[400px] text-[15px] text-[var(--dn-text-secondary)] leading-[1.8]
                       placeholder-white/[0.08] bg-transparent border-none outline-none resize-none
                       font-[var(--font-geist-sans)]"
            />

            {/* FAQs Section */}
            <div className="mt-12 pt-8 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">FAQ Section</h3>
                <button
                  onClick={addFaq}
                  className="text-[12px] text-[var(--dn-accent)] hover:text-white transition-colors"
                >
                  + Add FAQ
                </button>
              </div>
              <p className="text-[12px] text-[var(--dn-text-muted)] mb-4">
                FAQs generate FAQ Schema (structured data) for Google rich snippets
              </p>
              {form.faqs.map((faq, i) => (
                <div key={i} className="mb-4 p-4 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-[var(--dn-text-muted)]">FAQ #{i + 1}</span>
                    <button
                      onClick={() => removeFaq(i)}
                      className="text-[var(--dn-text-muted)] hover:text-[var(--dn-danger)] transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Question..."
                    value={faq.question}
                    onChange={(e) => updateFaq(i, "question", e.target.value)}
                    className="w-full text-sm text-white bg-transparent border-b border-white/[0.06]
                             pb-2 mb-2 outline-none placeholder-white/[0.15]
                             focus:border-[var(--dn-primary)] transition-colors"
                  />
                  <textarea
                    placeholder="Answer..."
                    value={faq.answer}
                    onChange={(e) => updateFaq(i, "answer", e.target.value)}
                    rows={2}
                    className="w-full text-[13px] text-[var(--dn-text-secondary)] bg-transparent
                             border-none outline-none resize-none placeholder-white/[0.1]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        {showSidebar && (
          <aside className="w-[320px] flex-shrink-0 border-l border-white/[0.06] overflow-y-auto bg-[var(--dn-bg)]">
            <div className="p-5 space-y-6">
              {/* Status */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--dn-text-muted)] block mb-2">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value as ArticleFormData["status"])}
                  className="w-full h-9 px-3 rounded-lg bg-[var(--dn-bg-card)] border border-white/[0.06]
                           text-sm text-white appearance-none cursor-pointer
                           focus:outline-none focus:border-[var(--dn-primary)] transition-colors"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--dn-text-muted)] block mb-2">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-[var(--dn-bg-card)] border border-white/[0.06]
                           text-sm text-white appearance-none cursor-pointer
                           focus:outline-none focus:border-[var(--dn-primary)] transition-colors"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--dn-text-muted)] block mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px]
                               bg-[var(--dn-primary)]/10 text-[var(--dn-accent)] border border-[var(--dn-primary)]/20"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-white">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 h-8 px-3 rounded-lg bg-[var(--dn-bg-card)] border border-white/[0.06]
                             text-[12px] text-white placeholder-white/[0.15]
                             outline-none focus:border-[var(--dn-primary)] transition-colors"
                  />
                  <button
                    onClick={addTag}
                    className="h-8 px-3 rounded-lg bg-white/[0.06] text-[12px] text-white
                           hover:bg-white/[0.1] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* SEO */}
              <div className="pt-4 border-t border-white/[0.06]">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--dn-text-muted)] mb-3">
                  SEO Settings
                </h3>

                {/* SEO Title */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-[var(--dn-text-muted)]">SEO Title</label>
                    <span className={`text-[10px] ${seoTitleLength > 60 ? "text-[var(--dn-danger)]" : "text-[var(--dn-text-muted)]"}`}>
                      {seoTitleLength}/60
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder={form.title || "SEO title..."}
                    value={form.seoTitle}
                    onChange={(e) => updateField("seoTitle", e.target.value)}
                    className="w-full h-8 px-3 rounded-lg bg-[var(--dn-bg-card)] border border-white/[0.06]
                             text-[12px] text-white placeholder-white/[0.15]
                             outline-none focus:border-[var(--dn-primary)] transition-colors"
                  />
                </div>

                {/* SEO Description */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-[var(--dn-text-muted)]">Meta Description</label>
                    <span className={`text-[10px] ${seoDescLength > 160 ? "text-[var(--dn-danger)]" : "text-[var(--dn-text-muted)]"}`}>
                      {seoDescLength}/160
                    </span>
                  </div>
                  <textarea
                    placeholder={form.excerpt || "Meta description..."}
                    value={form.seoDescription}
                    onChange={(e) => updateField("seoDescription", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--dn-bg-card)] border border-white/[0.06]
                             text-[12px] text-white placeholder-white/[0.15]
                             outline-none resize-none focus:border-[var(--dn-primary)] transition-colors"
                  />
                </div>

                {/* Google Preview */}
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[10px] text-[var(--dn-text-muted)] mb-2">Google Preview</p>
                  <div>
                    <p className="text-[14px] text-[#8ab4f8] truncate">
                      {form.seoTitle || form.title || "Article Title"}
                    </p>
                    <p className="text-[11px] text-[#bdc1c6] mt-0.5 truncate">
                      desknomads.com › {form.slug || "article-slug"}
                    </p>
                    <p className="text-[11px] text-[#9aa0a6] mt-1 line-clamp-2">
                      {form.seoDescription || form.excerpt || "Meta description will appear here..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
