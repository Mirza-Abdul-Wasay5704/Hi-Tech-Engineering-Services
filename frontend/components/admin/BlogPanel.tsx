"use client";

import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api, uploadImage } from "@/lib/adminApi";
import type { BlogPost } from "@/lib/types";
import { Field, ImageUpload, Toggle } from "./ui";

const EMPTY: Partial<BlogPost> = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  cover_url: "",
  tags: "",
  seo_title: "",
  seo_description: "",
  published: false,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogPanel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api<BlogPost[]>("/api/blog?all=true").then(setPosts).catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  async function save() {
    if (!editing?.title) return setError("Title is required");
    setSaving(true);
    setError("");
    try {
      const body = { ...editing, slug: editing.slug || slugify(editing.title) };
      if (editing.id) {
        await api(`/api/blog/${editing.id}`, { method: "PATCH", body: JSON.stringify(body) });
      } else {
        await api("/api/blog", { method: "POST", body: JSON.stringify(body) });
      }
      setEditing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: BlogPost) {
    if (!confirm(`Delete post "${p.title}"?`)) return;
    await api(`/api/blog/${p.id}`, { method: "DELETE" });
    load();
  }

  if (editing) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{editing.id ? "Edit Post" : "New Post"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title *">
            <input className="field" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </Field>
          <Field label="Slug (URL)">
            <input className="field font-mono text-sm" placeholder="auto from title" value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
          </Field>
        </div>
        <Field label="Excerpt (shown in listings & search results)">
          <textarea className="field" rows={2} value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
        </Field>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">Body (Markdown)</span>
            <button type="button" className="font-mono text-xs text-[var(--accent)]" onClick={() => setPreview(!preview)}>
              {preview ? "EDIT" : "PREVIEW"}
            </button>
          </div>
          {preview ? (
            <div className="prose-dark min-h-[300px] rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{editing.body || "*Nothing yet*"}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              className="field min-h-[300px] font-mono text-sm"
              value={editing.body || ""}
              onChange={(e) => setEditing({ ...editing, body: e.target.value })}
              placeholder={"## Heading\n\nWrite the article in Markdown…"}
            />
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ImageUpload label="Cover image" value={editing.cover_url || ""} kind="photo" onUpload={uploadImage} onChange={(url) => setEditing({ ...editing, cover_url: url })} />
          <Field label="Tags (comma-separated)">
            <input className="field" value={editing.tags || ""} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} />
          </Field>
          <Field label="SEO title (optional)">
            <input className="field" value={editing.seo_title || ""} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} />
          </Field>
          <Field label="SEO description (optional)">
            <input className="field" value={editing.seo_description || ""} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} />
          </Field>
        </div>
        <Toggle checked={!!editing.published} onChange={(v) => setEditing({ ...editing, published: v })} label="Published (visible on the site)" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button className="btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Post"}</button>
          <button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">
          {posts.length} posts · publishing 1–2 articles a month is the single best thing you can do for Google &amp; AI-search visibility
        </p>
        <button className="btn-primary !py-2 text-sm" onClick={() => setEditing(EMPTY)}>+ New Post</button>
      </div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface)] px-5 py-4">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="mt-0.5 font-mono text-xs text-[var(--muted)]">
                /blog/{p.slug} · {p.published ? "published" : "draft"}
              </p>
            </div>
            <div className="shrink-0">
              <button className="mr-4 text-sm text-[var(--accent)] hover:underline" onClick={() => setEditing(p)}>Edit</button>
              <button className="text-sm text-red-400 hover:underline" onClick={() => remove(p)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
