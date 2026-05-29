import { getProjects } from "@/lib/content/source";
import ProjectsExplorer from "@/components/site/ProjectsExplorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "46 developments across Georgia — residential, commercial, student housing, and mixed-use.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-8">
        <p className="mb-6 text-xs uppercase tracking-[0.3em]" style={{ color: "var(--color-gold)" }}>
          Portfolio
        </p>
        <h1 className="mb-4 font-display text-5xl font-bold leading-none text-white md:text-7xl">
          All Developments
        </h1>
        <p className="mb-16 text-lg" style={{ color: "var(--color-text-muted)" }}>
          {projects.length} developments across Georgia since 1990. Explore the map or filter the portfolio.
        </p>

        <ProjectsExplorer projects={projects} />
      </div>
    </div>
  );
}
