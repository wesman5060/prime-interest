"use client";

import { motion } from "framer-motion";

const partners = [
  "American Campus Communities",
  "D.R. Horton",
  "Beazer Homes",
  "Meritage Homes",
  "Century Communities",
  "McKinley Homes",
  "Wood Partners",
  "Northside Hospital",
  "Walden Communities",
  "Solomon Development Group",
  "Brookfield Properties",
  "Trinity Senior Living",
];

// Duplicate so the marquee scrolls seamlessly.
const track = [...partners, ...partners];

export default function PartnersSection() {
  return (
    <section
      className="py-24 border-t overflow-hidden"
      style={{ borderColor: "rgba(255,255,255,0.06)", background: "var(--color-surface)" }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center text-xs tracking-[0.4em] uppercase mb-12"
        style={{ color: "var(--color-gold)" }}
      >
        Trusted Partners &amp; Collaborators
      </motion.p>

      {/* Marquee track */}
      <div className="relative flex" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" }}>
        <div className="flex shrink-0 animate-marquee gap-16 pr-16">
          {track.map((partner, i) => (
            <span
              key={`${partner}-${i}`}
              className="text-sm tracking-wider whitespace-nowrap"
              style={{ color: "var(--color-text-subtle)" }}
            >
              {partner}
              <span className="ml-16 inline-block w-1 h-1 rounded-full align-middle" style={{ background: "var(--color-gold-dim)" }} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
