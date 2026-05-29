"use client";

import { useState, useEffect, useCallback } from "react";

interface Props {
  images: string[];
  name: string;
  isRepresentative?: boolean;
}

export default function ProjectGallery({ images, name, isRepresentative }: Props) {
  const [active, setActive] = useState(0);

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const single = images.length === 1;

  return (
    <div className="mb-12">
      {/* Main image */}
      <div
        className="relative w-full overflow-hidden border"
        style={{ aspectRatio: "16/9", borderColor: "var(--color-border)", background: "var(--color-surface)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={active}
          src={images[active]}
          alt={`${name} — photo ${active + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 40%)" }} />

        {/* Representative label */}
        {isRepresentative && (
          <span className="absolute bottom-4 left-4 text-[9px] tracking-[0.2em] uppercase"
            style={{ color: "var(--color-text-subtle)" }}>
            Representative imagery
          </span>
        )}

        {/* Counter */}
        {!single && (
          <span className="absolute bottom-4 right-4 text-[10px] tracking-[0.15em] tabular-nums"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            {active + 1} / {images.length}
          </span>
        )}

        {/* Prev / Next */}
        {!single && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 transition-all duration-200 hover:scale-110"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", border: "1px solid rgba(201,169,110,0.25)" }}
            >
              <span style={{ color: "var(--color-gold)", fontSize: 18, lineHeight: 1 }}>‹</span>
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 transition-all duration-200 hover:scale-110"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", border: "1px solid rgba(201,169,110,0.25)" }}
            >
              <span style={{ color: "var(--color-gold)", fontSize: 18, lineHeight: 1 }}>›</span>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {!single && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className="flex-none transition-all duration-200"
              style={{
                width: 72,
                height: 48,
                overflow: "hidden",
                border: `2px solid ${i === active ? "var(--color-gold)" : "rgba(255,255,255,0.08)"}`,
                opacity: i === active ? 1 : 0.55,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
