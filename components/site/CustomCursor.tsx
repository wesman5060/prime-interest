"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Editorial gold cursor that replaces the OS pointer on fine-pointer devices.
 *
 * - On idle, it's a 6px gold dot with a faint ring.
 * - Over interactive elements (a, button, [role=button], [data-cursor]) it
 *   morphs into a labeled chip. The label is `data-cursor-label="…"` on the
 *   target, or derived from common patterns (links → "VIEW", buttons → "TAP").
 * - Hidden entirely on coarse pointers (touch) and when prefers-reduced-motion.
 *
 * Mount once near the top of the marketing layout.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    // Only enable on devices with a fine pointer (real mouse / trackpad).
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  useEffect(() => {
    if (!enabled) return;
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [role='button'], [data-cursor]",
      );
      if (!target) {
        setHovering(false);
        setLabel(null);
        return;
      }
      const explicit = target.getAttribute("data-cursor-label");
      let next: string;
      if (explicit) {
        next = explicit;
      } else if (target.tagName === "A") {
        const href = target.getAttribute("href") ?? "";
        if (href.startsWith("tel:")) next = "CALL";
        else if (href.startsWith("mailto:")) next = "EMAIL";
        else next = "VIEW";
      } else {
        next = "TAP";
      }
      setLabel(next);
      setHovering(true);
    };
    const onOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !related.closest("a, button, [role='button'], [data-cursor]")) {
        setHovering(false);
        setLabel(null);
      }
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Dot — always at cursor position, scales out when label takes over. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{ x: springX, y: springY }}
      >
        <motion.div
          animate={{
            scale: hovering ? 0 : 1,
            opacity: hovering ? 0 : 1,
          }}
          transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            width: 10,
            height: 10,
            borderRadius: 9999,
            background: "var(--color-gold)",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 12px rgba(201,169,110,0.6)",
          }}
        />
      </motion.div>

      {/* Label chip — appears at cursor on hover. */}
      <motion.div
        aria-hidden
        ref={labelRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ x: springX, y: springY }}
      >
        <motion.div
          animate={{
            scale: hovering ? 1 : 0.6,
            opacity: hovering ? 1 : 0,
          }}
          transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            transform: "translate(-50%, -50%)",
            background: "var(--color-gold)",
            color: "#0a0a0a",
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 600,
            padding: "8px 14px",
            whiteSpace: "nowrap",
            boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
          }}
        >
          {label ?? ""}
        </motion.div>
      </motion.div>
    </>
  );
}
