"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getPortfolioStats } from "@/lib/content/stats";

const stats = getPortfolioStats();

export default function CTABand() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Subtle gold glow in background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.04) 0%, transparent 70%)",
        }}
      />
      {/* Survey contour motif */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/topo.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-56 -bottom-72 w-[760px] max-w-none opacity-[0.05]"
      />

      <div className="relative max-w-4xl mx-auto px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs tracking-[0.4em] uppercase mb-6"
          style={{ color: "var(--color-gold)" }}
        >
          Let's Work Together
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-white mb-8 leading-tight"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        >
          Have a development<br />opportunity?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg mb-12 max-w-xl mx-auto"
          style={{ color: "var(--color-text-muted)" }}
        >
          Prime Interest has been turning raw land into thriving communities
          for over {stats.yearsActive} years. Let's talk about your next project.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/contact"
            className="gold-sheen inline-flex items-center gap-3 px-12 py-5 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 hover:brightness-110 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(201,169,110,0.3)]"
            style={{ background: "var(--color-gold)", color: "#000" }}
          >
            Start a Conversation
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
