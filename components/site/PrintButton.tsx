"use client";

/**
 * Trigger window.print() from a normal click handler. Lives in its own
 * client component so the surrounding capabilities page can stay a server
 * component.
 */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="gold-sheen inline-flex items-center gap-3 px-8 py-3 text-[11px] tracking-[0.25em] uppercase font-medium transition-all duration-300 hover:gap-4"
      style={{ background: "var(--color-gold)", color: "#000" }}
    >
      Save as PDF <span aria-hidden>&darr;</span>
    </button>
  );
}
