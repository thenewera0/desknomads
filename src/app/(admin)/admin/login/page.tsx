"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cube, SpinnerGap, WarningCircle } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect (in an effect — never navigate during render)
  useEffect(() => {
    if (!loading && user) router.replace("/admin/dashboard");
  }, [loading, user, router]);

  if (!loading && user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signIn(email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Invalid email or password");
      } else if (code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--dn-bg)]">
        <SpinnerGap size={28} className="animate-spin text-[var(--dn-accent)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--dn-bg)] px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--dn-primary)] to-[var(--dn-accent)] flex items-center justify-center">
            <Cube size={20} weight="bold" className="text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            Desk<span className="text-[var(--dn-accent)]">Nomads</span>
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-7">
          <h1 className="text-lg font-bold text-white text-center mb-1">Admin Login</h1>
          <p className="text-sm text-[var(--dn-text-muted)] text-center mb-6">
            Sign in to manage your platform
          </p>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 mb-5 rounded-lg bg-[var(--dn-danger)]/10 border border-[var(--dn-danger)]/20">
              <WarningCircle size={16} className="text-[var(--dn-danger)] flex-shrink-0" />
              <p className="text-[13px] text-[var(--dn-danger)]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-medium text-[var(--dn-text-muted)] uppercase tracking-wider block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="admin@desknomads.com"
                className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08]
                         text-sm text-white placeholder-white/[0.2]
                         focus:outline-none focus:border-[var(--dn-primary)] focus:ring-1 focus:ring-[var(--dn-primary)]
                         transition-all duration-300"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[var(--dn-text-muted)] uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08]
                         text-sm text-white placeholder-white/[0.2]
                         focus:outline-none focus:border-[var(--dn-primary)] focus:ring-1 focus:ring-[var(--dn-primary)]
                         transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-xl bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                       text-white text-sm font-medium flex items-center justify-center gap-2
                       transition-all duration-300 active:scale-[0.98]
                       disabled:opacity-60 disabled:cursor-not-allowed
                       shadow-[0_0_24px_rgba(59,130,246,0.2)]"
            >
              {submitting ? (
                <>
                  <SpinnerGap size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[var(--dn-text-muted)] mt-6">
          DeskNomads Admin Panel — Authorized access only
        </p>
      </div>
    </div>
  );
}
