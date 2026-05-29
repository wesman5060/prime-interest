"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

const HERO_IMAGE = "/images/hero.jpg";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: i * 0.18, ease: EASE },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <motion.div className="absolute inset-0 z-0 scale-110" style={{ y: imageY }}>
        <Image
          src={HERO_IMAGE}
          alt="Prime Interest — Georgia Land Development"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 z-10" style={{ background: "rgba(0,0,0,0.55)" }} />
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 80%, #000 100%)" }} />
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)" }} />

      {/* Content */}
      <motion.div
        className="relative z-20 text-center px-6 max-w-6xl mx-auto w-full"
        style={{ opacity, y: contentY }}
      >
        {/* Eyebrow with decorative lines */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="h-px w-12" style={{ background: "var(--color-gold)" }} />
          <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: "var(--color-gold)" }}>
            Est. 1990 &nbsp;·&nbsp; Buford, Georgia
          </span>
          <div className="h-px w-12" style={{ background: "var(--color-gold)" }} />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-display font-bold text-white leading-[0.88] tracking-tight mb-8"
          style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
        >
          Building<br />
          <em className="not-italic" style={{ color: "var(--color-gold)" }}>Georgia's</em><br />
          Future
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-base md:text-xl max-w-lg mx-auto mb-14 leading-relaxed font-light"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          46 developments across Georgia — residential, commercial,
          student housing, and mixed-use projects that shape communities.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.3em] uppercase font-medium transition-all duration-400 hover:gap-5"
            style={{ background: "var(--color-gold)", color: "#000" }}
          >
            View All Projects <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.3em] uppercase transition-all duration-300 hover:bg-white/8"
            style={{
              border: "1px solid rgba(201,169,110,0.4)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Get in Touch
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Scroll</span>
          <div className="w-px h-14" style={{ background: "linear-gradient(to bottom, var(--color-gold), transparent)" }} />
        </motion.div>
      </motion.div>

      {/* Bottom stat bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8, ease: EASE }}
        className="absolute bottom-0 left-0 right-0 z-20 hidden md:flex"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        {[
          { value: "46+", label: "Developments" },
          { value: "1990", label: "Developing Since" },
          { value: "15+", label: "Counties" },
          { value: "35+", label: "Partners" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="flex-1 flex flex-col items-center py-4 text-center"
            style={{
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span className="font-display font-bold text-lg" style={{ color: "var(--color-gold)" }}>{s.value}</span>
            <span className="text-[9px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
