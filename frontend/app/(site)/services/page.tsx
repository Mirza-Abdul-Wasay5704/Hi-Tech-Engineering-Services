import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/motion";
import { ServiceIcon } from "@/components/icons";
import { getServices, mediaUrl } from "@/lib/api";
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
        subtitle="Five disciplines, one accountable team. Every service below is delivered by our own engineers, supervisors and trained fitters — never subcontracted."
      />
      <RevealGroup className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <RevealItem key={s.id} className="h-full">
            <Link href={`/services/${s.slug}`} className="plate group flex h-full flex-col overflow-hidden">
              {s.image_url && (
                <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden border-b border-[var(--line)] bg-[var(--green-wash)]">
                  {/* blurred fill so the whole photo stays visible — never cropped */}
                  <Image
                    src={mediaUrl(s.image_url)}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                    className="scale-110 object-cover blur-xl saturate-125"
                  />
                  <Image
                    src={mediaUrl(s.image_url)}
                    alt={s.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[var(--green-deep)]/60 to-transparent" aria-hidden />
                  <span className="glass-tile absolute bottom-2 left-2 flex h-9 w-9 items-center justify-center rounded-[3px] text-[var(--green)]">
                    <ServiceIcon icon={s.icon} className="h-5 w-5" />
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-3">
                  {!s.image_url && (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[2px] bg-[var(--green-wash)] text-[var(--green)]">
                      <ServiceIcon icon={s.icon} className="h-6 w-6" />
                    </span>
                  )}
                  <h2 className="font-sans text-[17px] font-semibold leading-snug transition-colors group-hover:text-[var(--green)]">
                    {s.name}
                  </h2>
                </div>
                <p className="mt-2.5 flex-1 text-[14px] leading-relaxed text-[var(--muted)]">{s.summary}</p>
                <ul className="mt-3.5 grid gap-1 text-[13px] text-[var(--muted)]">
                  {(s.scope_items || []).slice(0, 3).map((item) => (
                    <li key={item.label} className="flex gap-2">
                      <span className="text-[var(--brass)]" aria-hidden>·</span>
                      {item.label}
                    </li>
                  ))}
                </ul>
                <span className="mt-4 font-mono text-[11px] tracking-widest text-[var(--green)]">FULL DETAILS →</span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
