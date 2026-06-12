// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

const CIRCLE_RADIUS = 90;
const CIRCLE_STROKE = 12;

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TimerCircle({
  secondsLeft,
  totalSeconds,
  faded,
}: {
  secondsLeft: number;
  totalSeconds: number;
  faded?: boolean;
}) {
  const circumference = 2 * Math.PI * CIRCLE_RADIUS;
  const progress = totalSeconds === 0 ? 0 : secondsLeft / totalSeconds;
  const dashOffset = circumference * (1 - progress);
  const size = (CIRCLE_RADIUS + CIRCLE_STROKE + 8) * 2;
  const center = size / 2;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: faded ? 0.6 : 1,
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={center}
          cy={center}
          r={CIRCLE_RADIUS}
          fill="none"
          stroke="var(--color-heart)"
          strokeWidth={CIRCLE_STROKE}
          opacity="0.25"
        />
        <circle
          cx={center}
          cy={center}
          r={CIRCLE_RADIUS}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={CIRCLE_STROKE}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          fontFamily: "var(--font-pixel)",
          fontSize: Math.round(CIRCLE_RADIUS * 0.22),
          color: "var(--color-text)",
          lineHeight: 1,
        }}
      >
        {formatTime(secondsLeft)}
      </span>
    </div>
  );
}
