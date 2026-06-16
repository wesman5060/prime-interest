"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FAQItem } from "@/content/landowner-faq";

interface Props {
  items: FAQItem[];
}

export default function FAQ({ items }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t" style={{ borderColor: "var(--color-border-custom)" }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="border-b"
            style={{ borderColor: "var(--color-border-custom)" }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-6 py-7 text-left group"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
            >
              <span className="flex items-baseline gap-5">
                <span
                  className="font-display text-[11px] tracking-[0.3em] tabular-nums shrink-0 pt-1"
                  style={{ color: "var(--color-gold)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg md:text-xl text-white leading-snug pr-4 transition-colors group-hover:text-[color:var(--color-gold)]">
                  {item.q}
                </span>
              </span>
              <span
                aria-hidden
                className="relative h-6 w-6 shrink-0 mt-2"
                style={{ color: "var(--color-gold)" }}
              >
                <span
                  className="absolute left-0 top-1/2 h-px w-6"
                  style={{ background: "currentColor" }}
                />
                <motion.span
                  initial={false}
                  animate={{ rotate: isOpen ? 0 : 90 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                  className="absolute left-0 top-1/2 h-px w-6 origin-center"
                  style={{ background: "currentColor" }}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p
                    className="pb-8 pl-[3.25rem] pr-12 text-base md:text-lg leading-relaxed max-w-3xl"
                    style={{ color: "var(--color-text-muted)", lineHeight: 1.85 }}
                  >
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
