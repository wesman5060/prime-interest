"use client";

import dynamic from "next/dynamic";

const OfficeMap = dynamic(() => import("./OfficeMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse" style={{ background: "var(--color-surface)" }} />
  ),
});

export default function OfficeMapClient() {
  return <OfficeMap />;
}
