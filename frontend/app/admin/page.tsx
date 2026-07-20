"use client";

import { useEffect, useState } from "react";
import { api, getToken, login, setToken } from "@/lib/adminApi";
import { API_URL } from "@/lib/site";
import { LogoMark } from "@/components/Navbar";
import ProjectsPanel from "@/components/admin/ProjectsPanel";
import BlogPanel from "@/components/admin/BlogPanel";
import LeadsPanel from "@/components/admin/LeadsPanel";
import SettingsPanel from "@/components/admin/SettingsPanel";

const TABS = ["Projects", "Blog", "Leads", "Settings"] as const;
type Tab = (typeof TABS)[number];

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("Projects");

  // Pre-warm the serverless API (and its DB connection) the moment the admin
  // opens, so it's hot by the time data actually loads.
  useEffect(() => {
    fetch(`${API_URL}/health`).catch(() => {});
    fetch(`${API_URL}/api/settings`).catch(() => {});
  }, []);

  useEffect(() => {
    if (!getToken()) {
      setAuthed(false);
      return;
    }
    api("/api/auth/me")
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return <div className="flex min-h-screen items-center justify-center text-[var(--muted)]">Loading…</div>;
  }

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LogoMark size={30} />
          <div>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">Site Manager</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Hi-Tech Engineering Services</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">View site ↗</a>
          <button
            className="text-sm text-[var(--muted)] hover:text-red-400"
            onClick={() => {
              setToken(null);
              setAuthed(false);
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <nav className="mb-8 flex gap-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t ? "bg-[var(--surface-2)] text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "Projects" && <ProjectsPanel />}
      {tab === "Blog" && <BlogPanel />}
      {tab === "Leads" && <LeadsPanel />}
      {tab === "Settings" && <SettingsPanel />}
    </div>
  );
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <form onSubmit={onSubmit} className="card w-full max-w-sm space-y-4 p-8">
        <div className="flex items-center gap-3">
          <LogoMark size={30} />
          <div>
            <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold">Site Manager</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Admin login</p>
          </div>
        </div>
        <input className="field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button className="btn-primary w-full justify-center" disabled={busy}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
