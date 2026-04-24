// ── Flor de Loto palette ─────────────────────────────────────────────────────
// The lotus grows in water — no standard pot. LotusBase() replaces Pot().
const C = {
  soil: "#7a5c4a",
  water: "#1a6080",
  waterLight: "#2a90b0",
  pad: "#3a8a3a",
  padDark: "#2a6a2a",
  stemAquatic: "#4a9a50",
  sepal: "#5a8a3c",
  petalPale: "#f5d0e0",
  petalMid: "#e8a0b8",
  petalDeep: "#d06090",
  petalRich: "#b04070",
  center: "#f5e842",
  centerDark: "#c8b820",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

function LotusBase() {
  return (
    <>
      {/* water body */}
      {px(0, 10, 16, 4, C.water)}
      {/* water shimmer */}
      {px(1, 10, 14, 1, C.waterLight)}
      {px(3, 10, 1, 1, C.waterLight)}
      {px(10, 11, 2, 1, C.waterLight)}
      {/* lily pad */}
      {px(2, 9, 12, 2, C.pad)}
      {px(3, 9, 10, 1, C.padDark)}
      {px(2, 9, 1, 2, C.padDark)}
      {px(13, 9, 1, 2, C.padDark)}
      {/* pad notch (characteristic lotus leaf gap) */}
      {px(7, 9, 1, 2, C.padDark)}
      {/* ground line */}
      {px(0, 14, 16, 1, C.soil)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function LotusStage1() {
  return (
    <>
      <LotusBase />
      {px(7, 9, 2, 1, C.stemAquatic)}
    </>
  );
}

export function LotusStage2() {
  return (
    <>
      <LotusBase />
      {px(7, 7, 2, 2, C.stemAquatic)}
      {px(6, 8, 1, 1, C.sepal)}
      {px(9, 8, 1, 1, C.sepal)}
    </>
  );
}

export function LotusStage3() {
  return (
    <>
      <LotusBase />
      {px(7, 5, 2, 4, C.stemAquatic)}
      {px(6, 7, 2, 2, C.sepal)}
      {px(8, 7, 2, 2, C.sepal)}
    </>
  );
}

export function LotusStage4() {
  return (
    <>
      <LotusBase />
      {px(7, 4, 2, 5, C.stemAquatic)}
      {/* closed green bud */}
      {px(6, 3, 4, 3, C.sepal)}
      {px(7, 2, 2, 2, C.sepal)}
    </>
  );
}

export function LotusStage5() {
  return (
    <>
      <LotusBase />
      {px(7, 4, 2, 5, C.stemAquatic)}
      {/* sepal cup with pale petal tips */}
      {px(6, 4, 4, 2, C.sepal)}
      {px(7, 2, 2, 2, C.petalPale)}
      {px(6, 3, 4, 1, C.petalMid)}
    </>
  );
}

export function LotusStage6() {
  return (
    <>
      <LotusBase />
      {px(7, 5, 2, 4, C.stemAquatic)}
      {/* sepal base */}
      {px(6, 5, 4, 1, C.sepal)}
      {/* opening petals */}
      {px(5, 3, 6, 2, C.petalMid)}
      {px(4, 4, 2, 1, C.petalMid)}
      {px(10, 4, 2, 1, C.petalMid)}
      {px(6, 2, 4, 2, C.petalPale)}
      {px(7, 1, 2, 1, C.petalPale)}
      {px(7, 3, 2, 1, C.center)}
    </>
  );
}

export function LotusStage7() {
  return (
    <>
      <LotusBase />
      {px(7, 5, 2, 4, C.stemAquatic)}
      {px(6, 5, 4, 1, C.sepal)}
      {/* layered flower */}
      {px(3, 4, 10, 2, C.petalDeep)}
      {px(3, 4, 1, 1, C.petalDeep)}
      {px(12, 4, 1, 1, C.petalDeep)}
      {px(4, 3, 8, 2, C.petalMid)}
      {px(5, 2, 6, 2, C.petalPale)}
      {px(6, 1, 4, 2, C.petalPale)}
      {px(6, 3, 4, 2, C.center)}
      {px(7, 2, 2, 1, C.centerDark)}
    </>
  );
}

export function LotusStage8() {
  return (
    <>
      <LotusBase />
      {px(7, 5, 2, 4, C.stemAquatic)}
      {px(6, 5, 4, 1, C.sepal)}
      {/* fully open */}
      {px(2, 4, 12, 2, C.petalRich)}
      {px(3, 3, 10, 2, C.petalDeep)}
      {px(4, 2, 8, 2, C.petalMid)}
      {px(5, 1, 6, 2, C.petalPale)}
      {/* golden center cone */}
      {px(6, 2, 4, 2, C.center)}
      {px(7, 1, 2, 2, C.center)}
      {px(7, 2, 2, 1, C.centerDark)}
    </>
  );
}

export function LotusStage9() {
  return (
    <>
      <LotusBase />
      {px(7, 5, 2, 4, C.stemAquatic)}
      {px(6, 5, 4, 1, C.sepal)}
      {/* legendary — petals reach grid edges, row 0 */}
      {px(1, 5, 14, 1, C.petalRich)}
      {px(2, 4, 12, 2, C.petalRich)}
      {px(3, 3, 10, 2, C.petalDeep)}
      {px(4, 2, 8, 2, C.petalMid)}
      {px(5, 1, 6, 2, C.petalPale)}
      {px(6, 0, 4, 1, C.petalPale)}
      {/* golden center cone */}
      {px(6, 2, 4, 2, C.center)}
      {px(7, 1, 2, 2, C.center)}
      {px(7, 2, 2, 1, C.centerDark)}
      {px(7, 1, 1, 1, C.center)}
    </>
  );
}
