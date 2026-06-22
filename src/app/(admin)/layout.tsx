"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import { SpinnerGap } from "@phosphor-icons/react";
import {
  Cube,
  ChartBar,
  Article,
  Image as ImageIcon,
  Envelope,
  MagnifyingGlass,
  Gear,
  SignOut,
  List,
  X,
  CaretLeft,
  Globe,
  Sparkle,
} from "@phosphor-icons/react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: ChartBar },
  { label: "AI Content Center", href: "/admin/ai", icon: Sparkle },
  { label: "Articles", href: "/admin/articles", icon: Article },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Newsletter", href: "/admin/newsletter", icon: Envelope },
  { label: "SEO", href: "/admin/seo", icon: MagnifyingGlass },
  { label: "Settings", href: "/admin/settings", icon: Gear },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Login page doesn't need the sidebar shell
  const isLoginPage = pathname === "/admin/login";

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, user, isLoginPage, router]);

  // Show login page without sidebar
  if (isLoginPage) return <>{children}</>;

  // Show loading while checking auth
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--dn-bg)]">
        <SpinnerGap size={28} className="animate-spin text-[var(--dn-accent)]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--dn-bg)]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col
                   bg-[var(--dn-bg-card)] border-r border-white/[0.06]
                   transition-all duration-300 ease-[var(--dn-ease)]
                   ${collapsed ? "w-[72px]" : "w-[260px]"}
                   ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06] flex-shrink-0">
          {!collapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--dn-primary)] to-[var(--dn-accent)] flex items-center justify-center">
                <Cube size={14} weight="bold" className="text-white" />
              </div>
              <span className="text-sm font-semibold text-white">
                Desk<span className="text-[var(--dn-accent)]">Nomads</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--dn-primary)] to-[var(--dn-accent)] flex items-center justify-center mx-auto">
              <Cube size={14} weight="bold" className="text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 rounded-md items-center justify-center
                     text-[var(--dn-text-muted)] hover:text-white hover:bg-white/[0.06]
                     transition-all duration-200"
          >
            <CaretLeft size={14} className={collapsed ? "rotate-180" : ""} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-7 h-7 rounded-md flex items-center justify-center text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
                           transition-all duration-200
                           ${isActive
                             ? "bg-[var(--dn-primary)]/10 text-[var(--dn-accent)] border border-[var(--dn-primary)]/20"
                             : "text-[var(--dn-text-secondary)] hover:text-white hover:bg-white/[0.04]"
                           }`}
                  title={collapsed ? link.label : undefined}
                >
                  <Icon size={18} weight={isActive ? "fill" : "regular"} className="flex-shrink-0" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-white/[0.06] flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px]
                     text-[var(--dn-text-muted)] hover:text-white hover:bg-white/[0.04]
                     transition-all duration-200"
            title={collapsed ? "View Site" : undefined}
          >
            <Globe size={18} className="flex-shrink-0" />
            {!collapsed && <span>View Site</span>}
          </Link>
          <button
            onClick={async () => { await signOut(); router.push("/admin/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px]
                     text-[var(--dn-text-muted)] hover:text-[var(--dn-danger)] hover:bg-[var(--dn-danger)]/5
                     transition-all duration-200"
            title={collapsed ? "Sign Out" : undefined}
          >
            <SignOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/[0.06] bg-[var(--dn-bg)] sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center
                     text-white hover:bg-white/[0.06] transition-colors"
          >
            <List size={20} />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles/new"
              className="h-8 px-4 rounded-lg bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                       text-white text-[12px] font-medium flex items-center gap-1.5
                       transition-all duration-300 active:scale-[0.97]"
            >
              + New Article
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--dn-primary)] to-[var(--dn-accent)] flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
