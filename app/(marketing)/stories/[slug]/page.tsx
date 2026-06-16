import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import AnimatedSection from "@/components/site/AnimatedSection";
import ProjectCard from "@/components/site/ProjectCard";
import StoryMap from "@/components/site/StoryMap";
import { STORIES, getStoryBySlug, getRelatedProjects } from "@/content/stories";

export async function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return {};
  return {
    title: story.title,
    description: story.dek,
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const related = getRelatedProjects(story);

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/topo.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-64 -top-40 w-[860px] max-w-none opacity-[0.06]"
        />
        <div className="relative pt-40 pb-12 px-8 max-w-5xl mx-auto">
          <AnimatedSection>
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase mb-10 transition-colors hover:text-[color:var(--color-gold)]"
              style={{ color: "var(--color-text-subtle)" }}
            >
              <span aria-hidden>←</span> All stories
            </Link>
          </AnimatedSection>
          <AnimatedSection delay={0.05}>
            <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: "var(--color-gold)" }}>
              {story.eyebrow}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.12}>
            <h1
              className="font-display font-bold leading-[0.95] text-white mb-10"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
            >
              {story.title}
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p
              className="text-xl md:text-2xl leading-relaxed max-w-3xl"
              style={{ color: "var(--color-text-muted)", lineHeight: 1.6, fontStyle: "italic" }}
            >
              {story.dek}
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* ── Corridor map ── */}
      <div
        className="relative"
        style={{
          borderTop: "1px solid var(--color-border-custom)",
          borderBottom: "1px solid var(--color-border-custom)",
        }}
      >
        <div className="h-[60vh] min-h-[440px] w-full">
          <StoryMap center={story.mapCenter} zoom={story.mapZoom} pins={story.pins} />
        </div>
        <div
          className="px-8 py-5 max-w-7xl mx-auto flex items-center justify-between text-[10px] tracking-[0.25em] uppercase"
          style={{ color: "var(--color-text-subtle)" }}
        >
          <span>{story.pins.length} locations · click a pin for detail</span>
          <span className="tabular-nums">
            {story.mapCenter[1].toFixed(4)}° N · {Math.abs(story.mapCenter[0]).toFixed(4)}° W
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <article className="px-8 py-20 md:py-28 max-w-3xl mx-auto">
        {story.sections.map((section, i) => (
          <AnimatedSection key={section.heading} delay={i * 0.05}>
            <section className="mb-20 last:mb-0">
              <p
                className="text-[10px] tracking-[0.35em] uppercase mb-4 tabular-nums"
                style={{ color: "var(--color-gold)" }}
              >
                § {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
                {section.heading}
              </h2>
              {section.body.map((para, j) => (
                <p
                  key={j}
                  className="text-base md:text-lg leading-relaxed mb-6"
                  style={{ color: "var(--color-text-muted)", lineHeight: 1.9 }}
                >
                  {para}
                </p>
              ))}
              {section.pullQuote && (
                <blockquote
                  className="my-12 pl-8 border-l-2"
                  style={{ borderColor: "var(--color-gold)" }}
                >
                  <p
                    className="font-display text-2xl md:text-3xl leading-snug text-white"
                    style={{ fontStyle: "italic" }}
                  >
                    &ldquo;{section.pullQuote.text}&rdquo;
                  </p>
                  {section.pullQuote.attribution && (
                    <footer
                      className="mt-4 text-[10px] tracking-[0.25em] uppercase"
                      style={{ color: "var(--color-text-subtle)" }}
                    >
                      — {section.pullQuote.attribution}
                    </footer>
                  )}
                </blockquote>
              )}
            </section>
          </AnimatedSection>
        ))}
      </article>

      {/* ── Related ── */}
      {related.length > 0 && (
        <div
          style={{
            background: "var(--color-surface)",
            borderTop: "1px solid var(--color-border-custom)",
          }}
        >
          <div className="py-20 px-8 max-w-7xl mx-auto">
            <AnimatedSection>
              <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>
                In this story
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-12 leading-none">
                Projects on the corridor
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((project, i) => (
                <ProjectCard key={project.slug} project={project} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA strip ── */}
      <div
        className="relative overflow-hidden"
        style={{
          borderTop: "1px solid var(--color-border-custom)",
          borderBottom: "1px solid var(--color-border-custom)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/topo.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -left-48 -bottom-40 w-[760px] max-w-none opacity-[0.05]"
        />
        <div className="relative py-20 px-8 max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>
              Have land on a corridor like this one?
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-10 leading-tight">
              We&rsquo;d like to hear about it.
            </h2>
            <Link
              href="/acquisitions"
              className="gold-sheen inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.25em] uppercase font-medium transition-colors"
              style={{
                background: "var(--color-gold)",
                color: "#0a0a0a",
              }}
            >
              Start a conversation <span aria-hidden>→</span>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
