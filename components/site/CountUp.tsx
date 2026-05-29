"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

function parse(raw: string) {
  const m = raw.match(/^([^0-9]*)([0-9,]+)([^0-9]*)$/);
  if (!m) return { prefix: "", num: 0, suffix: "" };
  return { prefix: m[1], num: parseInt(m[2].replace(/,/g, ""), 10), suffix: m[3] };
}

interface Props {
  value: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function CountUp({ value, className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const { prefix, num, suffix } = parse(value);

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    // For 4-digit years, count from 80 below to keep it snappy
    const from = num > 999 ? num - 80 : 0;
    const ctrl = animate(from, num, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { el.textContent = prefix + Math.round(v) + suffix; },
    });
    return () => ctrl.stop();
  }, [inView, num, suffix, prefix]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{num}{suffix}
    </span>
  );
}
