"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import AnimatedSection from "@/components/site/AnimatedSection";

export interface TimelineItem {
  year: string;
  heading: string;
  body: string;
}

/**
 * The About-page milestones, with a spine that draws itself in gold as the
 * reader scrolls through the company's history, and dots that ignite as
 * their era passes the center of the viewport.
 */
export default function Timeline({ items }: { items: TimelineItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.55"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.6 });

  return (
    <div className="relative" ref={ref}>
      {/* Static faint rule — centered on desktop, left rail on mobile */}
      <div
        className="absolute top-0 bottom-0 w-px left-[7px] md:left-1/2 md:-translate-x-1/2"
        style={{ background: "var(--color-border-custom)" }}
      />
      {/* Gold fill that draws with scroll — same rail at both breakpoints */}
      <motion.div
        className="absolute top-0 bottom-0 w-px left-[7px] md:left-1/2 md:-translate-x-1/2 origin-top"
        style={{
          scaleY,
          background: "linear-gradient(to bottom, rgba(201,169,110,0.9), rgba(201,169,110,0.45))",
        }}
      />

      <div className="space-y-0">
        {items.map((item, i) => (
          <AnimatedSection key={item.year} delay={i * 0.07} direction={i % 2 === 0 ? "left" : "right"}>
            <div className={`relative grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-24 py-9 md:py-12 pl-9 md:pl-0 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
              {/* Dot — left rail on mobile, center on desktop. Ignites gold as its milestone reaches the viewport center. */}
              <motion.div
                className="absolute top-[2.9rem] md:top-4 left-[2px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full border-2 z-10"
                initial={{ borderColor: "rgba(201,169,110,0.35)", backgroundColor: "var(--color-bg)", scale: 1 }}
                whileInView={{
                  borderColor: "rgba(201,169,110,1)",
                  backgroundColor: "rgba(201,169,110,1)",
                  scale: 1.25,
                  boxShadow: "0 0 18px rgba(201,169,110,0.45)",
                }}
                viewport={{ once: true, margin: "-45% 0px -45% 0px" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Year side */}
              <div className={`flex items-start gap-6 ${i % 2 === 0 ? "md:text-right md:justify-end" : "md:order-2"}`}>
                <div className={`flex flex-col ${i % 2 === 0 ? "md:items-end" : ""}`}>
                  <span className="font-display text-4xl md:text-5xl font-bold leading-none mb-2 md:mb-3" style={{ color: "rgba(201,169,110,0.32)" }}>
                    {item.year}
                  </span>
                  <span className="text-sm font-medium tracking-wider text-white">{item.heading}</span>
                </div>
              </div>

              {/* Content side */}
              <div className={`mt-3 md:mt-0 ${i % 2 === 0 ? "md:order-2" : ""}`}>
                <p className="text-base leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{item.body}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
