"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin gold bar fixed to the very top of the viewport that scales with
 * scroll depth — like a survey transect line filling in as the visitor
 * works down the document.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left pointer-events-none"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, transparent 0%, var(--color-gold) 14%, var(--color-gold-light) 50%, var(--color-gold) 86%, transparent 100%)",
        boxShadow: "0 0 12px rgba(201,169,110,0.6)",
      }}
    />
  );
}
