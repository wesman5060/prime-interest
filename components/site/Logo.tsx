import GlobeMark from "@/components/site/GlobeMark";

interface Props {
  /**
   * `inline` — globe at left, wordmark stacked at right. For the header.
   * `stacked` — wordmark above, globe centered below, tagline tracked under it.
   *             For the footer and prominent presentations.
   * `mark` — globe only.
   */
  variant?: "inline" | "stacked" | "mark";
  /** Overall scale. For `inline`, controls the globe size; the wordmark scales with it. */
  size?: number;
  /** Override the gold by passing any CSS color. */
  color?: string;
  className?: string;
}

/**
 * Modernized Prime Interest mark.
 *
 * Honors the DNA of Marty's original logo — italic golden "Prime Interest"
 * wordmark, wireframe globe showing the Americas, tracked "LAND · DEVELOPMENT"
 * tagline — but redrawn as crisp vector with Playfair Display italic for the
 * wordmark and the refined GlobeMark for the icon.
 */
export default function Logo({
  variant = "stacked",
  size = 96,
  color = "var(--color-gold)",
  className,
}: Props) {
  if (variant === "mark") {
    return <GlobeMark size={size} color={color} strokeWidth={1.1} showContinents={size >= 48} />;
  }

  if (variant === "inline") {
    // Header lockup. `size` is the globe height; wordmark sits to the right.
    return (
      <span
        className={`inline-flex items-center gap-3 ${className ?? ""}`}
        aria-label="Prime Interest Land Development"
      >
        <GlobeMark size={size} color={color} strokeWidth={1.1} showContinents={size >= 40} />
        <span className="flex flex-col leading-none">
          <span
            className="font-display font-bold italic"
            style={{
              fontSize: size * 0.5,
              color,
              letterSpacing: "0.005em",
              lineHeight: 1,
            }}
          >
            Prime Interest
          </span>
          <span
            className="font-sans tracking-[0.32em] uppercase mt-[0.35em]"
            style={{
              fontSize: size * 0.18,
              color,
              opacity: 0.7,
              fontWeight: 500,
            }}
          >
            Land&nbsp;·&nbsp;Development
          </span>
        </span>
      </span>
    );
  }

  // Stacked badge lockup.
  const wordSize = size * 0.42;
  const tagSize = size * 0.135;
  return (
    <span
      className={`inline-flex flex-col items-center ${className ?? ""}`}
      aria-label="Prime Interest Land Development"
      style={{ gap: size * 0.08 }}
    >
      <span
        className="font-display font-bold italic leading-none"
        style={{
          fontSize: wordSize,
          color,
          letterSpacing: "0.005em",
        }}
      >
        Prime Interest
      </span>
      <GlobeMark size={size * 0.62} color={color} strokeWidth={1.05} showContinents />
      <span
        className="font-sans uppercase"
        style={{
          fontSize: tagSize,
          color,
          letterSpacing: "0.42em",
          fontWeight: 500,
        }}
      >
        Land&nbsp;·&nbsp;Development
      </span>
    </span>
  );
}
