/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import { Reveal } from "@/components/motion";
import { getProject, getProjects, mediaUrl } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — Elevator Services Project`,
    description: project.scope_of_work || project.description,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();
  const related = all.filter((p) => p.category === project.category && p.id !== project.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-32">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
          { name: project.name, url: `/projects/${project.slug}` },
        ])}
      />
      <Reveal>
        <div className="landing">
          <span className="floor-plate">P</span>
          <span className="landing-label">{project.category} — {project.location}</span>
        </div>
        <h1 className="display mt-6 text-5xl md:text-7xl">{project.name}</h1>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <Reveal delay={0.1}>
          <div>
            {project.image_url && (
              <img
                src={mediaUrl(project.image_url)}
                alt={`${project.name} building`}
                className="mb-8 w-full rounded-[3px] border border-[var(--line)] object-cover"
              />
            )}
            <h2 className="display text-3xl">Scope of Work</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-[var(--muted)]">
              {project.scope_of_work || project.description}
            </p>
            {project.description && project.description !== project.scope_of_work && (
              <p className="mt-3 max-w-2xl leading-relaxed text-[var(--muted)]">{project.description}</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="plate-static sticky top-24 p-6">
            {project.logo_url && (
              <div className="mb-5 flex h-20 items-center justify-center rounded-[2px] bg-[var(--green-wash)] p-4">
                <img
                  src={mediaUrl(project.logo_url)}
                  alt={`${project.client_name || project.name} logo`}
                  className="max-h-12 object-contain"
                />
              </div>
            )}
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Client</dt>
                <dd className="mt-1 font-medium">{project.client_name || project.name}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Category</dt>
                <dd className="mt-1 font-medium">{project.category}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Location</dt>
                <dd className="mt-1 font-medium">{project.location}</dd>
              </div>
              {project.elevator_types && (
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Elevator Types</dt>
                  <dd className="mt-1 font-medium">{project.elevator_types}</dd>
                </div>
              )}
            </dl>
            <Link href="/contact" className="btn-primary mt-6 w-full justify-center">
              Discuss a Similar Project
            </Link>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <div className="landing">
              <span className="floor-plate">+</span>
              <span className="landing-label">More {project.category.toLowerCase()} work</span>
            </div>
            <h2 className="display mt-6 text-4xl">Related Projects</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
