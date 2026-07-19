import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ProjectsGrid from "@/components/ProjectsGrid";
import { getProjects } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projects — Landmark Buildings We Maintain in Karachi",
  description:
    "Elevator maintenance projects by Hi-Tech Engineering Services: Avari Hotel, Pearl Continental, Pakistan Stock Exchange, PARCO, Tabba Heart Institute, Liaquat National Hospital and 20+ more Karachi landmarks.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-32">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Projects", url: "/projects" }])} />
      <SectionHeading
        floor="P"
        label="Portfolio"
        title="Buildings That Trust Us"
        subtitle="Every project below is an active or completed engagement — hotels, hospitals, financial institutions, industrial facilities and residential towers across Karachi."
      />
      <ProjectsGrid projects={projects} />
    </div>
  );
}
