"use client";

import { useState } from "react";
import { FloppyDisk, CheckCircle, Globe, Palette, Bell, Shield } from "@phosphor-icons/react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "DeskNomads",
    siteUrl: "https://desknomads.com",
    tagline: "Smart Tools. Remote Freedom. Future Income.",
    adsenseId: "",
    gscVerification: "",
    analyticsId: "G-NEK7FYPZT6",
    socialTwitter: "https://twitter.com/desknomads",
    socialLinkedin: "https://linkedin.com/company/desknomads",
    socialYoutube: "https://youtube.com/@desknomads",
  });

  const handleSave = async () => {
    // TODO: Save to Firestore settings collection
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-sm text-[var(--dn-text-muted)] mt-1">Platform configuration</p>
        </div>
        <button
          onClick={handleSave}
          className="h-10 px-5 rounded-lg bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                   text-white text-sm font-medium inline-flex items-center gap-2
                   transition-all duration-300 active:scale-[0.97]"
        >
          {saved ? <CheckCircle size={16} weight="bold" /> : <FloppyDisk size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* General */}
        <section className="rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-6">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-5">
            <Globe size={16} className="text-[var(--dn-accent)]" />
            General
          </h2>
          <div className="space-y-4">
            <SettingField label="Site Name" value={settings.siteName} onChange={(v) => updateSetting("siteName", v)} />
            <SettingField label="Site URL" value={settings.siteUrl} onChange={(v) => updateSetting("siteUrl", v)} />
            <SettingField label="Tagline" value={settings.tagline} onChange={(v) => updateSetting("tagline", v)} />
          </div>
        </section>

        {/* Integrations */}
        <section className="rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-6">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-5">
            <Shield size={16} className="text-[var(--dn-accent)]" />
            Integrations
          </h2>
          <div className="space-y-4">
            <SettingField label="Google Adsense Publisher ID" value={settings.adsenseId} onChange={(v) => updateSetting("adsenseId", v)} placeholder="ca-pub-XXXXXXX" />
            <SettingField label="Google Analytics ID" value={settings.analyticsId} onChange={(v) => updateSetting("analyticsId", v)} placeholder="G-XXXXXXXXX" />
            <SettingField label="Google Search Console Verification" value={settings.gscVerification} onChange={(v) => updateSetting("gscVerification", v)} placeholder="Meta tag content value" />
          </div>
        </section>

        {/* Social Links */}
        <section className="rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-6">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-5">
            <Palette size={16} className="text-[var(--dn-accent)]" />
            Social Links
          </h2>
          <div className="space-y-4">
            <SettingField label="Twitter / X" value={settings.socialTwitter} onChange={(v) => updateSetting("socialTwitter", v)} />
            <SettingField label="LinkedIn" value={settings.socialLinkedin} onChange={(v) => updateSetting("socialLinkedin", v)} />
            <SettingField label="YouTube" value={settings.socialYoutube} onChange={(v) => updateSetting("socialYoutube", v)} />
          </div>
        </section>
      </div>
    </div>
  );
}

function SettingField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-medium text-[var(--dn-text-muted)] uppercase tracking-wider block mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06]
                 text-sm text-white placeholder-white/[0.15]
                 focus:outline-none focus:border-[var(--dn-primary)] transition-all duration-300"
      />
    </div>
  );
}
