import Link from "next/link";
import GlobeMark from "@/components/site/GlobeMark";
import Year from "@/components/site/Year";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t mt-auto" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
      {/* Survey contour motif */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/topo.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-64 -bottom-80 w-[820px] max-w-none opacity-[0.05]"
      />

      {/* Statement */}
      <div className="relative max-w-7xl mx-auto px-8 pt-20 pb-16">
        <Link href="/acquisitions" className="group block">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>
            Have land in Georgia?
          </p>
          <span
            className="font-display font-bold leading-[1.02] text-white block max-w-4xl transition-colors duration-300 group-hover:text-[color:var(--color-gold)]"
            style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)" }}
          >
            Let&rsquo;s put your land{" "}
            <span className="whitespace-nowrap">
              <em>to work</em>
              <span
                className="inline-block align-baseline ml-4 transition-transform duration-300 group-hover:translate-x-3"
                style={{ color: "var(--color-gold)" }}
              >
                →
              </span>
            </span>
          </span>
        </Link>
      </div>

      <div className="relative border-t" style={{ borderColor: "var(--color-border)" }} />

      <div className="relative max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <div className="relative flex items-center gap-3 mb-4 w-fit">
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-x-8 -inset-y-4"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(232,201,138,0.18) 0%, rgba(201,169,110,0.06) 50%, transparent 80%)",
                filter: "blur(3px)",
              }}
            />
            <GlobeMark size={64} strokeWidth={1.3} showContinents color="var(--color-gold-light)" />
            <div className="relative flex flex-col items-center leading-none">
              <span
                className="font-display font-bold"
                style={{
                  fontSize: 36,
                  color: "var(--color-gold-light)",
                  lineHeight: 1,
                  letterSpacing: "0.005em",
                  textShadow: "0 0 16px rgba(232,201,138,0.4)",
                }}
              >
                Prime Interest
              </span>
              <span
                className="text-[12px] tracking-[0.28em] uppercase mt-[9px]"
                style={{ color: "var(--color-gold)", opacity: 0.85 }}
              >
                Land<span style={{ margin: "0 0.45em", display: "inline-block", verticalAlign: "1px", fontSize: "0.85em" }}>&#9670;</span>Development
              </span>
            </div>
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--color-text-subtle)" }}>
            Building Georgia&rsquo;s Future Since 1990
          </p>
        </div>

        {/* Nav */}
        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>Navigation</p>
          <nav className="flex flex-col gap-3">
            {[
              { label: "Home", href: "/" },
              { label: "Approach", href: "/approach" },
              { label: "Projects", href: "/projects" },
              { label: "Acquisitions", href: "/acquisitions" },
              { label: "Markets", href: "/counties" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm transition-colors duration-200 hover:text-[color:var(--color-gold)]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>Contact</p>
          <address className="not-italic flex flex-col gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
            <span>4235 South Lee St</span>
            <span>Buford, GA 30518</span>
            <a href="tel:7709453241" className="hover:text-[color:var(--color-gold)] transition-colors mt-2">
              Office&nbsp;&nbsp;770-945-3241
            </a>
            <a href="tel:7705963251" className="hover:text-[color:var(--color-gold)] transition-colors">
              Cell&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;770-596-3251
            </a>
            <a href="mailto:martyorr@bellsouth.net" className="hover:text-[color:var(--color-gold)] transition-colors">
              martyorr@bellsouth.net
            </a>
          </address>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            © <Year /> Prime Interest Land Development. All Rights Reserved.
          </p>
          <div className="flex items-center gap-5 text-xs" style={{ color: "var(--color-text-muted)" }}>
            <Link href="/privacy" className="hover:text-[color:var(--color-gold)] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[color:var(--color-gold)] transition-colors">Terms</Link>
            <span className="tracking-[0.15em] tabular-nums">
              34.0963° N&nbsp;&nbsp;84.0001° W &nbsp;·&nbsp; Buford, Georgia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
