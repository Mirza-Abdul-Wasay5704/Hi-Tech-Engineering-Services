import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/motion";
import { getSettings } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us — Request an Elevator Maintenance Quote in Karachi",
  description:
    "Contact Hi-Tech Engineering Services for elevator maintenance, modernization, overhauling or spare parts in Karachi. Call 0331-2437499 / 021-36361971 or send an inquiry — response within one business day.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-32">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }])} />
      <SectionHeading
        floor="C"
        label="Contact"
        title="Talk to an Elevator Engineer"
        subtitle="Whether it's a breakdown, a maintenance contract, a modernization assessment or a spare part — describe it once and the right person will call you back."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_380px]">
        <Reveal>
          <ContactForm />
        </Reveal>

        <div className="space-y-5">
          <Reveal delay={0.1}>
            <div className="plate-static p-6">
              <p className="mono-tag">Phone</p>
              <ul className="mt-3 space-y-2">
                {settings.phones.map((p) => (
                  <li key={p}>
                    <a href={`tel:${p.replace(/[^+\d]/g, "")}`} className="text-lg font-semibold hover:text-[var(--green)]">
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-[var(--muted)]">{settings.hours}</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="plate-static p-6">
              <p className="mono-tag">Email</p>
              <a href={`mailto:${settings.email}`} className="mt-3 block break-all font-medium hover:text-[var(--green)]">
                {settings.email}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="plate-static p-6">
              <p className="mono-tag">Office</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{settings.address}</p>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="plate-static overflow-hidden">
              <iframe
                title="Hi-Tech Engineering Services office location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(settings.map_query)}&output=embed`}
                className="h-64 w-full border-0 grayscale-[0.4] contrast-[0.9]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
