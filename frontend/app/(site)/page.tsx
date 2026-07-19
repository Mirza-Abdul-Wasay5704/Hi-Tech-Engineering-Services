import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import ScrollMarquee from "@/components/ScrollMarquee";
import LogoWall from "@/components/LogoWall";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { ServiceIcon } from "@/components/icons";
import { getProjects, getServices, getSettings, getTestimonials } from "@/lib/api";

const PROCESS = [
  { step: "01", title: "Inspect", text: "A thorough mechanical and electrical survey of your elevators — condition, safety and wear." },
  { step: "02", title: "Diagnose", text: "Systematic fault-finding and an honest report: what needs attention now, what can wait." },
  { step: "03", title: "Repair & Restore", text: "Overhauling, adjustments and genuine parts — executed by supervised, trained teams." },
  { step: "04", title: "Maintain", text: "A monthly preventive schedule with priority breakdown response, keeping downtime near zero." },
];

const CERTS = [
  { year: "1994", label: "Manufacturer Training — Korea" },
  { year: "1997", label: "Manufacturer Training — Korea" },
  { year: "2005", label: "Manufacturer Training — Korea" },
  { year: "2014", label: "Manufacturer Training — Korea" },
];

export default async function HomePage() {
  const [settings, projects, services, testimonials] = await Promise.all([
    getSettings(),
    getProjects(),
    getServices(),
    getTestimonials(),
  ]);
  const featured = projects.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      {/* ============ G — LOBBY (scroll-driven hero) ============ */}
      <HomeHero settings={settings} />

      {/* ============ signage marquee ============ */}
      <ScrollMarquee />

      {/* ============ 01 — SERVICES ============ */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <SectionHeading
          floor="01"
          label="What we do"
          title="Complete Elevator Engineering"
          subtitle="From monthly maintenance contracts to full modernization — one team, every discipline, all brands."
        />
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <RevealItem key={s.id}>
              <Link href={`/services/${s.slug}`} className="plate group flex h-full flex-col p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-[2px] bg-[var(--green-wash)] text-[var(--green)]">
                  <ServiceIcon icon={s.icon} />
                </span>
                <h3 className="mt-5 font-sans text-[17px] font-semibold leading-snug transition-colors group-hover:text-[var(--green)]">
                  {s.name}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[var(--muted)]">{s.summary}</p>
                <span className="mt-4 font-mono text-xs tracking-widest text-[var(--green)]">LEARN MORE →</span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ============ 02 — CLIENTS ============ */}
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            floor="02"
            label="Trusted by"
            title="Karachi's Landmarks Run on Our Work"
            subtitle="Hotels, hospitals, banks, refineries and the Pakistan Stock Exchange — buildings where elevator downtime is not an option."
          />
        </div>
        <div className="mt-12">
          <LogoWall projects={projects} />
        </div>
      </section>

      {/* ============ 03 — SELECTED WORK ============ */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading floor="03" label="Selected work" title="Featured Projects" />
            <Reveal>
              <Link href="/projects" className="btn-ghost">All Projects →</Link>
            </Reveal>
          </div>
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <RevealItem key={p.id}>
                <ProjectCard project={p} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {/* ============ 04 — METHOD (enamel band) ============ */}
      <section className="enamel">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <div className="landing">
              <span className="floor-plate">04</span>
              <span className="landing-label">How we work</span>
            </div>
            <h2 className="display mt-6 text-4xl md:text-6xl">Precision, Step by Step</h2>
          </Reveal>
          <RevealGroup className="mt-14 grid gap-5 md:grid-cols-4">
            {PROCESS.map((p) => (
              <RevealItem key={p.step}>
                <div className="plate h-full p-6">
                  <span className="font-mono text-sm font-semibold tracking-widest text-[var(--brass)]">STEP {p.step}</span>
                  <h3 className="mt-3 font-sans text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#a9bcb0]">{p.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ============ 05 — CREDENTIALS ============ */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              floor="05"
              label="Credentials"
              title="Factory-Trained, Internationally Certified"
              subtitle="Our senior engineers trained directly with elevator manufacturers in Korea across four programs — and hold NTN registration and account maintenance certification in Pakistan."
            />
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-[2px] border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 font-mono text-xs tracking-wider text-[var(--muted)]">
                  NTN REGISTERED
                </span>
                <span className="rounded-[2px] border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 font-mono text-xs tracking-wider text-[var(--muted)]">
                  ACCOUNT MAINTENANCE CERTIFIED
                </span>
                <span className="rounded-[2px] border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 font-mono text-xs tracking-wider text-[var(--muted)]">
                  SIGMA PANEL SPECIALISTS
                </span>
              </div>
            </Reveal>
          </div>
          <RevealGroup className="grid grid-cols-2 gap-4">
            {CERTS.map((c) => (
              <RevealItem key={c.year}>
                <div className="plate p-5 text-center">
                  <div className="display text-4xl text-[var(--brass)]">{c.year}</div>
                  <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">{c.label}</div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ============ 06 — TESTIMONIALS ============ */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-24">
          <SectionHeading floor="06" label="Word of mouth" title="What Clients Say" />
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <RevealItem key={t.id}>
                <figure className="plate-static h-full border-t-2 border-t-[var(--green)] p-6">
                  <blockquote className="text-sm leading-relaxed text-[var(--ink)]">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold">{t.author}</span>
                    <span className="block text-xs text-[var(--muted)]">
                      {[t.role, t.company].filter(Boolean).join(", ")}
                    </span>
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {/* ============ MR — MACHINE ROOM (CTA at the top of the ride) ============ */}
      <section className="mx-auto max-w-6xl px-5 pb-8">
        <Reveal>
          <div className="enamel rounded-[3px] p-10 md:p-16">
            <div className="landing max-w-xs">
              <span className="floor-plate">MR</span>
              <span className="landing-label">Machine room — top floor</span>
            </div>
            <h2 className="display mt-8 max-w-3xl text-4xl md:text-6xl">
              Your elevators deserve engineers, not just repairmen.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] text-[#a9bcb0]">
              Get a maintenance contract quote, a modernization assessment, or an honest second opinion — free of charge.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary">Request a Quote →</Link>
              <a href={`tel:${settings.phones[0]?.replace(/[^+\d]/g, "")}`} className="btn-ghost">
                Call {settings.phones[0]}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
