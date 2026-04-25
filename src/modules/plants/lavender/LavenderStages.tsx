// ── Lavender palette ──────────────────────────────────────────────────────────
const C = {
  soil: "#6b4e38",
  soilDark: "#4a3326",
  pot: "#c8956a",
  potMid: "#b07850",
  potDark: "#3d2b1f",
  potShine: "#e0b48a",
  stem: "#5a7a3c",
  stemDark: "#3d5828",
  stemLight: "#7a9a50",
  leaf: "#4a6830",
  leafLight: "#6a8a48",
  leafDark: "#2d4a1a",
  spikeBase: "#7a4a9a",
  spikeMid: "#9a68c0",
  spikeLight: "#c090e0",
  spikeHi: "#d8b0f0",
  spikeDark: "#5a2878",
  bud: "#a070b8",
  budDark: "#703890",
  calyx: "#4a6830",
  calyxLight: "#6a8a48",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

function Pot() {
  return (
    <>
      {px(1,  21, 12, 1, C.potShine)}
      {px(2,  21, 10, 1, C.pot)}
      {px(1,  21, 1,  1, C.potDark)}
      {px(12, 21, 1,  1, C.potDark)}
      {px(2,  22, 10, 3, C.pot)}
      {px(2,  22, 1,  3, C.potDark)}
      {px(11, 22, 1,  3, C.potDark)}
      {px(3,  22, 3,  3, C.potMid)}
      {px(2,  24, 10, 1, C.potDark)}
      {px(1,  25, 12, 1, C.soil)}
      {px(3,  25, 2,  1, C.soilDark)}
      {px(8,  25, 2,  1, C.soilDark)}
    </>
  );
}

function Stem(topRow: number) {
  const rects = [];
  for (let row = topRow; row <= 20; row++) {
    rects.push(px(6, row, 2, 1, row % 3 === 0 ? C.stemDark : C.stem));
  }
  return <>{rects}</>;
}

function SmallLeaf(x: number, y: number, dir: -1 | 1) {
  return (
    <>
      {px(x,                    y,   3, 1, dir === 1 ? C.leafLight : C.leafDark)}
      {px(x,                    y+1, 3, 1, C.leaf)}
      {px(dir === 1 ? x+2 : x,  y,   1, 2, C.leafDark)}
    </>
  );
}

// Espiga de lavanda — flores apiladas verticalmente
function Spike(x: number, topY: number, height: number) {
  const rects = [];
  for (let i = 0; i < height; i++) {
    const y = topY + i;
    const isTip = i === 0;
    const isBase = i === height - 1;
    const col = isTip ? C.spikeHi : isBase ? C.spikeDark : i % 2 === 0 ? C.spikeMid : C.spikeLight;
    rects.push(px(x, y, 2, 1, col));
    if (!isTip && !isBase) {
      rects.push(px(x - 1, y, 1, 1, C.bud));
      rects.push(px(x + 2, y, 1, 1, C.bud));
    }
    rects.push(px(x, y, 1, 1, C.spikeDark));
  }
  return <>{rects}</>;
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function LavenderStage1() {
  return (
    <>
      <Pot />
      {px(6, 20, 2, 1, C.stem)}
      {px(5, 19, 4, 1, C.stemLight)}
      {px(6, 19, 2, 1, C.stem)}
    </>
  );
}

export function LavenderStage2() {
  return (
    <>
      <Pot />
      {Stem(16)}
      {SmallLeaf(3, 18, 1)}
      {SmallLeaf(8, 17, -1)}
    </>
  );
}

export function LavenderStage3() {
  return (
    <>
      <Pot />
      {Stem(13)}
      {SmallLeaf(2, 17, 1)}
      {SmallLeaf(8, 15, -1)}
      {SmallLeaf(3, 14, 1)}
      {/* brotes de capullo */}
      {px(6, 10, 2, 3, C.calyx)}
      {px(6, 10, 2, 1, C.calyxLight)}
      {px(5, 11, 1, 2, C.bud)}
      {px(8, 11, 1, 2, C.bud)}
    </>
  );
}

export function LavenderStage4() {
  return (
    <>
      <Pot />
      {Stem(13)}
      {SmallLeaf(2, 17, 1)}
      {SmallLeaf(8, 15, -1)}
      {SmallLeaf(3, 14, 1)}
      {/* espiga central parcial */}
      {Spike(6, 5, 8)}
    </>
  );
}

export function LavenderStage5() {
  return (
    <>
      <Pot />
      {Stem(13)}
      {SmallLeaf(2, 17, 1)}
      {SmallLeaf(8, 15, -1)}
      {SmallLeaf(3, 14, 1)}
      {SmallLeaf(7, 13, 1)}
      {/* espiga central completa */}
      {Spike(6, 1, 12)}
      {/* espigas laterales más cortas */}
      {px(3,  6, 2, 1, C.bud)}
      {px(3,  7, 2, 1, C.spikeMid)}
      {px(2,  8, 2, 1, C.spikeLight)}
      {px(2,  9, 2, 1, C.spikeMid)}
      {px(2, 10, 2, 1, C.spikeDark)}
      {px(9,  6, 2, 1, C.bud)}
      {px(9,  7, 2, 1, C.spikeMid)}
      {px(10, 8, 2, 1, C.spikeLight)}
      {px(10, 9, 2, 1, C.spikeMid)}
      {px(10,10, 2, 1, C.spikeDark)}
    </>
  );
}