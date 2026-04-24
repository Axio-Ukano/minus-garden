// ── Clavel palette ───────────────────────────────────────────────────────────
const C = {
  soil: "#7a5c4a",
  pot: "#c8956a",
  potBorder: "#3d2b1f",
  stem: "#5a8a3c",
  leafGreen: "#3d6b28",
  calyx: "#5a8a3c",
  petalDeep: "#cc2244",
  petalMid: "#e85570",
  petalLight: "#f5a0b8",
  petalEdge: "#ffffff",
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
export function ClavelStage1() {
  return (
    <>
      <Pot />
      {px(7, 10, 2, 1, C.stem)}
    </>
  );
}

export function ClavelStage2() {
  return (
    <>
      <Pot />
      {px(7, 8, 2, 2, C.stem)}
      {px(6, 9, 1, 1, C.leafGreen)}
      {px(9, 9, 1, 1, C.leafGreen)}
    </>
  );
}

export function ClavelStage3() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.leafGreen)}
      {px(9, 7, 2, 2, C.leafGreen)}
    </>
  );
}

export function ClavelStage4() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.leafGreen)}
      {px(9, 7, 2, 2, C.leafGreen)}
      {/* closed calyx bud */}
      {px(6, 2, 4, 3, C.calyx)}
      {px(7, 1, 2, 2, C.calyx)}
    </>
  );
}

export function ClavelStage5() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.leafGreen)}
      {px(9, 7, 2, 2, C.leafGreen)}
      {/* calyx base */}
      {px(6, 4, 4, 2, C.calyx)}
      {/* half-open petals */}
      {px(5, 2, 6, 2, C.petalMid)}
      {px(6, 1, 4, 1, C.petalLight)}
      {px(5, 3, 1, 1, C.petalDeep)}
      {px(10, 3, 1, 1, C.petalDeep)}
    </>
  );
}

export function ClavelStage6() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.leafGreen)}
      {px(9, 7, 2, 2, C.leafGreen)}
      {/* calyx sepal line */}
      {px(6, 5, 4, 1, C.calyx)}
      {/* ruffled layered head */}
      {px(4, 3, 8, 3, C.petalDeep)}
      {px(5, 2, 6, 2, C.petalMid)}
      {px(5, 1, 6, 1, C.petalLight)}
      {/* scattered white ruffle tips */}
      {px(5, 1, 1, 1, C.petalEdge)}
      {px(7, 0, 2, 1, C.petalEdge)}
      {px(10, 1, 1, 1, C.petalEdge)}
      {px(6, 2, 1, 1, C.petalEdge)}
      {px(9, 2, 1, 1, C.petalEdge)}
    </>
  );
}
