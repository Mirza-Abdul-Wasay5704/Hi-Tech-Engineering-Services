"use client";

import { useState } from "react";
import { API_URL } from "@/lib/site";

const SERVICES = [
  "Monthly Maintenance Contract",
  "Modernization / Retrofitting",
  "Mechanical / Electrical Overhauling",
  "Spare Parts",
  "Other",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="plate-static p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--green)] text-2xl text-[var(--green)]">
          ✓
        </div>
        <h3 className="text-xl font-semibold">Inquiry received</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Thank you — our team will contact you shortly. For urgent breakdowns, please call us directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="plate-static space-y-4 p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-[var(--muted)]" htmlFor="cf-name">Name *</label>
          <input id="cf-name" name="name" required maxLength={200} className="field" placeholder="Your full name" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--muted)]" htmlFor="cf-company">Company / Building</label>
          <input id="cf-company" name="company" maxLength={200} className="field" placeholder="Building or company name" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--muted)]" htmlFor="cf-email">Email *</label>
          <input id="cf-email" name="email" type="email" required maxLength={200} className="field" placeholder="you@company.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--muted)]" htmlFor="cf-phone">Phone</label>
          <input id="cf-phone" name="phone" maxLength={50} className="field" placeholder="03xx-xxxxxxx" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-[var(--muted)]" htmlFor="cf-service">Service needed</label>
        <select id="cf-service" name="service" className="field" defaultValue={SERVICES[0]}>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-[var(--muted)]" htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          maxLength={4000}
          className="field resize-y"
          placeholder="Tell us about your building, number of elevators, and the issue or requirement…"
        />
      </div>
      {/* Honeypot — hidden from humans, bots fill it */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full justify-center disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Send Inquiry"}
      </button>
      {status === "error" && (
        <p className="text-center text-sm text-[var(--signal)]">
          Something went wrong. Please try again, or call us directly.
        </p>
      )}
    </form>
  );
}
