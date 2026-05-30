"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from "framer-motion";
import { getPortfolioStats } from "@/lib/content/stats";

const stats = getPortfolioStats();
const STAT_BAR = [
  { value: `${stats.projectCount}+`, label: "Developments" },
  { value: String(stats.developingSince), label: "Developing Since" },
  { value: `${stats.residentialDelivered.toLocaleString()}+`, label: "Homes Delivered" },
  { value: `${stats.countyCount}`, label: "Georgia Counties" },
];

const CLIPS = [
  { src: "https://videos.pexels.com/video-files/33945045/14403569_2560_1440_25fps.mp4", brightness: 1.0 },
  { src: "https://videos.pexels.com/video-files/36525706/15488174_3840_2160_24fps.mp4", brightness: 1.0 },
  { src: "https://videos.pexels.com/video-files/11491400/11491400-uhd_3840_2160_30fps.mp4", brightness: 1.0 },
  { src: "https://videos.pexels.com/video-files/33327315/14191637_3840_2160_30fps.mp4", brightness: 1.0 },
];

const CLIP_DURATION = 9000;
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
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [clipIndex, setClipIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setClipIndex((i) => (i + 1) % CLIPS.length);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(advance, CLIP_DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [clipIndex, advance]);

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Cycling video background */}
      <motion.div className="absolute inset-0 z-0 scale-110" style={{ y: videoY }}>
        <AnimatePresence mode="sync">
          <motion.video
            key={clipIndex}
            src={CLIPS[clipIndex].src}
            autoPlay
            muted
            playsInline
            onEnded={advance}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: `brightness(${CLIPS[clipIndex].brightness})` }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Layered overlays */}
      <div className="absolute inset-0 z-10" style={{ background: "rgba(0,0,0,0.52)" }} />
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 80%, #000 100%)" }} />
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)" }} />

      {/* Content */}
      <motion.div
        className="relative z-20 text-center px-6 max-w-6xl mx-auto w-full"
        style={{ opacity, y: contentY }}
      >
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
            href="/acquisitions"
            className="inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.3em] uppercase transition-all duration-300 hover:bg-white/8"
            style={{
              border: "1px solid rgba(201,169,110,0.4)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Acquisitions
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
        {STAT_BAR.map((s, i) => (
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
