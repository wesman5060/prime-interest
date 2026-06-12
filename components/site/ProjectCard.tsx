"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/lib/content/types";
import { getProjectImage } from "@/lib/project-image";

function statusColor(status: Project["status"]) {
  return status === "completed" || status === "fully-leased" ? "#6DC87A" : "var(--color-gold)";
}

interface Props { project: Project; index?: number }

export default function ProjectCard({ project, index = 0 }: Props) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.75, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group relative block overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        style={{
          background: "var(--color-surface)",
          border: `1px solid ${hovered ? "rgba(201,169,110,0.5)" : "rgba(255,255,255,0.05)"}`,
          transition: "border-color 0.35s ease, box-shadow 0.35s ease",
          boxShadow: hovered ? "0 0 40px rgba(201,169,110,0.08)" : "none",
        }}
      >
        {/* Cursor glow */}
        {hovered && (
          <div
            className="pointer-events-none absolute z-10 rounded-full"
            style={{
              width: 240,
              height: 240,
              left: mousePos.x - 120,
              top: mousePos.y - 120,
              background: "radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)",
            }}
          />
        )}

        {/* Image — plat-style frame with survey corner ticks */}
        <div className="relative overflow-hidden" style={{ height: "220px" }}>
          <motion.img
            src={getProjectImage(project)}
            alt={project.name}
            className="img-grade w-full h-full object-cover"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />

          {/* Survey corner ticks */}
          <span className="plat-corner tl" />
          <span className="plat-corner tr" />
          <span className="plat-corner bl" />
          <span className="plat-corner br" />

          {/* Parcel number */}
          <div className="absolute top-5 left-6 z-10 flex items-baseline gap-1.5">
            <span className="text-[8px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.55)" }}>Parcel</span>
            <span className="font-display text-xl font-bold leading-none" style={{ color: "rgba(201,169,110,0.6)" }}>{num}</span>
          </div>

          {/* Type badge */}
          <div className="absolute top-4 right-6 z-10">
            <span
              className="text-[9px] tracking-[0.18em] uppercase px-2.5 py-1"
              style={{
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(201,169,110,0.3)",
                color: "var(--color-gold)",
              }}
            >
              {project.type.replace(/-/g, " ")}
            </span>
          </div>

          {/* Acreage — survey annotation in the plat frame */}
          {project.acreage && (
            <div className="absolute bottom-4 right-6 z-10">
              <span className="text-[10px] tracking-[0.18em] tabular-nums" style={{ color: "rgba(201,169,110,0.75)" }}>
                ± {project.acreage} AC
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="font-display text-xl font-bold leading-tight transition-colors duration-300"
              style={{ color: hovered ? "var(--color-gold)" : "#fff" }}
            >
              {project.name}
            </h3>
            <motion.span
              animate={{ x: hovered ? 5 : 0, opacity: hovered ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
              style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: 4 }}
            >
              →
            </motion.span>
          </div>

          <p className="text-xs mb-4" style={{ color: "var(--color-text-subtle)" }}>
            {project.location}
          </p>

          <p className="text-sm leading-relaxed line-clamp-2 mb-6" style={{ color: "var(--color-text-muted)", opacity: 0.75 }}>
            {project.description}
          </p>

          <div
            className="pt-4 border-t flex items-center justify-between"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <span className="text-[9px] tracking-[0.2em] uppercase font-medium" style={{ color: statusColor(project.status) }}>
              {project.status.replace(/-/g, " ")}
            </span>
            <span className="text-[10px] tracking-wider" style={{ color: "var(--color-text-subtle)" }}>
              {project.county} County
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
