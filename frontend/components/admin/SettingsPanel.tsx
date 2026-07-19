"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/adminApi";
import type { SiteSettings } from "@/lib/types";
import { Field } from "./ui";

export default function SettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<SiteSettings>("/api/settings").then(setSettings).catch((e) => setError(e.message));
  }, []);

  if (!settings) return <p className="text-sm text-[var(--muted)]">{error || "Loading…"}</p>;

  async function save() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await api("/api/settings", { method: "PUT", body: JSON.stringify(settings) });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Field label="Hero title">
        <input className="field" value={settings.hero_title} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} />
      </Field>
      <Field label="Hero subtitle">
        <textarea className="field" rows={3} value={settings.hero_subtitle} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Phone 1">
          <input className="field" value={settings.phones[0] || ""} onChange={(e) => setSettings({ ...settings, phones: [e.target.value, settings.phones[1] || ""] })} />
        </Field>
        <Field label="Phone 2">
          <input className="field" value={settings.phones[1] || ""} onChange={(e) => setSettings({ ...settings, phones: [settings.phones[0] || "", e.target.value] })} />
        </Field>
      </div>
      <Field label="Email">
        <input className="field" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
      </Field>
      <Field label="Office address">
        <textarea className="field" rows={2} value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
      </Field>
      <Field label="Working hours line">
        <input className="field" value={settings.hours} onChange={(e) => setSettings({ ...settings, hours: e.target.value })} />
      </Field>
      <Field label="Google Maps search query (for the contact-page map)">
        <input className="field" value={settings.map_query} onChange={(e) => setSettings({ ...settings, map_query: e.target.value })} />
      </Field>

      <div>
        <span className="mb-1.5 block text-sm text-[var(--muted)]">Homepage stats</span>
        <div className="space-y-2">
          {settings.stats.map((s, i) => (
            <div key={i} className="grid grid-cols-[90px_70px_1fr] gap-2">
              <input
                className="field"
                type="number"
                value={s.value}
                onChange={(e) => {
                  const stats = [...settings.stats];
                  stats[i] = { ...s, value: Number(e.target.value) };
                  setSettings({ ...settings, stats });
                }}
              />
              <input
                className="field"
                placeholder="suffix"
                value={s.suffix}
                onChange={(e) => {
                  const stats = [...settings.stats];
                  stats[i] = { ...s, suffix: e.target.value };
                  setSettings({ ...settings, stats });
                }}
              />
              <input
                className="field"
                value={s.label}
                onChange={(e) => {
                  const stats = [...settings.stats];
                  stats[i] = { ...s, label: e.target.value };
                  setSettings({ ...settings, stats });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {saved && <p className="text-sm text-green-400">Saved — the live site updates within a few seconds.</p>}
      <button className="btn-primary" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </div>
  );
}
