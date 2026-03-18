export function PaperPlane({ className = "", size = 40, color = "#fff" }: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      <path
        d="M58 6L6 26l20 8 6 20 10-16 16-32z"
        fill={color}
        fillOpacity="0.95"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M26 34l8-8"
        stroke={color === "#fff" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.15)"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
