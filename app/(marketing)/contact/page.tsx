import ContactForm from "@/components/site/ContactForm";
import AnimatedSection from "@/components/site/AnimatedSection";
import RevealImage from "@/components/site/RevealImage";
import OfficeMapClient from "@/components/site/OfficeMapClient";
import type { Metadata } from "next";

const OFFICE_ADDRESS = "4235 South Lee St, Buford, GA 30518";
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  OFFICE_ADDRESS,
)}`;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Prime Interest Land Development — land acquisitions, partnerships, and general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-40 pb-24">
      <div className="mx-auto max-w-6xl px-8">
        <AnimatedSection>
          <p className="mb-6 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--color-gold)" }}>
            Get in Touch
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <h1 className="font-display font-bold leading-none text-white mb-16" style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}>
            Contact Us
          </h1>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          {/* Contact details */}
          <div className="md:col-span-4">
            <AnimatedSection direction="left">
              <div className="space-y-12">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>Office</p>
                  <address className="not-italic space-y-3 text-base" style={{ color: "var(--color-text-muted)" }}>
                    <p className="font-medium text-white text-lg">Prime Interest</p>
                    <p className="text-sm">Land Development</p>
                    <p className="text-sm pt-2">
                      4235 South Lee St<br />
                      Buford, GA 30518
                    </p>
                  </address>
                  <a
                    href={DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex items-center gap-2 border px-5 py-3 text-xs uppercase tracking-[0.25em] transition-colors duration-200"
                    style={{ borderColor: "var(--color-border-gold)", color: "var(--color-gold)" }}
                  >
                    Get Directions
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </a>
                </div>

                <div>
                  <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>Direct</p>
                  <div className="space-y-3">
                    <a
                      href="tel:7709453241"
                      className="block text-sm transition-colors duration-200 hover:text-[--color-gold]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      770-945-3241
                    </a>
                    <a
                      href="tel:7709450472"
                      className="block text-sm transition-colors duration-200 hover:text-[--color-gold]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Fax: 770-945-0472
                    </a>
                    <a
                      href="mailto:martyorr@bellsouth.net"
                      className="block text-sm transition-colors duration-200 hover:text-[--color-gold]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      martyorr@bellsouth.net
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: "var(--color-border-custom)" }}>
                  <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "var(--color-text-subtle)" }}>
                    Acquisitions
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    Prime Interest actively acquires raw and improved land across metro Atlanta and North Georgia. All sizes considered.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Form */}
          <div className="md:col-span-8">
            <AnimatedSection delay={0.15} direction="right">
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>

        {/* Office location map */}
        <AnimatedSection delay={0.1}>
          <div className="mt-24">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "var(--color-gold)" }}>
                  Visit the Office
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  4235 South Lee St, Buford, GA 30518
                </p>
              </div>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group hidden items-center gap-2 text-xs uppercase tracking-[0.25em] transition-colors duration-200 sm:inline-flex"
                style={{ color: "var(--color-gold)" }}
              >
                Open in Maps
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>
            {/* Office photo from the original prime-interest.com, AI-upscaled 4x + enhanced. Swap if a new shot becomes available. */}
            <RevealImage
              src="/images/office.jpg"
              alt="Prime Interest Land Development office — 4235 South Lee St, Buford, GA"
              className="mb-6 w-full border border-[var(--color-border-custom)]"
              imgClassName="w-full h-auto object-cover"
            />
            <div
              className="h-[420px] w-full overflow-hidden border"
              style={{ borderColor: "var(--color-border-custom)" }}
            >
              <OfficeMapClient />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
