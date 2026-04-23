export function HeartIcon({
  size = 16,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 11 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        imageRendering: "pixelated",
        shapeRendering: "crispEdges",
      }}
    >
      <rect x="1" y="0" width="3" height="1" fill={color} />
      <rect x="7" y="0" width="3" height="1" fill={color} />

      <rect x="0" y="1" width="5" height="1" fill={color} />
      <rect x="6" y="1" width="5" height="1" fill={color} />

      <rect x="0" y="2" width="11" height="1" fill={color} />
      <rect x="0" y="3" width="11" height="1" fill={color} />
      <rect x="0" y="4" width="11" height="1" fill={color} />

      <rect x="1" y="5" width="9" height="1" fill={color} />
      <rect x="2" y="6" width="7" height="1" fill={color} />
      <rect x="3" y="7" width="5" height="1" fill={color} />
      <rect x="4" y="8" width="3" height="1" fill={color} />
      <rect x="5" y="9" width="1" height="1" fill={color} />
    </svg>
  );
}
