"use client";

import { motion } from "framer-motion";

interface Props {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Extra layers (gradients, badges) rendered above the image, below the curtain. */
  children?: React.ReactNode;
}

/**
 * Premium image reveal: a curtain in the page background slides up while the
 * image settles from a slight over-zoom. Runs once when scrolled into view;
 * collapses to a plain image under prefers-reduced-motion (via MotionConfig).
 */
export default function RevealImage({ src, alt, className, imgClassName, children }: Props) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.16 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className={imgClassName ?? "w-full h-full object-cover"}
      />
      {children}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "var(--color-bg)" }}
        initial={{ y: "0%" }}
        whileInView={{ y: "-101%" }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
}
