/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { mediaUrl } from "@/lib/api";
import type { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="plate group flex h-full flex-col overflow-hidden">
      {/* fixed media height keeps every card identical in the grid; photos are
          still shown in full (object-contain over a blurred fill) */}
      <div className="relative flex h-44 shrink-0 items-center justify-center overflow-hidden border-b border-[var(--line)] bg-[var(--green-wash)]">
        {project.image_url ? (
          <>
            {/* blurred fill so tall/wide photos are never cropped — the real
                photo sits on top, fully visible (object-contain) */}
            <img
              src={mediaUrl(project.image_url)}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl saturate-125"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-[var(--green-deep)]/25" aria-hidden />
            <img
              src={mediaUrl(project.image_url)}
              alt={`${project.name} — elevator services project`}
              className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
            {project.logo_url && (
              <span className="glass-tile absolute bottom-2 right-2 flex h-11 w-20 items-center justify-center rounded-[3px] px-2">
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
        <span className="glass-chip absolute left-3 top-3 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--brass)]">
          {project.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-sans text-[15px] font-semibold leading-snug transition-colors group-hover:text-[var(--green)]">
          {project.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--muted)]">
          {project.scope_of_work || project.description}
        </p>
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
