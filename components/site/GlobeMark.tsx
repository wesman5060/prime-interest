interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
  /**
   * Render a subtle Americas silhouette underneath the wireframe — the
   * signature element of Marty's original 1990s mark. Off by default
   * because at small sizes (≤32px) the continents read as visual noise.
   */
  showContinents?: boolean;
}

/**
 * Wireframe globe — modernized rendering of the Prime Interest globe mark.
 * Crisp surveyor geometry, no drop shadows, no gradients. At ≥48px with
 * `showContinents`, a soft Americas silhouette sits beneath the wireframe
 * so the mark reads as the original even at brand scale.
 */
export default function GlobeMark({
  size = 40,
  color = "var(--color-gold)",
  strokeWidth = 1,
  showContinents = false,
}: Props) {
  const thin = strokeWidth * 0.65;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Americas silhouette — hand-tuned to fit inside the wireframe sphere.
          Sits underneath every line so the wireframe etches across it. */}
      {showContinents && (
        <g opacity="0.45">
          {/* North America */}
          <path
            d="M14.6 6.3 C 13.0 7.0, 11.7 8.4, 11.6 9.8 C 11.5 11.1, 12.2 11.6, 12.3 12.7 C 12.4 13.8, 11.7 14.2, 12.3 15.5 C 12.7 16.4, 13.7 17.0, 14.6 17.4 C 15.6 17.8, 16.8 17.7, 17.6 18.5 C 18.3 19.2, 18.5 20.3, 19.4 20.6 C 20.0 20.8, 20.5 20.5, 20.8 19.9 C 21.4 18.7, 20.5 17.7, 20.4 16.4 C 20.3 15.0, 21.7 14.5, 22.0 13.2 C 22.3 12.1, 21.7 11.4, 21.4 10.5 C 21.0 9.0, 20.3 7.9, 19.0 7.1 C 17.6 6.2, 16.0 5.8, 14.6 6.3 Z"
            fill={color}
          />
          {/* Central America bridge */}
          <path
            d="M18.5 20.2 C 18.1 20.9, 18.4 21.7, 18.9 22.2 C 19.4 22.7, 19.9 22.6, 20.2 22.1 C 20.4 21.7, 20.1 21.0, 19.7 20.6 C 19.4 20.3, 18.9 19.9, 18.5 20.2 Z"
            fill={color}
          />
          {/* South America */}
          <path
            d="M20.1 22.2 C 19.0 22.7, 18.4 24.0, 18.6 25.4 C 18.8 26.8, 19.6 27.6, 19.9 28.9 C 20.2 30.2, 19.7 31.2, 19.9 32.3 C 20.1 33.5, 20.8 34.3, 21.6 34.4 C 22.4 34.5, 22.9 33.9, 23.1 33.0 C 23.3 32.1, 22.9 31.3, 23.0 30.3 C 23.1 29.0, 23.9 28.2, 24.0 26.9 C 24.1 25.6, 23.5 24.7, 22.9 23.7 C 22.3 22.7, 21.4 21.7, 20.1 22.2 Z"
            fill={color}
          />
        </g>
      )}

      {/* Outer circle */}
      <circle cx="20" cy="20" r="18.5" stroke={color} strokeWidth={strokeWidth} />

      {/* Equator */}
      <line x1="1.5" y1="20" x2="38.5" y2="20" stroke={color} strokeWidth={thin} />

      {/* Latitude lines — ±30° and ±60° */}
      <ellipse cx="20" cy="10.75" rx="16.02" ry="2.6" stroke={color} strokeWidth={thin} />
      <ellipse cx="20" cy="29.25" rx="16.02" ry="2.6" stroke={color} strokeWidth={thin} />
      <ellipse cx="20" cy="3.75"  rx="9.25"  ry="1.5" stroke={color} strokeWidth={thin} />
      <ellipse cx="20" cy="36.25" rx="9.25"  ry="1.5" stroke={color} strokeWidth={thin} />

      {/* Central meridian */}
      <line x1="20" y1="1.5" x2="20" y2="38.5" stroke={color} strokeWidth={thin} />

      {/* Longitude curves — ±45° from center */}
      <path d="M20,1.5 A13.1,18.5 0 0 1 20,38.5" stroke={color} strokeWidth={thin} />
      <path d="M20,1.5 A13.1,18.5 0 0 0 20,38.5" stroke={color} strokeWidth={thin} />

      {/* Longitude curves — ±75° from center (near-edge, subtle) */}
      <path d="M20,1.5 A17.9,18.5 0 0 1 20,38.5" stroke={color} strokeWidth={thin} />
      <path d="M20,1.5 A17.9,18.5 0 0 0 20,38.5" stroke={color} strokeWidth={thin} />
    </svg>
  );
}
