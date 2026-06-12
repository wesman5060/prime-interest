"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Standalone preview routes (e.g. /logo) don't use the site's smooth scroll.
    if (pathname?.startsWith("/logo")) return;
    // Respect OS-level reduced-motion: native scrolling, no smoothing layer.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [pathname]);

  // reducedMotion="user" makes every framer-motion animation site-wide
  // collapse to a simple opacity change when the OS asks for less motion.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
