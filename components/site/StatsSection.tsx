"use client";

import { motion } from "framer-motion";
import CountUp from "@/components/site/CountUp";
import type { Stat } from "@/lib/content/types";

function AnimatedStat({ stat, index }: { stat: Stat; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="text-center relative"
    >
      {index > 0 && (
        <div
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px"
          style={{ background: "rgba(201,169,110,0.2)" }}
        />
      )}
      <CountUp
        value={stat.value}
        className="font-display font-bold mb-2 leading-none block"
        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--color-gold)" }}
      />
      <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--color-text-muted)" }}>
        {stat.label}
      </p>
    </motion.div>
  );
}

export default function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <section
      className="py-24 border-y"
      style={{ borderColor: "rgba(255,255,255,0.06)", background: "var(--color-surface)" }}
    >
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, i) => (
          <AnimatedStat key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
}
