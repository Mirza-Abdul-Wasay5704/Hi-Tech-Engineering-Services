"use client";

import { useCallback, useEffect, useState } from "react";
import { api, uploadImage } from "@/lib/adminApi";
import type { Project } from "@/lib/types";
import { Field, ImageUpload, Toggle } from "./ui";

const CATEGORIES = ["Hotels", "Hospitals", "Financial", "Commercial", "Industrial", "Residential"];

const EMPTY: Partial<Project> = {
  name: "",
  slug: "",
  category: "Commercial",
  client_name: "",
  logo_url: "",
  image_url: "",
  location: "Karachi, Pakistan",
  scope_of_work: "",
  description: "",
  elevator_types: "Passenger",
  featured: false,
  show_logo: true,
  sort_order: 0,
  published: true,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api<Project[]>("/api/projects?all=true").then(setProjects).catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  async function save() {
    if (!editing?.name) return setError("Name is required");
    setSaving(true);
    setError("");
    try {
      const body = { ...editing, slug: editing.slug || slugify(editing.name) };
      if (editing.id) {
        await api(`/api/projects/${editing.id}`, { method: "PATCH", body: JSON.stringify(body) });
      } else {
        await api("/api/projects", { method: "POST", body: JSON.stringify(body) });
      }
      setEditing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: Project) {
    if (!confirm(`Delete project "${p.name}"? This cannot be undone.`)) return;
    try {
      await api(`/api/projects/${p.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  if (editing) {
    return (
      <div className="max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold">{editing.id ? `Edit: ${editing.name}` : "New Project"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name *">
            <input className="field" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          </Field>
          <Field label="Slug (URL)">
            <input className="field font-mono text-sm" placeholder="auto from name" value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
          </Field>
          <Field label="Category">
            <select className="field" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Client name">
            <input className="field" value={editing.client_name || ""} onChange={(e) => setEditing({ ...editing, client_name: e.target.value })} />
          </Field>
          <Field label="Location">
            <input className="field" value={editing.location || ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
          </Field>
          <Field label="Elevator types">
            <input className="field" placeholder="e.g. Passenger, Service" value={editing.elevator_types || ""} onChange={(e) => setEditing({ ...editing, elevator_types: e.target.value })} />
          </Field>
        </div>
        <Field label="Scope of work (shown on cards & project page)">
          <textarea className="field" rows={3} value={editing.scope_of_work || ""} onChange={(e) => setEditing({ ...editing, scope_of_work: e.target.value })} />
        </Field>
        <Field label="Extra description (optional)">
          <textarea className="field" rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
        </Field>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)]/40 p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
            Media — upload the client logo and a photo of the building
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <ImageUpload label="Client logo (PNG/JPG/SVG)" value={editing.logo_url || ""} kind="logo" onUpload={uploadImage} onChange={(url) => setEditing({ ...editing, logo_url: url })} />
            <ImageUpload label="Building photo" value={editing.image_url || ""} kind="photo" onUpload={uploadImage} onChange={(url) => setEditing({ ...editing, image_url: url })} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
            No logo? Leave it empty — the building&apos;s <b>name</b> is shown instead automatically. The building photo
            appears on the project card and page; the logo appears in the homepage client wall and as a badge on the card.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 pt-2">
          <Toggle checked={!!editing.published} onChange={(v) => setEditing({ ...editing, published: v })} label="Published" />
          <Toggle checked={!!editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} label="Featured on homepage" />
          <Toggle checked={!!editing.show_logo} onChange={(v) => setEditing({ ...editing, show_logo: v })} label="Show in logo wall" />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button className="btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Project"}</button>
          <button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">{projects.length} projects · changes go live within seconds</p>
        <button className="btn-primary !py-2 text-sm" onClick={() => setEditing({ ...EMPTY, sort_order: projects.length })}>
          + New Project
        </button>
      </div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <div className="overflow-x-auto rounded-lg border border-[var(--line)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-2)] text-left font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Logo</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--surface)]">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{p.category}</td>
                <td className="px-4 py-3">{p.logo_url ? "🖼️" : "—"}</td>
                <td className="px-4 py-3">{p.featured ? "★" : "—"}</td>
                <td className="px-4 py-3">{p.published ? "✓" : "hidden"}</td>
                <td className="px-4 py-3 text-right">
                  <button className="mr-3 text-[var(--accent)] hover:underline" onClick={() => setEditing(p)}>Edit</button>
                  <button className="text-red-400 hover:underline" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
