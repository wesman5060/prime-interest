import Link from "next/link";
import GlobeMark from "@/components/site/GlobeMark";

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <GlobeMark size={44} strokeWidth={1} />
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-[0.15em] text-white uppercase">Prime Interest</span>
              <span className="text-[9px] tracking-[0.25em] uppercase mt-1" style={{ color: "var(--color-gold)" }}>Land Development</span>
            </div>
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--color-text-subtle)" }}>
            Building Georgia's Future Since 1990
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
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm transition-colors duration-200 hover:text-[--color-gold]"
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
            <a href="tel:7709453241" className="hover:text-[--color-gold] transition-colors mt-2">
              770-945-3241
            </a>
            <a href="mailto:martyorr@bellsouth.net" className="hover:text-[--color-gold] transition-colors">
              martyorr@bellsouth.net
            </a>
          </address>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
            © {new Date().getFullYear()} Prime Interest Land Development. All Rights Reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
            Buford, Georgia
          </p>
        </div>
      </div>
    </footer>
  );
}
