"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/adminApi";
import type { Lead } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  new: "text-[var(--accent)] border-[var(--accent)]",
  contacted: "text-blue-400 border-blue-400",
  closed: "text-[var(--muted)] border-[var(--line)]",
};

export default function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api<Lead[]>("/api/leads").then(setLeads).catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  async function setStatus(lead: Lead, status: string) {
    await api(`/api/leads/${lead.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  }

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (leads.length === 0) return <p className="text-sm text-[var(--muted)]">No inquiries yet. They&apos;ll appear here when someone submits the contact form.</p>;

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead.id} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">
                {lead.name}
                {lead.company && <span className="font-normal text-[var(--muted)]"> — {lead.company}</span>}
              </p>
              <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                {new Date(lead.created_at).toLocaleString()} · {lead.service || "General"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {["new", "contacted", "closed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(lead, s)}
                  className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-opacity ${
                    lead.status === s ? STATUS_COLORS[s] : "border-[var(--line)] text-[var(--muted)] opacity-50 hover:opacity-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 grid gap-1 text-sm text-[var(--muted)]">
            {lead.email && <a className="hover:text-[var(--accent)]" href={`mailto:${lead.email}`}>✉ {lead.email}</a>}
            {lead.phone && <a className="hover:text-[var(--accent)]" href={`tel:${lead.phone}`}>☎ {lead.phone}</a>}
          </div>
          {lead.message && <p className="mt-3 whitespace-pre-wrap rounded bg-[var(--surface-2)] p-3 text-sm">{lead.message}</p>}
        </div>
      ))}
    </div>
  );
}
