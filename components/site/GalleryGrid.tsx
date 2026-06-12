"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface GalleryPhoto {
  src: string;
  alt: string;
  project: string;
  slug: string;
}

interface Props {
  photos: GalleryPhoto[];
}

export default function GalleryGrid({ photos }: Props) {
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  return (
    <>
      {/* Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
        {photos.map((photo, i) => (
          <motion.button
            key={`${photo.slug}-${i}`}
            type="button"
            className="relative block w-full mb-3 overflow-hidden group text-left break-inside-avoid"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: (i % 9) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setLightbox(photo)}
            aria-label={`Open ${photo.project} photo`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div
              className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }}
            >
              <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--color-gold)" }}>
                {photo.project}
              </p>
              <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                View ↗
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
            style={{ background: "rgba(0,0,0,0.93)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="w-full max-h-[80vh] object-contain"
              />
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--color-gold)" }}>
                    {lightbox.project}
                  </p>
                </div>
                <button
                  onClick={() => setLightbox(null)}
                  className="text-xs tracking-[0.2em] uppercase transition-colors hover:text-[color:var(--color-gold)]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Close ×
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
