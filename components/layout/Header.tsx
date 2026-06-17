"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Logo from "@/components/site/Logo";

const nav = [
  { label: "Approach", href: "/approach" },
  { label: "Projects", href: "/projects" },
  { label: "Acquisitions", href: "/acquisitions" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        // When the mobile menu is open, force a solid background so the menu reads as a sealed panel.
        background: open ? "rgba(0,0,0,0.98)" : scrolled ? "rgba(0,0,0,0.88)" : "transparent",
        backdropFilter: scrolled || open ? "blur(20px)" : "none",
        borderBottom: scrolled || open ? "1px solid rgba(201,169,110,0.12)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group transition-opacity duration-300 hover:opacity-90">
          <Logo variant="inline" size={36} />
        </Link>

        {/* Desktop nav — lg+: between 768-1024px the five items + CTA get crushed, so tablets use the menu */}
        <nav className="hidden lg:flex items-center gap-10">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 group"
                style={{ color: active ? "var(--color-gold)" : "rgba(255,255,255,0.6)" }}
              >
                {item.label}
                <span
                  className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                  style={{
                    background: "var(--color-gold)",
                    width: active ? "100%" : "0",
                  }}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right cluster: Call (always visible), Get in Touch (lg+), hamburger (sub-lg) */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Click-to-call — visible at every breakpoint. Icon-only on mobile, icon + number on desktop. */}
          <a
            href="tel:7709453241"
            aria-label="Call our office at 770-945-3241"
            className="group inline-flex items-center gap-2.5 transition-all duration-300 border px-3 lg:px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[color:var(--color-gold)] hover:text-black"
            style={{ borderColor: "var(--color-gold)", color: "var(--color-gold)" }}
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="hidden md:inline tabular-nums">770-945-3241</span>
          </a>

          {/* CTA — desktop only */}
          <Link
            href="/contact"
            className="gold-sheen hidden lg:inline-flex items-center gap-2 px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:gap-4"
            style={{ background: "var(--color-gold)", color: "#000" }}
          >
            Get in Touch <span>→</span>
          </Link>

          {/* Mobile + tablet hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className={`block h-px w-6 bg-white transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-px w-6 transition-all duration-300 ${open ? "opacity-0" : "bg-white"}`} />
            <span className={`block h-px w-6 bg-white transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

    </header>

    {/* Mobile menu — rendered as a sibling so it can fix to the viewport
        (the header has backdrop-filter, which would otherwise contain it). */}
    <div
      className="lg:hidden fixed left-0 right-0 z-40 overflow-hidden transition-opacity duration-300"
      style={{
        top: "73px",
        bottom: 0,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        background: "var(--color-bg)",
        borderTop: "1px solid rgba(201,169,110,0.15)",
      }}
    >
      <div className="px-8 pt-10 pb-12 flex flex-col gap-7">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-base tracking-[0.25em] uppercase transition-colors"
              style={{ color: active ? "var(--color-gold)" : "rgba(255,255,255,0.75)" }}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          className="inline-flex items-center gap-2 px-7 py-4 text-[11px] tracking-[0.25em] uppercase font-medium mt-4 w-fit"
          style={{ background: "var(--color-gold)", color: "#000" }}
        >
          Get in Touch →
        </Link>
      </div>
    </div>
    </>
  );
}
