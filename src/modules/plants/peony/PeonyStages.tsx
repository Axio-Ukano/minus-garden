// ── Peony palette ─────────────────────────────────────────────────────────────
const C = {
  soil: "#6b4e38",
  soilDark: "#4a3326",
  pot: "#c8956a",
  potMid: "#b07850",
  potDark: "#3d2b1f",
  potShine: "#e0b48a",
  stem: "#5a7a3c",
  stemDark: "#3a5828",
  stemLight: "#7a9a50",
  leaf: "#3a6828",
  leafLight: "#5a8840",
  leafDark: "#204818",
  leafVein: "#4a7830",
  petalDeep: "#9a1848",
  petalMid: "#c83068",
  petalLight: "#e85888",
  petalPale: "#f890b0",
  petalCream: "#ffc8d8",
  petalEdge: "#ff80a8",
  petalInner: "#f04878",
  stamen: "#f8d840",
  stamenDark: "#d0a820",
  budGreen: "#5a8030",
  budDark: "#3a5820",
  sepals: "#4a7030",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

function Pot() {
  return (
    <>
      {px(3, 17, 16, 1, C.potShine)}
      {px(4, 17, 14, 1, C.pot)}
      {px(3, 17, 1, 1, C.potDark)}
      {px(18, 17, 1, 1, C.potDark)}
      {px(4, 18, 14, 3, C.pot)}
      {px(4, 18, 1, 3, C.potDark)}
      {px(17, 18, 1, 3, C.potDark)}
      {px(5, 18, 5, 3, C.potMid)}
      {px(4, 20, 14, 1, C.potDark)}
      {px(3, 21, 16, 1, C.soil)}
      {px(5, 21, 3, 1, C.soilDark)}
      {px(13, 21, 3, 1, C.soilDark)}
    </>
  );
}

function Stem(topRow: number) {
  const rects = [];
  for (let row = topRow; row <= 16; row++) {
    rects.push(px(10, row, 2, 1, row % 3 === 0 ? C.stemDark : C.stem));
  }
  return <>{rects}</>;
}

function CompoundLeaf(x: number, y: number, flip: boolean) {
  const dx = flip ? -1 : 1;
  return (
    <>
      {/* hoja central */}
      {px(x, y, 5, 3, C.leaf)}
      {px(x, y, 5, 1, C.leafLight)}
      {px(x + 2, y, 1, 3, C.leafVein)}
      {px(flip ? x + 4 : x, y, 1, 3, C.leafDark)}
      {/* hoja secundaria arriba */}
      {px(x + dx * 3, y - 2, 4, 2, C.leaf)}
      {px(x + dx * 3, y - 2, 4, 1, C.leafLight)}
      {px(flip ? x + dx * 3 + 3 : x + dx * 3, y - 2, 1, 2, C.leafDark)}
      {/* hoja secundaria abajo */}
      {px(x + dx * 3, y + 2, 4, 2, C.leaf)}
      {px(x + dx * 3, y + 2, 4, 1, C.leafLight)}
      {px(flip ? x + dx * 3 + 3 : x + dx * 3, y + 2, 1, 2, C.leafDark)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function PeonyStage1() {
  return (
    <>
      <Pot />
      {px(10, 16, 2, 1, C.stem)}
      {px(9, 15, 4, 1, C.stemLight)}
      {px(10, 15, 2, 1, C.stem)}
    </>
  );
}

export function PeonyStage2() {
  return (
    <>
      <Pot />
      {Stem(13)}
      {px(6, 14, 4, 2, C.leafLight)}
      {px(6, 14, 1, 2, C.leafDark)}
      {px(12, 13, 4, 2, C.leafLight)}
      {px(15, 13, 1, 2, C.leafDark)}
    </>
  );
}

export function PeonyStage3() {
  return (
    <>
      <Pot />
      {Stem(10)}
      {CompoundLeaf(2, 13, false)}
      {CompoundLeaf(15, 13, true)}
    </>
  );
}

export function PeonyStage4() {
  return (
    <>
      <Pot />
      {Stem(9)}
      {CompoundLeaf(2, 13, false)}
      {CompoundLeaf(15, 12, true)}
      {/* capullo globoso con sépalos */}
      {px(8, 5, 6, 4, C.budGreen)}
      {px(8, 5, 1, 4, C.budDark)}
      {px(13, 5, 1, 4, C.budDark)}
      {px(9, 4, 4, 1, C.budGreen)}
      {px(8, 8, 6, 1, C.budDark)}
      {/* toque de pétalo */}
      {px(9, 3, 4, 2, C.petalPale)}
      {px(10, 2, 2, 1, C.petalCream)}
    </>
  );
}

export function PeonyStage5() {
  return (
    <>
      <Pot />
      {Stem(9)}
      {CompoundLeaf(2, 13, false)}
      {CompoundLeaf(15, 12, true)}
      {/* sépalos */}
      {px(7, 8, 8, 2, C.sepals)}
      {px(7, 8, 1, 2, C.budDark)}
      {px(14, 8, 1, 2, C.budDark)}
      {/* flor semi-abierta */}
      {px(6, 3, 10, 5, C.petalMid)}
      {px(6, 3, 1, 5, C.petalDeep)}
      {px(15, 3, 1, 5, C.petalDeep)}
      {px(7, 2, 8, 1, C.petalLight)}
      {px(8, 1, 6, 1, C.petalPale)}
      {px(8, 4, 6, 3, C.petalLight)}
      {px(9, 5, 4, 2, C.petalCream)}
    </>
  );
}

export function PeonyStage6() {
  return (
    <>
      <Pot />
      {Stem(9)}
      {CompoundLeaf(1, 14, false)}
      {CompoundLeaf(16, 13, true)}
      {px(6, 9, 10, 2, C.sepals)}
      {px(6, 9, 1, 2, C.budDark)}
      {px(15, 9, 1, 2, C.budDark)}
      {/* pétalos exteriores */}
      {px(4, 4, 14, 5, C.petalMid)}
      {px(4, 4, 1, 5, C.petalDeep)}
      {px(17, 4, 1, 5, C.petalDeep)}
      {px(5, 3, 12, 1, C.petalLight)}
      {px(6, 2, 10, 1, C.petalPale)}
      {px(7, 1, 8, 1, C.petalCream)}
      {px(4, 8, 14, 1, C.petalDeep)}
      {/* pétalos medios */}
      {px(6, 4, 10, 4, C.petalLight)}
      {px(7, 3, 8, 1, C.petalPale)}
      {/* estambres */}
      {px(8, 6, 6, 2, C.stamen)}
      {px(9, 5, 4, 1, C.stamenDark)}
    </>
  );
}

export function PeonyStage7() {
  // Flor completamente abierta — máxima exuberancia
  return (
    <>
      <Pot />
      {Stem(9)}
      {CompoundLeaf(1, 14, false)}
      {CompoundLeaf(16, 13, true)}
      {px(5, 9, 12, 2, C.sepals)}
      {px(5, 9, 1, 2, C.budDark)}
      {px(16, 9, 1, 2, C.budDark)}
      {/* capa exterior — muy ancha */}
      {px(2, 5, 18, 4, C.petalMid)}
      {px(2, 5, 1, 4, C.petalDeep)}
      {px(19, 5, 1, 4, C.petalDeep)}
      {px(3, 4, 16, 1, C.petalLight)}
      {px(4, 3, 14, 1, C.petalPale)}
      {px(5, 2, 12, 1, C.petalCream)}
      {px(6, 1, 10, 1, C.petalEdge)}
      {px(2, 8, 18, 1, C.petalDeep)}
      {/* capa media */}
      {px(5, 4, 12, 5, C.petalLight)}
      {px(6, 3, 10, 2, C.petalPale)}
      {px(6, 4, 10, 1, C.petalEdge)}
      {/* capa interior */}
      {px(7, 4, 8, 4, C.petalCream)}
      {px(8, 3, 6, 1, C.petalCream)}
      {/* estambres prominentes */}
      {px(7, 6, 8, 3, C.stamen)}
      {px(8, 5, 6, 1, C.stamenDark)}
      {px(9, 7, 4, 1, C.stamenDark)}
      {/* pétalos internos extra */}
      {px(8, 6, 6, 1, C.petalInner)}
    </>
  );
}
