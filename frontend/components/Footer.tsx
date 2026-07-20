import Link from "next/link";
import { COMPANY } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="enamel mt-24">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Hi-Tech Engineering Services logo"
                className="h-11 w-auto rounded-[4px] bg-[var(--paper)] p-1"
                width={48}
                height={44}
              />
              <span className="display text-xl tracking-wide">
                HI-TECH <span className="text-[var(--brass)]">ENGINEERING</span> SERVICES
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#a9bcb0]">
              {COMPANY.tagline}. Serving Karachi&apos;s landmark buildings since {COMPANY.founded}.
            </p>
            <p className="mt-4 font-mono text-xs leading-relaxed text-[#a9bcb0]">
              {COMPANY.address.street},<br />
              {COMPANY.address.city}, Pakistan
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-[var(--brass)]">Services</h3>
            <ul className="space-y-2.5 text-sm text-[#a9bcb0]">
              <li><Link className="hover:text-white" href="/services/elevator-maintenance-karachi">Elevator Maintenance</Link></li>
              <li><Link className="hover:text-white" href="/services/elevator-modernization">Modernization &amp; Retrofitting</Link></li>
              <li><Link className="hover:text-white" href="/services/mechanical-electrical-overhauling">Overhauling</Link></li>
              <li><Link className="hover:text-white" href="/services/elevator-spare-parts-pakistan">Spare Parts</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-[var(--brass)]">Contact</h3>
            <ul className="space-y-2.5 text-sm text-[#a9bcb0]">
              {COMPANY.phones.map((p) => (
                <li key={p}>
                  <a className="hover:text-white" href={`tel:${p.replace(/[^+\d]/g, "")}`}>
                    {p}
                  </a>
                </li>
              ))}
              <li>
                <a className="break-all hover:text-white" href={`mailto:${COMPANY.email}`}>
                  {COMPANY.email}
                </a>
              </li>
              <li><Link className="hover:text-white" href="/contact">Request a Quote →</Link></li>
            </ul>
          </div>
        </div>

        {/* Data plate — like the capacity plate inside every cab */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[rgba(233,238,233,0.25)] pt-6 font-mono text-[11px] tracking-wider text-[#a9bcb0] md:flex-row">
          <span>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</span>
          <span className="tracking-[0.2em]">EST. {COMPANY.founded} · NTN REGISTERED · KARACHI, PAKISTAN</span>
        </div>
      </div>
    </footer>
  );
}
