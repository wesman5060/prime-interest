"use client";

import { useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** How far the element drifts toward the cursor at max (px). */
  strength?: number;
  /** Activation radius beyond the element's bounds (px). */
  radius?: number;
}

/**
 * Wraps a single element and gently pulls it toward the cursor when the cursor
 * is within `radius` of its center. The inner content drifts ~60% of the
 * container distance so the magnetic effect feels layered, not rigid.
 *
 * Use on hero CTAs and the header buttons — not on every link, or the whole
 * page becomes squirmy.
 */
export default function MagneticButton({
  children,
  className,
  style,
  strength = 12,
  radius = 90,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ix = useMotionValue(0);
  const iy = useMotionValue(0);
  const spring = { stiffness: 350, damping: 28, mass: 0.3 };
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);
  const innerX = useSpring(ix, spring);
  const innerY = useSpring(iy, spring);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > radius) {
      x.set(0);
      y.set(0);
      ix.set(0);
      iy.set(0);
      setActive(false);
      return;
    }
    const pull = (1 - dist / radius) * strength;
    const nx = (dx / (dist || 1)) * pull;
    const ny = (dy / (dist || 1)) * pull;
    x.set(nx);
    y.set(ny);
    ix.set(nx * 0.6);
    iy.set(ny * 0.6);
    setActive(true);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
    ix.set(0);
    iy.set(0);
    setActive(false);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ ...style, x: springX, y: springY, display: "inline-block" }}
      data-magnetic={active ? "on" : "off"}
    >
      <motion.div style={{ x: innerX, y: innerY }}>{children}</motion.div>
    </motion.div>
  );
}
