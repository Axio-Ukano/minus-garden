export function SpeakerIcon({
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
      viewBox="0 0 16 16"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none", flexShrink: 0 }}
    >
      <rect x="2" y="6" width="3" height="4" />
      <rect x="5" y="5" width="2" height="6" />
      <rect x="7" y="4" width="2" height="8" />
      <rect x="9" y="3" width="2" height="10" />
      <rect x="12" y="6" width="2" height="4" />
      <rect x="14" y="5" width="2" height="6" />
    </svg>
  );
}

export function SpeakerMutedIcon({
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
      viewBox="0 0 16 16"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none", flexShrink: 0 }}
    >
      <rect x="2" y="6" width="3" height="4" />
      <rect x="5" y="5" width="2" height="6" />
      <rect x="7" y="4" width="2" height="8" />
      <rect x="9" y="3" width="2" height="10" />
      <rect x="12" y="6" width="2" height="2" />
      <rect x="14" y="8" width="2" height="2" />
      <rect x="12" y="10" width="2" height="2" />
    </svg>
  );
}

export function CloudIcon({
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
      viewBox="0 0 16 16"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none", flexShrink: 0 }}
    >
      <rect x="5" y="4" width="6" height="2" />
      <rect x="3" y="6" width="10" height="2" />
      <rect x="2" y="8" width="12" height="4" />
      <rect x="4" y="13" width="2" height="2" />
      <rect x="7" y="13" width="2" height="2" />
      <rect x="10" y="13" width="2" height="2" />
    </svg>
  );
}

export function MusicNoteIcon({
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
      viewBox="0 0 16 16"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none", flexShrink: 0 }}
    >
      <rect x="5" y="2" width="8" height="2" />
      <rect x="5" y="4" width="2" height="8" />
      <rect x="11" y="4" width="2" height="6" />
      <rect x="3" y="10" width="4" height="4" />
      <rect x="9" y="8" width="4" height="4" />
    </svg>
  );
}

export function BellIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none", flexShrink: 0 }}
    >
      {/* Stem */}
      <rect x="7" y="1" width="2" height="2" />
      {/* Shoulders — narrow transition into body */}
      <rect x="5" y="3" width="6" height="1" />
      {/* Body — straight sides, same width throughout */}
      <rect x="4" y="4" width="8" height="5" />
      {/* Rim — slightly wider than body */}
      <rect x="2" y="9" width="12" height="2" />
      {/* Clapper */}
      <rect x="7" y="11" width="2" height="2" />
    </svg>
  );
}

export function ChevronIcon({
  size = 16,
  color = "currentColor",
  direction = "down",
}: {
  size?: number;
  color?: string;
  direction?: "up" | "down";
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        pointerEvents: "none",
        flexShrink: 0,
        transform: direction === "up" ? "rotate(180deg)" : undefined,
      }}
    >
      <rect x="2" y="5" width="2" height="2" />
      <rect x="4" y="7" width="2" height="2" />
      <rect x="6" y="9" width="4" height="2" />
      <rect x="10" y="7" width="2" height="2" />
      <rect x="12" y="5" width="2" height="2" />
    </svg>
  );
}

export function GearIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none", flexShrink: 0 }}
    >
      <rect x="6" y="0" width="4" height="2" fill={color} />
      <rect x="6" y="14" width="4" height="2" fill={color} />
      <rect x="0" y="6" width="2" height="4" fill={color} />
      <rect x="14" y="6" width="2" height="4" fill={color} />
      <rect x="2" y="2" width="2" height="2" fill={color} />
      <rect x="12" y="2" width="2" height="2" fill={color} />
      <rect x="2" y="12" width="2" height="2" fill={color} />
      <rect x="12" y="12" width="2" height="2" fill={color} />
      <rect x="5" y="5" width="6" height="6" fill={color} />
      <rect x="6" y="4" width="4" height="8" fill={color} />
      <rect x="4" y="6" width="8" height="4" fill={color} />
      <rect x="6" y="6" width="4" height="4" fill="transparent" />
      <rect x="7" y="5" width="2" height="6" fill="transparent" />
      <rect x="5" y="7" width="6" height="2" fill="transparent" />
    </svg>
  );
}

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
