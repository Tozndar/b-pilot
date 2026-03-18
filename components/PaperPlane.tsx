export function PaperPlane({
  className = "",
  size = 40,
  color = "#fff",
  variant = "default",
}: {
  className?: string;
  size?: number;
  color?: string;
  variant?: "default" | "detailed";
}) {
  // Derive a slightly darker shade for fold shadows
  const dark = color === "#fff" ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.22)";
  const mid = color === "#fff" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)";
  const highlight = color === "#fff" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 75"
      fill="none"
      className={className}
    >
      {/* === ORIGAMI PAPER PLANE === */}
      {/* Panel 1 — upper body (main, bright) */}
      <path
        d="M6 52 L90 10 L58 42 Z"
        fill={color}
        fillOpacity="0.95"
      />

      {/* Panel 2 — lower wing (slightly darker fold) */}
      <path
        d="M6 52 L58 42 L50 68 Z"
        fill={color}
        fillOpacity="0.70"
      />

      {/* Panel 3 — right rear panel */}
      <path
        d="M58 42 L90 10 L78 58 Z"
        fill={color}
        fillOpacity="0.55"
      />

      {/* Panel 4 — tail flap (small fold at back) */}
      <path
        d="M50 68 L58 42 L78 58 L62 65 Z"
        fill={color}
        fillOpacity="0.40"
      />

      {/* Fold crease — main center line */}
      <line
        x1="6" y1="52"
        x2="90" y2="10"
        stroke={highlight}
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />

      {/* Fold crease — wing fold */}
      <line
        x1="6" y1="52"
        x2="58" y2="42"
        stroke={dark}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />

      {/* Fold crease — tail line */}
      <line
        x1="58" y1="42"
        x2="78" y2="58"
        stroke={dark}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />

      {/* Nose tip highlight */}
      <path
        d="M6 52 L16 44 L12 54 Z"
        fill={highlight}
        fillOpacity="0.4"
      />

      {/* Paper texture dots — subtle */}
      <circle cx="28" cy="36" r="0.8" fill={highlight} fillOpacity="0.4" />
      <circle cx="40" cy="30" r="0.8" fill={highlight} fillOpacity="0.3" />
      <circle cx="32" cy="50" r="0.8" fill={dark} fillOpacity="0.3" />
    </svg>
  );
}
