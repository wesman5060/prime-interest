/* Logo: hybrid approach — AI-rendered globe (accurate Americas) + SVG type (crisp vector).
   Matches business card design: arch → globe → two-line caps tagline. */

const SERIF = "var(--font-playfair), 'Playfair Display', Georgia, serif";

export default function LogoPreviewPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48, padding: "40px 24px" }}>
      <Swatch label="Dark — website">
        <LogoSVG globe="/logo-ai/mark-lineart.png" bg="#000" text="#C9A96E" />
      </Swatch>
      <Swatch label="Dark — bold sphere variant">
        <LogoSVG globe="/logo-ai/mark-solid.png" bg="#000" text="#C9A96E" />
      </Swatch>
      <Swatch label="Light — business card">
        <LogoCardLight />
      </Swatch>
      <Swatch label="Reference — actual card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/original-logo.gif" alt="Original" style={{ width: "100%", display: "block", opacity: 0.75 }} />
      </Swatch>
    </div>
  );
}

function Swatch({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 500 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#555" }}>{label}</p>
      <div style={{ width: "100%", border: "1px solid #222", overflow: "hidden" }}>{children}</div>
    </div>
  );
}

function LogoSVG({ globe, bg, text }: { globe: string; bg: string; text: string }) {
  const archId = `arch-${globe.replace(/\W/g, '')}`;
  return (
    <svg
      width="500" height="460"
      viewBox="0 0 500 460"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ maxWidth: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <path id={archId} d="M 30,248 A 380,380 0 0 1 470,248" />
      </defs>
      <rect width="500" height="460" fill={bg} />

      {/* Arched wordmark */}
      <text fontFamily={SERIF} fontSize="60" fontStyle="italic" fontWeight="500" fill={text} letterSpacing="0">
        <textPath href={`#${archId}`} startOffset="50%" textAnchor="middle">Prime Interest</textPath>
      </text>

      {/* AI globe mark — centered, sized to match card proportions */}
      <image href={globe} x="155" y="155" width="190" height="190" preserveAspectRatio="xMidYMid meet" />

      {/* Tagline */}
      <text x="250" y="378" textAnchor="middle" fontFamily={SERIF} fontSize="22" fontWeight="700" letterSpacing="6" fill={text}>
        ACQUISITIONS
      </text>
      <text x="250" y="416" textAnchor="middle" fontFamily={SERIF} fontSize="22" fontWeight="700" letterSpacing="6" fill={text}>
        LAND DEVELOPMENT
      </text>
    </svg>
  );
}

// Light version uses the lineart globe with color-invert filter
function LogoCardLight() {
  return (
    <svg
      width="500" height="460"
      viewBox="0 0 500 460"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ maxWidth: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <path id="arch-light" d="M 30,248 A 380,380 0 0 1 470,248" />
        <filter id="to-dark">
          <feColorMatrix type="matrix"
            values="-1 0 0 0 0.8
                     0 -1 0 0 0.5
                     0 0 -1 0 0.1
                     0  0 0 1 0" />
        </filter>
      </defs>
      <rect width="500" height="460" fill="#C9A96E" />

      <text fontFamily={SERIF} fontSize="60" fontStyle="italic" fontWeight="500" fill="#1a1208" letterSpacing="0">
        <textPath href="#arch-light" startOffset="50%" textAnchor="middle">Prime Interest</textPath>
      </text>

      {/* Globe with filter to invert to dark ink */}
      <image href="/logo-ai/mark-lineart.png" x="155" y="155" width="190" height="190"
        preserveAspectRatio="xMidYMid meet" filter="url(#to-dark)" />

      <text x="250" y="378" textAnchor="middle" fontFamily={SERIF} fontSize="22" fontWeight="700" letterSpacing="6" fill="#1a1208">
        ACQUISITIONS
      </text>
      <text x="250" y="416" textAnchor="middle" fontFamily={SERIF} fontSize="22" fontWeight="700" letterSpacing="6" fill="#1a1208">
        LAND DEVELOPMENT
      </text>
    </svg>
  );
}
