// ── Gerbera palette ──────────────────────────────────────────────────────────
const C = {
  soil: "#7a5c4a",
  pot: "#c8956a",
  potBorder: "#3d2b1f",
  stem: "#5a8a3c",
  leafGreen: "#3d6b28",
  budGreen: "#7ab648",
  petalRed: "#e83a3a",
  petalOrange: "#f5733a",
  center: "#f5c842",
  centerDark: "#c8a020",
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
export function GerberaStage1() {
  return (
    <>
      <Pot />
      {px(7, 10, 2, 1, C.stem)}
    </>
  );
}

export function GerberaStage2() {
  return (
    <>
      <Pot />
      {px(7, 8, 2, 2, C.stem)}
      {px(6, 9, 1, 1, C.leafGreen)}
      {px(9, 9, 1, 1, C.leafGreen)}
    </>
  );
}

export function GerberaStage3() {
  return (
    <>
      <Pot />
      {px(7, 6, 2, 4, C.stem)}
      {px(5, 8, 2, 1, C.leafGreen)}
      {px(9, 8, 2, 1, C.leafGreen)}
    </>
  );
}

export function GerberaStage4() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.leafGreen)}
      {px(9, 7, 2, 2, C.leafGreen)}
      {px(6, 3, 4, 2, C.budGreen)}
      {px(6, 3, 4, 1, C.leafGreen)}
      {px(6, 3, 1, 2, C.leafGreen)}
      {px(9, 3, 1, 2, C.leafGreen)}
      {px(6, 4, 4, 1, C.leafGreen)}
    </>
  );
}

export function GerberaStage5() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.leafGreen)}
      {px(9, 7, 2, 2, C.leafGreen)}
      {/* outer petals */}
      {px(5, 0, 6, 1, C.petalRed)}
      {px(5, 5, 6, 1, C.petalRed)}
      {px(3, 2, 2, 2, C.petalOrange)}
      {px(11, 2, 2, 2, C.petalOrange)}
      {px(4, 1, 1, 1, C.petalRed)}
      {px(11, 1, 1, 1, C.petalRed)}
      {px(4, 4, 1, 1, C.petalRed)}
      {px(11, 4, 1, 1, C.petalRed)}
      {/* inner petals */}
      {px(5, 1, 6, 1, C.petalOrange)}
      {px(5, 4, 6, 1, C.petalOrange)}
      {px(4, 2, 1, 2, C.petalOrange)}
      {px(11, 2, 1, 2, C.petalOrange)}
      {/* center */}
      {px(5, 2, 6, 2, C.center)}
      {px(6, 2, 2, 1, C.centerDark)}
    </>
  );
}
