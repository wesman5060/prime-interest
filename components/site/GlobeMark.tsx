interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Modern wireframe globe — clean geometric version of the Prime Interest
 * globe mark. Same DNA as the original (latitude + longitude grid lines)
 * with no drop shadows, gradients, or 3D effects.
 */
export default function GlobeMark({ size = 40, color = "var(--color-gold)", strokeWidth = 1 }: Props) {
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
