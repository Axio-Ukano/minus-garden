// ── Sunflower palette ────────────────────────────────────────────────────────
const C = {
  soil: "#7a5c4a",
  pot: "#c8956a",
  potBorder: "#3d2b1f",
  stem: "#5a8a3c",
  stemDark: "#3d6b28",
  bud: "#8bc34a",
  petalOuter: "#f5c842",
  petalInner: "#e8a020",
  center: "#6b3a1f",
  centerHi: "#8b5a2f",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

// ── Shared parts ─────────────────────────────────────────────────────────────
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
export function SunflowerStage1() {
  return (
    <>
      <Pot />
      {px(7, 10, 2, 1, C.stem)}
    </>
  );
}

export function SunflowerStage2() {
  return (
    <>
      <Pot />
      {px(7, 8, 2, 2, C.stem)}
      {px(6, 9, 1, 1, C.stem)}
      {px(9, 9, 1, 1, C.stem)}
    </>
  );
}

export function SunflowerStage3() {
  return (
    <>
      <Pot />
      {px(7, 6, 2, 4, C.stem)}
      {px(5, 8, 2, 1, C.stem)}
      {px(9, 8, 2, 1, C.stem)}
    </>
  );
}

export function SunflowerStage4() {
  return (
    <>
      <Pot />
      {px(7, 4, 2, 6, C.stem)}
      {px(5, 7, 2, 2, C.stem)}
      {px(9, 7, 2, 2, C.stem)}
      {px(4, 6, 3, 1, C.stemDark)}
      {px(9, 6, 3, 1, C.stemDark)}
    </>
  );
}

export function SunflowerStage5() {
  return (
    <>
      <Pot />
      {px(7, 4, 2, 6, C.stem)}
      {px(5, 7, 2, 2, C.stem)}
      {px(9, 7, 2, 2, C.stem)}
      {px(6, 2, 4, 2, C.bud)}
      {px(6, 2, 4, 1, C.stemDark)}
      {px(6, 2, 1, 2, C.stemDark)}
      {px(9, 2, 1, 2, C.stemDark)}
    </>
  );
}

export function SunflowerStage6() {
  return (
    <>
      <Pot />
      {px(7, 4, 2, 6, C.stem)}
      {px(5, 7, 2, 2, C.stem)}
      {px(9, 7, 2, 2, C.stem)}
      {px(5, 2, 6, 1, C.petalOuter)}
      {px(5, 3, 1, 1, C.petalOuter)}
      {px(10, 3, 1, 1, C.petalOuter)}
      {px(6, 2, 4, 2, C.center)}
      {px(7, 2, 2, 1, C.centerHi)}
    </>
  );
}

export function SunflowerStage7() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.stem)}
      {px(9, 7, 2, 2, C.stem)}
      {px(4, 6, 3, 1, C.stemDark)}
      {px(9, 6, 3, 1, C.stemDark)}
      {/* outer petals */}
      {px(5, 0, 6, 1, C.petalOuter)}
      {px(5, 5, 6, 1, C.petalOuter)}
      {px(3, 2, 2, 2, C.petalOuter)}
      {px(11, 2, 2, 1, C.petalOuter)}
      {px(11, 3, 2, 1, C.petalOuter)}
      {px(4, 1, 1, 1, C.petalOuter)}
      {px(11, 1, 1, 1, C.petalOuter)}
      {px(4, 4, 1, 1, C.petalOuter)}
      {px(11, 4, 1, 1, C.petalOuter)}
      {/* inner petals */}
      {px(5, 1, 6, 1, C.petalInner)}
      {px(5, 4, 6, 1, C.petalInner)}
      {px(4, 2, 1, 2, C.petalInner)}
      {px(11, 2, 1, 2, C.petalInner)}
      {/* center */}
      {px(5, 2, 6, 2, C.center)}
      {px(6, 2, 2, 1, C.centerHi)}
    </>
  );
}
