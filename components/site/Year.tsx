"use client";

import { useEffect, useState } from "react";

/**
 * Renders the current year, hydrated on the client so it stays accurate
 * regardless of when the static site was built. Falls back to the build-time
 * year on first paint to avoid layout shift.
 */
const BUILD_YEAR = new Date().getFullYear();

export default function Year() {
  const [year, setYear] = useState(BUILD_YEAR);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return <>{year}</>;
}
