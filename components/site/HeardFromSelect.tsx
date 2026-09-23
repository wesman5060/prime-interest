"use client";

import type { CSSProperties } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { HEARD_FROM_OPTIONS } from "@/lib/heard-from";

/**
 * The optional "How did you hear about us?" dropdown, styled to match the
 * underline text inputs on both forms: native browser chrome removed (it
 * indented the text and rendered in a heavier system font), grey prompt text
 * until an answer is picked — like every other empty field's placeholder —
 * and the site's gold chevron instead of the browser's arrow.
 */
export default function HeardFromSelect({
  registration,
  value,
  placeholder,
  className,
  style,
}: {
  registration: UseFormRegisterReturn;
  value: string | undefined;
  placeholder: string;
  className: string;
  style: CSSProperties;
}) {
  const chosen = Boolean(value);
  return (
    <div className="relative">
      <select
        {...registration}
        defaultValue=""
        className={`${className} appearance-none cursor-pointer pr-8`}
        style={{
          ...style,
          colorScheme: "dark",
          color: chosen ? "#FFFFFF" : "var(--color-text-subtle)",
        }}
      >
        <option value="" style={{ color: "#FFFFFF", background: "#111111" }}>
          {placeholder}
        </option>
        {HEARD_FROM_OPTIONS.map((o) => (
          <option key={o} value={o} style={{ color: "#FFFFFF", background: "#111111" }}>
            {o}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 12 8"
        width="12"
        height="8"
        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 1.5l5 5 5-5" />
      </svg>
    </div>
  );
}
