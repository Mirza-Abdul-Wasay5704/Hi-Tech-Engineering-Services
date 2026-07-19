import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Faq from "@/components/Faq";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { ServiceIcon } from "@/components/icons";
import { getService, getServices } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: service.seo_title || service.name,
    description: service.seo_description || service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.seo_title || service.name, description: service.seo_description || service.summary },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-32">
      <JsonLd
        data={[
          serviceJsonLd(service),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: service.name, url: `/services/${service.slug}` },
          ]),
          ...(service.faq?.length ? [faqJsonLd(service.faq)] : []),
        ]}
      />

      <div className="relative">
        <Reveal>
          <div className="landing">
            <span className="floor-plate">S</span>
            <span className="landing-label">Service</span>
          </div>
          <div className="mt-6 flex items-start gap-5">
            <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-[2px] bg-[var(--green-wash)] text-[var(--green)] md:flex">
              <ServiceIcon icon={service.icon} className="h-9 w-9" />
            </span>
            <div>
              <h1 className="display text-5xl md:text-7xl">{service.name}</h1>
            </div>
          </div>
        </Reveal>

        {/* Direct-answer block — the paragraph search engines and LLMs quote */}
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-3xl border-l-[3px] border-[var(--brass)] pl-5 text-[16px] leading-relaxed text-[var(--ink)]">
            {service.answer_block || service.summary}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Get a Quote →</Link>
            <Link href="/projects" className="btn-ghost">See Our Projects</Link>
          </div>
        </Reveal>
      </div>

      {/* Scope */}
      {service.scope_items?.length > 0 && (
        <section className="mt-20">
          <SectionHeading floor="01" label="Scope of work" title="What's Included" />
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.scope_items.map((item) => (
              <RevealItem key={item.label}>
                <div className="plate h-full p-6">
                  <h3 className="font-sans font-semibold">{item.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.detail}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {/* Body */}
      {service.body && (
        <section className="mt-20 grid gap-12 lg:grid-cols-[1fr_340px]">
          <Reveal>
            <article className="prose-body max-w-3xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{service.body}</ReactMarkdown>
            </article>
          </Reveal>
          <aside>
            <Reveal delay={0.1}>
              <div className="plate-static sticky top-24 p-6">
                <p className="mono-tag">Talk to an engineer</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  Describe your building and elevators — we&apos;ll respond with a clear scope and quote, usually within one business day.
                </p>
                <Link href="/contact" className="btn-primary mt-5 w-full justify-center">Request a Quote</Link>
              </div>
            </Reveal>
          </aside>
        </section>
      )}

      {/* FAQ */}
      {service.faq?.length > 0 && (
        <section className="mt-20 max-w-3xl">
          <SectionHeading floor="02" label="FAQ" title="Common Questions" />
          <div className="mt-8">
            <Faq items={service.faq} />
          </div>
        </section>
      )}
    </div>
  );
}
