"use client";

import { useState, useRef } from "react";
import {
  MagnifyingGlass,
  Upload,
  Image as ImageIcon,
  FileText,
  VideoCamera,
  Trash,
  Copy,
  CheckCircle,
  X,
  FolderOpen,
} from "@phosphor-icons/react";

// Demo media files
const demoMedia = [
  { id: "1", fileName: "ai-comparison-hero.jpg", url: "https://picsum.photos/seed/ai-comparison/800/500", type: "image", size: "245 KB", folder: "articles", createdAt: "2025-06-15" },
  { id: "2", fileName: "remote-work-cover.jpg", url: "https://picsum.photos/seed/remote-work/800/500", type: "image", size: "312 KB", folder: "articles", createdAt: "2025-06-12" },
  { id: "3", fileName: "passive-income-guide.jpg", url: "https://picsum.photos/seed/passive-income/800/500", type: "image", size: "198 KB", folder: "articles", createdAt: "2025-06-10" },
  { id: "4", fileName: "chatgpt-logo.png", url: "https://picsum.photos/seed/chatgpt-logo/200/200", type: "image", size: "45 KB", folder: "tools", createdAt: "2025-06-08" },
  { id: "5", fileName: "midjourney-logo.png", url: "https://picsum.photos/seed/midjourney-logo/200/200", type: "image", size: "52 KB", folder: "tools", createdAt: "2025-06-08" },
  { id: "6", fileName: "automation-tools.jpg", url: "https://picsum.photos/seed/automation-tools/800/500", type: "image", size: "287 KB", folder: "articles", createdAt: "2025-06-05" },
];

const folders = ["All", "articles", "tools", "misc"];

export default function MediaPage() {
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = demoMedia.filter((m) => {
    const matchesSearch = !search || m.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = folder === "All" || m.folder === folder;
    return matchesSearch && matchesFolder;
  });

  const selectedFile = demoMedia.find((m) => m.id === selected);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Media Library</h1>
          <p className="text-sm text-[var(--dn-text-muted)] mt-1">
            {demoMedia.length} files
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="h-10 px-5 rounded-lg bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                   text-white text-sm font-medium inline-flex items-center gap-2
                   transition-all duration-300 active:scale-[0.97] w-fit"
        >
          <Upload size={16} weight="bold" />
          Upload Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf"
          className="hidden"
          onChange={(e) => {
            // TODO: Upload to Firebase Storage
            console.log("Files:", e.target.files);
          }}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dn-text-muted)]"
          />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-[var(--dn-bg-card)] border border-white/[0.06]
                     text-sm text-white placeholder-[var(--dn-text-muted)]
                     focus:outline-none focus:border-[var(--dn-primary)] transition-all duration-300"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              className={`px-3 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap
                       transition-all duration-200 ${
                         folder === f
                           ? "bg-[var(--dn-primary)] text-white"
                           : "bg-white/[0.04] text-[var(--dn-text-secondary)] hover:bg-white/[0.08]"
                       }`}
            >
              {f === "All" ? "All Files" : f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelected(file.id)}
                className={`group relative aspect-square rounded-xl overflow-hidden border
                         transition-all duration-200 ${
                           selected === file.id
                             ? "border-[var(--dn-primary)] ring-2 ring-[var(--dn-primary)]/20"
                             : "border-white/[0.06] hover:border-white/[0.1]"
                         }`}
              >
                <img
                  src={file.url}
                  alt={file.fileName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] text-white truncate font-medium">{file.fileName}</p>
                  <p className="text-[9px] text-white/60">{file.size}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail sidebar */}
        {selectedFile && (
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-4 sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold text-white">File Details</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-[var(--dn-text-muted)] hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <img
                src={selectedFile.url}
                alt={selectedFile.fileName}
                className="w-full aspect-video object-cover rounded-lg mb-4 border border-white/[0.06]"
              />

              <div className="space-y-3 text-[12px]">
                <div>
                  <p className="text-[var(--dn-text-muted)]">File name</p>
                  <p className="text-white mt-0.5">{selectedFile.fileName}</p>
                </div>
                <div>
                  <p className="text-[var(--dn-text-muted)]">Size</p>
                  <p className="text-white mt-0.5">{selectedFile.size}</p>
                </div>
                <div>
                  <p className="text-[var(--dn-text-muted)]">Folder</p>
                  <p className="text-white mt-0.5 flex items-center gap-1">
                    <FolderOpen size={12} />
                    {selectedFile.folder}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--dn-text-muted)]">Uploaded</p>
                  <p className="text-white mt-0.5">{selectedFile.createdAt}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => copyUrl(selectedFile.url)}
                  className="flex-1 h-8 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1]
                           text-[11px] text-white font-medium flex items-center justify-center gap-1.5
                           transition-all duration-200"
                >
                  {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy URL"}
                </button>
                <button
                  className="h-8 px-3 rounded-lg bg-[var(--dn-danger)]/10 hover:bg-[var(--dn-danger)]/20
                           text-[11px] text-[var(--dn-danger)] font-medium flex items-center justify-center gap-1.5
                           transition-all duration-200"
                >
                  <Trash size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
