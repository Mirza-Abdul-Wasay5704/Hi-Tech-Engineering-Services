import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/motion";
import { ServiceIcon } from "@/components/icons";
import { getServices } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Elevator Services in Karachi — Maintenance, Modernization, Overhauling & Parts",
  description:
    "Complete elevator services in Karachi, Pakistan: monthly maintenance contracts, modernization & retrofitting, mechanical & electrical overhauling, and spare parts supply. 26+ years of expertise.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-32">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Services", url: "/services" }])} />
      <SectionHeading
        floor="S"
        label="Services"
        title="Everything Your Elevators Need"
        subtitle="Four disciplines, one accountable team. Every service below is delivered by our own engineers, supervisors and trained fitters — never subcontracted."
      />
      <RevealGroup className="mt-14 grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <RevealItem key={s.id}>
            <Link href={`/services/${s.slug}`} className="plate group flex h-full flex-col p-8">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[2px] bg-[var(--green-wash)] text-[var(--green)]">
                  <ServiceIcon icon={s.icon} className="h-8 w-8" />
                </span>
                <h2 className="font-sans text-xl font-semibold leading-snug transition-colors group-hover:text-[var(--green)]">
                  {s.name}
                </h2>
              </div>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[var(--muted)]">{s.summary}</p>
              <ul className="mt-5 grid gap-1.5 text-sm text-[var(--muted)]">
                {(s.scope_items || []).slice(0, 3).map((item) => (
                  <li key={item.label} className="flex gap-2">
                    <span className="text-[var(--brass)]" aria-hidden>▸</span>
                    {item.label}
                  </li>
                ))}
              </ul>
              <span className="mt-6 font-mono text-xs tracking-widest text-[var(--green)]">FULL DETAILS →</span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
