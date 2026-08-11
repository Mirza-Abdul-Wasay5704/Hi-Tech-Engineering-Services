"use client";

import { useEffect, useState } from "react";
import { api, getToken, login, setToken } from "@/lib/adminApi";
import { API_URL } from "@/lib/site";
import ThemeToggle from "@/components/ThemeToggle";
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Hi-Tech Engineering Services" className="h-9 w-auto" />
          <div>
            <h1 className="font-[family-name:var(--font-big-shoulders)] text-lg font-bold uppercase tracking-wide">Site Manager</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Hi-Tech Engineering Services</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
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
  const [mode, setMode] = useState<"login" | "request" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  function reset(to: typeof mode) {
    setMode(to);
    setError("");
    setNotice("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function onLogin(e: React.FormEvent) {
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

  async function onRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setNotice("Email verified. Choose a new password.");
      setMode("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the reset");
    } finally {
      setBusy(false);
    }
  }

  async function onReset(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("The two passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, new_password: newPassword }),
      });
      setPassword("");
      reset("login");
      setNotice("Password updated. Sign in with your new password.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset the password");
    } finally {
      setBusy(false);
    }
  }

  const header = (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Hi-Tech Engineering Services" className="h-10 w-auto" />
      <div>
        <h1 className="font-[family-name:var(--font-big-shoulders)] text-lg font-bold uppercase tracking-wide">Site Manager</h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
          {mode === "login" ? "Admin login" : "Password reset"}
        </p>
      </div>
    </div>
  );

  const messages = (
    <>
      {notice && <p className="text-sm text-[var(--green)]">{notice}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </>
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      {mode === "login" && (
        <form onSubmit={onLogin} className="card w-full max-w-sm space-y-4 p-8">
          {header}
          <input className="field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {messages}
          <button className="btn-primary w-full justify-center" disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={() => reset("request")}
            className="w-full text-center text-xs text-[var(--muted)] underline-offset-4 hover:text-[var(--green)] hover:underline"
          >
            Forgot password?
          </button>
        </form>
      )}

      {mode === "request" && (
        <form onSubmit={onRequestCode} className="card w-full max-w-sm space-y-4 p-8">
          {header}
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Enter the authorised admin email to set a new password.
          </p>
          <input
            className="field"
            type="email"
            placeholder="Authorised email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {messages}
          <button className="btn-primary w-full justify-center" disabled={busy}>
            {busy ? "Checking…" : "Continue"}
          </button>
          <button
            type="button"
            onClick={() => reset("login")}
            className="w-full text-center text-xs text-[var(--muted)] underline-offset-4 hover:text-[var(--green)] hover:underline"
          >
            ← Back to sign in
          </button>
        </form>
      )}

      {mode === "reset" && (
        <form onSubmit={onReset} className="card w-full max-w-sm space-y-4 p-8">
          {header}
          {messages}
          <input
            className="field"
            type="password"
            placeholder="New password (min 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            className="field"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="btn-primary w-full justify-center" disabled={busy}>
            {busy ? "Updating…" : "Set New Password"}
          </button>
          <button
            type="button"
            onClick={() => reset("request")}
            className="w-full text-center text-xs text-[var(--muted)] underline-offset-4 hover:text-[var(--green)] hover:underline"
          >
            ← Use a different email
          </button>
        </form>
      )}
    </div>
  );
}
