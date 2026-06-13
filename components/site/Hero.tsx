"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";
import { getPortfolioStats } from "@/lib/content/stats";
import CountUp from "@/components/site/CountUp";

const stats = getPortfolioStats();
const STAT_BAR = [
  { value: `${stats.projectCount}+`, label: "Developments" },
  { value: String(stats.developingSince), label: "Developing Since" },
  { value: `${stats.residentialDelivered.toLocaleString()}+`, label: "Homes Delivered" },
  { value: `${stats.countyCount}`, label: "Georgia Counties" },
];

/**
 * Two renditions per clip: 1080p for desktop (visually identical to 4K under
 * the dark overlays at a fraction of the bandwidth), 540p for phones.
 */
const CLIPS = [
  {
    desktop: "https://videos.pexels.com/video-files/33945045/14403568_1920_1080_25fps.mp4",
    mobile: "https://videos.pexels.com/video-files/33945045/14403566_960_540_25fps.mp4",
  },
  {
    desktop: "https://videos.pexels.com/video-files/36525706/15488170_1920_1080_24fps.mp4",
    mobile: "https://videos.pexels.com/video-files/36525706/15488166_960_540_24fps.mp4",
  },
  {
    desktop: "https://videos.pexels.com/video-files/11491400/11491400-hd_1920_1080_30fps.mp4",
    mobile: "https://videos.pexels.com/video-files/11491400/11491400-sd_960_540_30fps.mp4",
  },
  {
    desktop: "https://videos.pexels.com/video-files/33327315/14191635_1920_1080_30fps.mp4",
    mobile: "https://videos.pexels.com/video-files/33327315/14191633_960_540_30fps.mp4",
  },
];

/** First frame of clip 1 — paints instantly and backstops every crossfade. */
const POSTER = "/images/hero-poster.jpg";

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
  const reduceMotion = useReducedMotion();

  // Render video only after mount so phones never start fetching the desktop
  // rendition, and pick the rendition from the actual viewport.
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    setMounted(true);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const advance = useCallback(() => {
    setClipIndex((i) => (i + 1) % CLIPS.length);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    timerRef.current = setTimeout(advance, CLIP_DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [clipIndex, advance, reduceMotion]);

  const showVideo = mounted && !reduceMotion;

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden pb-28 md:pb-0">
      {/* Background: poster paints instantly and backstops every crossfade; videos layer on top. */}
      <motion.div className="absolute inset-0 z-0 scale-110" style={{ y: videoY }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={POSTER}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        {showVideo && (
          <AnimatePresence mode="sync">
            <motion.video
              key={clipIndex}
              src={isMobile ? CLIPS[clipIndex].mobile : CLIPS[clipIndex].desktop}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={advance}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        )}
      </motion.div>

      {/* Layered overlays */}
      <div className="absolute inset-0 z-10" style={{ background: "rgba(0,0,0,0.52)" }} />
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 80%, #000 100%)" }} />
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)" }} />

      {/* Content — centered composition, survey coordinates as the eyebrow */}
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
          <span className="text-[10px] tracking-[0.4em] uppercase tabular-nums" style={{ color: "var(--color-gold)" }}>
            34.0963° N&nbsp;&nbsp;84.0001° W &nbsp;·&nbsp; Buford, Georgia
          </span>
          <div className="h-px w-12" style={{ background: "var(--color-gold)" }} />
        </motion.div>

        <h1
          className="font-display font-bold text-white leading-[0.88] tracking-tight mb-8"
          style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
        >
          {["Building", "Georgia's", "Future"].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <motion.span
                className="block"
                initial={{ y: "120%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.2 + i * 0.14, ease: EASE }}
                style={i === 1 ? { color: "var(--color-gold)" } : undefined}
              >
                {i === 1 ? <em>{line}</em> : line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-base md:text-xl max-w-lg mx-auto mb-14 leading-relaxed font-light"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {stats.projectCount} developments across Georgia — residential, commercial,
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
            className="gold-sheen group inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.3em] uppercase font-medium transition-all duration-400 hover:gap-5"
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

      {/* Bottom stat bar — 2x2 grid on phones, single row on desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8, ease: EASE }}
        className="absolute bottom-0 left-0 right-0 z-20 grid grid-cols-2 md:grid-cols-4 gap-px"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.08)" }}
      >
        {STAT_BAR.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center py-3 md:py-4 text-center px-2"
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(10px)",
            }}
          >
            <CountUp value={s.value} className="font-display font-bold text-base md:text-lg" style={{ color: "var(--color-gold)" }} />
            <span className="text-[9px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
