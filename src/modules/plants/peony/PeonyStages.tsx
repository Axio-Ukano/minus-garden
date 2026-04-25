// ── Peony palette ─────────────────────────────────────────────────────────────
const C = {
  soil: "#7a5c4a",
  pot: "#c8956a",
  potBorder: "#3d2b1f",
  stem: "#5a8a3c",
  leafGreen: "#3d6b28",
  leafMid: "#558832",
  calyx: "#3d6b28",
  petalDeep: "#c0195a",
  petalMid: "#e84080",
  petalLight: "#f5a0c0",
  petalPale: "#ffd8e8",
  center: "#f5e842",
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
export function PeonyStage1() {
  return (
    <>
      <Pot />
      {px(7, 10, 2, 1, C.stem)}
    </>
  );
}

export function PeonyStage2() {
  return (
    <>
      <Pot />
      {px(7, 8, 2, 2, C.stem)}
      {px(5, 9, 2, 1, C.leafGreen)}
      {px(9, 9, 2, 1, C.leafGreen)}
    </>
  );
}

export function PeonyStage3() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.leafMid)}
      {px(9, 7, 2, 2, C.leafMid)}
    </>
  );
}

export function PeonyStage4() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.leafMid)}
      {px(9, 7, 2, 2, C.leafMid)}
      {/* closed calyx bud */}
      {px(6, 2, 4, 3, C.calyx)}
      {px(7, 1, 2, 2, C.petalDeep)}
    </>
  );
}

export function PeonyStage5() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.leafMid)}
      {px(9, 7, 2, 2, C.leafMid)}
      {/* calyx base */}
      {px(6, 4, 4, 1, C.calyx)}
      {/* beginning to open */}
      {px(5, 2, 6, 2, C.petalDeep)}
      {px(6, 1, 4, 2, C.petalMid)}
      {px(7, 0, 2, 2, C.petalLight)}
      {px(7, 2, 2, 2, C.center)}
    </>
  );
}

export function PeonyStage6() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.leafMid)}
      {px(9, 7, 2, 2, C.leafMid)}
      {/* wide layered head */}
      {px(4, 3, 8, 2, C.petalDeep)}
      {px(5, 2, 6, 2, C.petalMid)}
      {px(6, 1, 4, 2, C.petalLight)}
      {px(7, 0, 2, 1, C.petalPale)}
      {px(7, 2, 2, 2, C.center)}
    </>
  );
}

export function PeonyStage7() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.leafMid)}
      {px(9, 7, 2, 2, C.leafMid)}
      {/* full lush head — widest ring 10px */}
      {px(3, 4, 10, 2, C.petalDeep)}
      {px(3, 3, 1, 1, C.petalDeep)}
      {px(12, 3, 1, 1, C.petalDeep)}
      {px(4, 3, 8, 2, C.petalMid)}
      {px(5, 2, 6, 2, C.petalLight)}
      {px(6, 1, 4, 2, C.petalPale)}
      {px(7, 1, 2, 2, C.center)}
    </>
  );
}
