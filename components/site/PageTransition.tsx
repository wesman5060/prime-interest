"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Topo-curtain page transition.
 *
 * On every pathname change, two stacked panels sweep across the viewport — a
 * solid black curtain with the topographic SVG motif at 12% opacity etched on
 * top. The curtain enters from the bottom, holds briefly, then exits upward,
 * revealing the new page. The whole pass is ~900 ms so the visitor never
 * waits long, but every nav click feels like a deliberate moment.
 *
 * Skipped on the first load (no curtain on initial render) and when
 * prefers-reduced-motion is set.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const [showCurtain, setShowCurtain] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (reduced) return;
    setShowCurtain(true);
    // Make sure each navigation lands the visitor at the top of the page,
    // since the curtain hides the scroll snap.
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setShowCurtain(false), 650);
    return () => clearTimeout(t);
  }, [pathname, reduced]);

  return (
    <>
      {children}
      <AnimatePresence>
        {showCurtain && (
          <motion.div
            key="page-transition"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[9998] pointer-events-none"
            aria-hidden
            style={{ background: "#0a0a0a" }}
          >
            {/* Topo motif etched across the curtain. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/topo.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-[0.12]"
            />
            {/* Coordinate readout — the curtain has a moment to itself. */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <span
                  className="text-[10px] tracking-[0.4em] uppercase tabular-nums"
                  style={{ color: "var(--color-gold)" }}
                >
                  34.0963° N · 84.0001° W
                </span>
                <span
                  className="font-display text-xs tracking-[0.5em] uppercase"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Prime Interest
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
