"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-40 flex h-11 w-11 items-center justify-center border transition-colors duration-200 hover:border-[--color-gold]"
          style={{
            background: "rgba(10,10,10,0.9)",
            backdropFilter: "blur(8px)",
            borderColor: "var(--color-border-custom)",
            color: "var(--color-gold)",
          }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
