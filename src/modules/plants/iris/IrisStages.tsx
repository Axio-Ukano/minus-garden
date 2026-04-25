// ── Iris palette ──────────────────────────────────────────────────────────────
const C = {
  soil: "#7a5c4a",
  pot: "#c8956a",
  potBorder: "#3d2b1f",
  stem: "#5a8a3c",
  leafLily: "#4a9a3c",
  tepalDark: "#7b3fa0",
  tepalMid: "#a855c8",
  tepalLight: "#d4a0e8",
  stripe: "#e8c8f5",
  stamen: "#f5c842",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

function Pot() {
  return (
    <>
      {px(4, 11, 8, 3, C.pot)}
      {px(3, 10, 10, 1, C.pot)}
      {px(3, 10, 10, 1, C.potBorder)}
      {px(4, 11, 1, 3, C.potBorder)}
      {px(11, 11, 1, 3, C.potBorder)}
      {px(4, 13, 8, 1, C.potBorder)}
      {px(2, 14, 12, 1, C.soil)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function IrisStage1() {
  return (
    <>
      <Pot />
      {px(7, 10, 2, 1, C.stem)}
    </>
  );
}

export function IrisStage2() {
  return (
    <>
      <Pot />
      {px(7, 8, 2, 2, C.stem)}
      {/* sword-like cotyledon leaves */}
      {px(6, 8, 1, 2, C.leafLily)}
      {px(9, 8, 1, 2, C.leafLily)}
    </>
  );
}

export function IrisStage3() {
  return (
    <>
      <Pot />
      {px(7, 6, 2, 4, C.stem)}
      {/* taller sword leaves */}
      {px(5, 6, 2, 3, C.leafLily)}
      {px(9, 6, 2, 3, C.leafLily)}
    </>
  );
}

export function IrisStage4() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 5, 2, 4, C.leafLily)}
      {px(9, 5, 2, 4, C.leafLily)}
      {/* closed upright bud */}
      {px(7, 2, 2, 3, C.tepalDark)}
      {px(6, 3, 4, 2, C.tepalDark)}
    </>
  );
}

export function IrisStage5() {
  return (
    <>
      <Pot />
      {px(7, 6, 2, 4, C.stem)}
      {px(5, 5, 2, 4, C.leafLily)}
      {px(9, 5, 2, 4, C.leafLily)}
      {/* semi-open */}
      {px(6, 0, 4, 2, C.tepalMid)}
      {px(7, 1, 2, 2, C.tepalLight)}
      {px(5, 3, 2, 2, C.tepalDark)}
      {px(9, 3, 2, 2, C.tepalDark)}
      {px(7, 2, 2, 2, C.stamen)}
    </>
  );
}

export function IrisStage6() {
  return (
    <>
      <Pot />
      {px(7, 6, 2, 4, C.stem)}
      {px(5, 5, 2, 4, C.leafLily)}
      {px(9, 5, 2, 4, C.leafLily)}
      {/* upward tepals */}
      {px(7, 0, 2, 3, C.tepalLight)}
      {px(5, 1, 2, 2, C.tepalMid)}
      {px(9, 1, 2, 2, C.tepalMid)}
      {/* stripe accents */}
      {px(7, 0, 1, 3, C.stripe)}
      {px(5, 1, 1, 2, C.stripe)}
      {px(10, 1, 1, 2, C.stripe)}
      {/* downward/lateral tepals */}
      {px(4, 3, 3, 2, C.tepalDark)}
      {px(9, 3, 3, 2, C.tepalDark)}
      {px(6, 4, 4, 1, C.tepalMid)}
      {/* golden stamen throat */}
      {px(7, 2, 2, 2, C.stamen)}
    </>
  );
}
