import { getProject, getProjects } from "@/lib/content/source";
import { notFound } from "next/navigation";
import { getProjectImage, hasRealPhotos } from "@/lib/project-image";
import ProjectGallery from "@/components/site/ProjectGallery";
import ProjectCard from "@/components/site/ProjectCard";
import AnimatedSection from "@/components/site/AnimatedSection";
import Link from "next/link";
import type { Metadata } from "next";
import type { Project } from "@/lib/content/types";

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

/** Dark-styled Mapbox static map with a gold pin, matching the site map aesthetic. */
function staticMapUrl(project: Project): string | null {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return null;
  const [lng, lat] = project.coordinates;
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-l+c9a96e(${lng},${lat})/${lng},${lat},9.4,0/1200x440@2x?access_token=${token}`;
}

/**
 * Related developments: same-county projects with real photos first, then at
 * most ONE same-county stock-fallback card (two identical fallback images side
 * by side reads as a glitch), topped up with photo-rich projects elsewhere.
 */
function relatedProjects(all: Project[], current: Project): Project[] {
  const sameCounty = all.filter((p) => p.slug !== current.slug && p.county === current.county);
  const ranked = [
    ...sameCounty.filter(hasRealPhotos),
    ...sameCounty.filter((p) => !hasRealPhotos(p)).slice(0, 1),
  ];
  if (ranked.length >= 3) return ranked.slice(0, 3);
  const fill = all.filter(
    (p) => p.slug !== current.slug && p.county !== current.county && hasRealPhotos(p)
  );
  return [...ranked, ...fill].slice(0, 3);
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  const related = relatedProjects(projects, project);
  const mapUrl = staticMapUrl(project);

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
        <a
          href="/projects"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase mb-12 transition-colors hover:text-[--color-gold]"
          style={{ color: "var(--color-text-muted)" }}
        >
          ← Back to Map
        </a>

        <div className="flex items-center gap-4 mb-6">
          <span
            className="text-xs tracking-[0.15em] uppercase border px-3 py-1"
            style={{ borderColor: "var(--color-border-gold)", color: "var(--color-gold)" }}
          >
            {project.type.replace(/-/g, " ")}
          </span>
          <span
            className="text-xs tracking-[0.1em] uppercase"
            style={{ color: project.status === "completed" || project.status === "fully-leased" ? "#6DC87A" : "var(--color-gold)" }}
          >
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

        {/* Location map */}
        {mapUrl && (
          <div className="mt-20">
            <AnimatedSection>
              <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>Location</p>
              <div className="relative overflow-hidden border" style={{ borderColor: "var(--color-border-custom)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mapUrl}
                  alt={`Map showing the location of ${project.name} in ${project.county} County, Georgia`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.55)" }}
                />
                <div className="absolute bottom-4 left-4">
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5"
                    style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(201,169,110,0.3)", color: "var(--color-gold)" }}
                  >
                    {project.location}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        )}

        {/* Related developments */}
        {related.length > 0 && (
          <div className="mt-24">
            <AnimatedSection>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>Keep Exploring</p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-none">
                    More in {project.county} County
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase pb-1 border-b transition-all duration-300 hover:gap-4"
                  style={{ borderColor: "rgba(201,169,110,0.3)", color: "var(--color-text-muted)" }}
                >
                  All Developments <span style={{ color: "var(--color-gold)" }}>→</span>
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Prev / next portfolio navigation */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: "var(--color-border-custom)" }}>
          <Link
            href={`/projects/${prev.slug}`}
            className="group flex flex-col gap-2 p-8 transition-colors duration-300"
            style={{ background: "var(--color-surface)" }}
          >
            <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "var(--color-text-subtle)" }}>
              ← Previous
            </span>
            <span className="font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-[--color-gold]">
              {prev.name}
            </span>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="group flex flex-col gap-2 p-8 text-right transition-colors duration-300"
            style={{ background: "var(--color-surface)" }}
          >
            <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "var(--color-text-subtle)" }}>
              Next →
            </span>
            <span className="font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-[--color-gold]">
              {next.name}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
