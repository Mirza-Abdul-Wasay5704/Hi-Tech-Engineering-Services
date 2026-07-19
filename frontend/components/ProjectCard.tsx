/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { mediaUrl } from "@/lib/api";
import type { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="plate group block overflow-hidden">
      <div className="relative flex h-40 items-center justify-center overflow-hidden border-b border-[var(--line)] bg-[var(--green-wash)]">
        {project.image_url ? (
          <>
            <img
              src={mediaUrl(project.image_url)}
              alt={`${project.name} — elevator services project`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {project.logo_url && (
              <span className="absolute bottom-2 right-2 flex h-11 w-20 items-center justify-center rounded-[2px] border border-[var(--line)] bg-white/95 px-2 shadow-sm">
                <img
                  src={mediaUrl(project.logo_url)}
                  alt={`${project.client_name || project.name} logo`}
                  className="max-h-8 max-w-full object-contain"
                  loading="lazy"
                />
              </span>
            )}
          </>
        ) : project.logo_url ? (
          <span className="flex h-20 w-40 items-center justify-center rounded-[2px] border border-[var(--line)] bg-white px-4">
            <img
              src={mediaUrl(project.logo_url)}
              alt={`${project.client_name || project.name} logo`}
              className="max-h-14 max-w-full object-contain"
              loading="lazy"
            />
          </span>
        ) : (
          <BuildingGlyph />
        )}
        <span className="absolute left-3 top-3 rounded-[2px] border border-[var(--brass)] bg-[var(--panel)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--brass)]">
          {project.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-sans text-lg font-semibold transition-colors group-hover:text-[var(--green)]">
          {project.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
          {project.scope_of_work || project.description}
        </p>
        <span className="mt-3 inline-block font-mono text-xs tracking-widest text-[var(--green)] opacity-0 transition-opacity group-hover:opacity-100">
          VIEW PROJECT →
        </span>
      </div>
    </Link>
  );
}

function BuildingGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 text-[var(--line)]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="14" y="8" width="36" height="48" />
      <path d="M14 56h36M20 16h6M30 16h6M40 16h4M20 26h6M30 26h6M40 26h4M20 36h6M30 36h6M40 36h4M28 46h8v10h-8z" />
    </svg>
  );
}
