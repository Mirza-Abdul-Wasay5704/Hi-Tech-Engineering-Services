import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { getSettings } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us — 26+ Years of Elevator Engineering in Karachi",
  description:
    "Hi-Tech Engineering Services has provided elevator maintenance, overhauling and modernization in Karachi since 1997. Korea-trained engineers, structured teams, and a client list of city landmarks.",
  alternates: { canonical: "/about" },
};

const DEPARTMENTS = [
  { name: "Electrical", text: "Control panels, drives, wiring, diagnostics and parameter work — including our Sigma specialty." },
  { name: "Mechanical", text: "Machines, doors, rails, ropes and brakes — the moving heart of every elevator." },
  { name: "Maintenance", text: "Scheduled preventive teams and rapid breakdown response across Karachi." },
  { name: "Planning & Co-ordination", text: "Scheduling, parts logistics and client communication that keeps every job on time." },
];

const HIERARCHY = [
  "CEO",
  "M.D. Technical",
  "Mechanical & Electrical Engineer (Sales)",
  "Mechanical & Electrical Engineer (Maintenance)",
  "Mechanical Incharge · Electrical Incharge",
  "Supervisors",
  "Fitters / Riggers",
];

const TIMELINE = [
  { year: "1994", event: "First manufacturer training program completed in Korea." },
  { year: "1997", event: "Hi-Tech Engineering Services founded in Karachi; second Korea training completed." },
  { year: "2005", event: "Third Korea training program — deepening modernization expertise." },
  { year: "2014", event: "Fourth Korea training program; Sigma panel specialization matured." },
  { year: "Today", event: "25+ landmark buildings under maintenance across Karachi." },
];

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-32">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "About", url: "/about" }])} />

      <SectionHeading
        floor="A"
        label="About us"
        title="Engineers First. Since 1997."
        subtitle={`${settings.company_name} exists for one purpose: keeping elevators safe, smooth and running. We strive to provide the best quality to our valued customers with the least response time — so downtime is minimal and clients face little or no loss from breakdowns. Every client is served on priority; our response time is among the best in Karachi.`}
      />

      {/* Departments */}
      <section className="mt-20">
        <SectionHeading floor="01" label="Structure" title="Four Departments, One Standard" />
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEPARTMENTS.map((d) => (
            <RevealItem key={d.name}>
              <div className="plate h-full p-6">
                <h3 className="font-sans font-semibold">{d.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{d.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Hierarchy + Timeline */}
      <section className="mt-20 grid gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading
            floor="02"
            label="Chain of command"
            title="Supervised at Every Level"
            subtitle="Every job — from a routine service visit to a full overhaul — passes through a clear chain of engineering supervision. No unsupervised work, ever."
          />
          <RevealGroup className="mt-8 space-y-0">
            {HIERARCHY.map((role, i) => (
              <RevealItem key={role}>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`h-3 w-3 rounded-full ${i === 0 ? "bg-[var(--brass)]" : "border-2 border-[var(--green)]"}`} />
                    {i < HIERARCHY.length - 1 && <span className="h-8 w-px bg-[var(--line)]" />}
                  </div>
                  <span className={`-mt-8 text-sm ${i === 0 ? "font-semibold text-[var(--green)]" : "text-[var(--ink)]"}`}>
                    {role}
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div>
          <SectionHeading floor="03" label="Milestones" title="Trained Where Elevators Are Built" />
          <RevealGroup className="mt-8 space-y-5">
            {TIMELINE.map((t) => (
              <RevealItem key={t.year}>
                <div className="plate flex items-baseline gap-5 p-5">
                  <span className="display shrink-0 text-2xl text-[var(--brass)]">{t.year}</span>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{t.event}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Credentials + CTA */}
      <section className="mt-20">
        <Reveal>
          <div className="enamel flex flex-col items-center gap-6 rounded-[3px] p-10 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--brass)]">Registered &amp; certified</p>
            <p className="max-w-2xl text-sm leading-relaxed text-[#a9bcb0]">
              {settings.company_name} is NTN-registered and holds an account maintenance certificate —
              a fully documented, tax-registered Pakistani business you can contract with confidence,
              whether you manage one building or a national portfolio.
            </p>
            <Link href="/contact" className="btn-primary">Work With Us →</Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
