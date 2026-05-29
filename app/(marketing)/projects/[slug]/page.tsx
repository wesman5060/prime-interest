import { getProject, getProjects } from "@/lib/content/source";
import { notFound } from "next/navigation";
import { getProjectImage, hasRealPhotos } from "@/lib/project-image";
import ProjectGallery from "@/components/site/ProjectGallery";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const image = getProjectImage(project);
  return {
    title: project.name,
    description: project.description,
    openGraph: {
      images: [{ url: image, width: 1200, height: 630, alt: project.name }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const details: { label: string; value: string | number }[] = [
    project.units ? { label: "Units", value: project.units } : null,
    project.beds ? { label: "Beds", value: project.beds } : null,
    project.lots ? { label: "Lots", value: project.lots } : null,
    project.acreage ? { label: "Acreage", value: `${project.acreage} ac` } : null,
    project.sqft ? { label: "Sq Footage", value: project.sqft } : null,
    project.price ? { label: "Value", value: project.price } : null,
    project.partner ? { label: "Partner", value: project.partner } : null,
    { label: "County", value: `${project.county} County` },
  ].filter(Boolean) as { label: string; value: string | number }[];

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-8">
        <a href="/projects" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase mb-12 transition-colors hover:text-[--color-gold]"
          style={{ color: "var(--color-text-muted)" }}>
          ← Back to Map
        </a>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs tracking-[0.15em] uppercase border px-3 py-1"
            style={{ borderColor: "var(--color-border-gold)", color: "var(--color-gold)" }}>
            {project.type.replace(/-/g, " ")}
          </span>
          <span className="text-xs tracking-[0.1em] uppercase"
            style={{ color: project.status === "completed" || project.status === "fully-leased" ? "#6DC87A" : "var(--color-gold)" }}>
            {project.status.replace(/-/g, " ")}
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4 leading-none">
          {project.name}
        </h1>
        <p className="text-lg mb-16" style={{ color: "var(--color-text-muted)" }}>{project.location}</p>

        <ProjectGallery
          images={hasRealPhotos(project) ? project.images : [getProjectImage(project)]}
          name={project.name}
          isRepresentative={!hasRealPhotos(project)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Description */}
          <div className="md:col-span-2">
            <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>About This Development</p>
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{project.description}</p>
          </div>

          {/* Details */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>Project Details</p>
            <div className="space-y-4">
              {details.map((d) => (
                <div key={d.label} className="pb-4 border-b" style={{ borderColor: "var(--color-border)" }}>
                  <p className="text-xs tracking-[0.1em] uppercase mb-1" style={{ color: "var(--color-text-subtle)" }}>{d.label}</p>
                  <p className="text-sm font-medium" style={{ color: "var(--color-gold)" }}>{d.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
