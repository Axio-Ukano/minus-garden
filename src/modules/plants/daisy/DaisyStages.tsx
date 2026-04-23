// ── Daisy palette ───────────────────────────────────────────────────────────
const C = {
  soil: "#7a5c4a",
  pot: "#c8956a",
  potBorder: "#3d2b1f",
  stem: "#5a8a3c",
  leafDark: "#3d6b28",
  budLight: "#7ab648",
  petalWhite: "#fff8f0",
  petalPink: "#e8a0b4",
  center: "#f5c842",
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

function Stem(topRow: number) {
  const rects = [];
  for (let row = topRow; row <= 9; row++) {
    rects.push(px(7, row, 2, 1, C.stem));
  }
  return <>{rects}</>;
}

function Leaves() {
  return (
    <>
      {px(5, 7, 2, 2, C.stem)}
      {px(9, 7, 2, 2, C.stem)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function DaisyStage1() {
  return (
    <>
      <Pot />
      {px(7, 10, 2, 1, C.stem)}
    </>
  );
}

export function DaisyStage2() {
  return (
    <>
      <Pot />
      {px(7, 7, 2, 3, C.stem)}
      {px(5, 8, 2, 1, C.stem)}
      {px(9, 8, 2, 1, C.stem)}
    </>
  );
}

export function DaisyStage3() {
  return (
    <>
      <Pot />
      {Stem(5)}
      <Leaves />
    </>
  );
}

export function DaisyStage4() {
  return (
    <>
      <Pot />
      {Stem(5)}
      <Leaves />
      {px(6, 3, 4, 2, C.budLight)}
      {px(6, 3, 4, 1, C.leafDark)}
      {px(6, 3, 1, 2, C.leafDark)}
      {px(9, 3, 1, 2, C.leafDark)}
      {px(6, 4, 4, 1, C.leafDark)}
    </>
  );
}

export function DaisyStage5() {
  return (
    <>
      <Pot />
      {Stem(5)}
      <Leaves />
      {px(6, 1, 4, 1, C.petalWhite)}
      {px(6, 5, 4, 1, C.petalWhite)}
      {px(4, 3, 2, 1, C.petalWhite)}
      {px(10, 3, 2, 1, C.petalWhite)}
      {px(5, 2, 1, 1, C.petalWhite)}
      {px(10, 2, 1, 1, C.petalWhite)}
      {px(5, 4, 1, 1, C.petalWhite)}
      {px(10, 4, 1, 1, C.petalWhite)}
      {px(7, 1, 2, 1, C.petalPink)}
      {px(10, 3, 1, 1, C.petalPink)}
      {px(6, 2, 4, 2, C.center)}
    </>
  );
}
