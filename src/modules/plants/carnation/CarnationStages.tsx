// ── Carnation palette ─────────────────────────────────────────────────────────
const C = {
  soil: "#6b4e38",
  soilDark: "#4a3326",
  pot: "#c8956a",
  potMid: "#b07850",
  potDark: "#3d2b1f",
  potShine: "#e0b48a",
  stem: "#5a8040",
  stemDark: "#3a5828",
  stemLight: "#78a858",
  leaf: "#4a7030",
  leafLight: "#6a9848",
  leafDark: "#2a4818",
  leafBlue: "#688050",
  calyx: "#4a7030",
  calyxLight: "#6a9848",
  calyxDark: "#2a4818",
  petalRed: "#d02040",
  petalRedMid: "#e84060",
  petalRedLight: "#f07090",
  petalRedTip: "#ffa0b8",
  petalRedDark: "#901828",
  petalFringe: "#ff90a8",
  centerPink: "#f8b0c8",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

function Pot() {
  return (
    <>
      {px(2,  19, 14, 1, C.potShine)}
      {px(3,  19, 12, 1, C.pot)}
      {px(2,  19, 1,  1, C.potDark)}
      {px(15, 19, 1,  1, C.potDark)}
      {px(3,  20, 12, 3, C.pot)}
      {px(3,  20, 1,  3, C.potDark)}
      {px(14, 20, 1,  3, C.potDark)}
      {px(4,  20, 4,  3, C.potMid)}
      {px(3,  22, 12, 1, C.potDark)}
      {px(2,  23, 14, 1, C.soil)}
      {px(4,  23, 2,  1, C.soilDark)}
      {px(11, 23, 2,  1, C.soilDark)}
    </>
  );
}

function Stem(topRow: number) {
  const rects = [];
  for (let row = topRow; row <= 18; row++) {
    // tallo levemente curvado: 1px de offset a mitad del recorrido
    const x = row < 10 ? 8 : 9;
    rects.push(px(x, row, 2, 1, row % 4 === 0 ? C.stemDark : C.stem));
  }
  return <>{rects}</>;
}

function NarrowLeaf(x: number, y: number, len: number, dir: -1 | 1) {
  const rects = [];
  for (let i = 0; i < len; i++) {
    const col = i === 0 ? C.leafLight : i === len - 1 ? C.leafDark : C.leaf;
    rects.push(px(dir === 1 ? x + i : x - i, y + Math.floor(i / 2), 2, 1, col));
  }
  return <>{rects}</>;
}

function Calyx(x: number, y: number) {
  return (
    <>
      {px(x,   y,   4, 3, C.calyx)}
      {px(x,   y,   4, 1, C.calyxLight)}
      {px(x,   y,   1, 3, C.calyxDark)}
      {px(x+3, y,   1, 3, C.calyxDark)}
      {px(x,   y+2, 4, 1, C.calyxDark)}
    </>
  );
}

// Flor de clavel — pétalos festoneados apretados
function CarnaFlower(cx: number, cy: number, size: number) {
  const r = size;
  return (
    <>
      {/* base */}
      {px(cx-r,   cy,     r*2+2, r*2,   C.petalRed)}
      {/* fila media más clara */}
      {px(cx-r+1, cy+1,   r*2,   r*2-2, C.petalRedMid)}
      {/* centro */}
      {px(cx-1,   cy+1,   4,     r,     C.petalRedLight)}
      {/* flecos superiores */}
      {px(cx-r,   cy-1,   2,     1,     C.petalFringe)}
      {px(cx-r+3, cy-1,   2,     1,     C.petalFringe)}
      {px(cx+1,   cy-2,   2,     1,     C.petalFringe)}
      {px(cx+r-1, cy-1,   2,     1,     C.petalFringe)}
      {/* bordes oscuros */}
      {px(cx-r,   cy,     1,     r*2,   C.petalRedDark)}
      {px(cx+r+1, cy,     1,     r*2,   C.petalRedDark)}
      {px(cx-r,   cy+r*2-1, r*2+2, 1,  C.petalRedDark)}
      {/* pétalos individuales asomando */}
      {px(cx-r-1, cy+1,   1,     2,     C.petalRedLight)}
      {px(cx+r+2, cy+1,   1,     2,     C.petalRedLight)}
      {/* toque de brillo */}
      {px(cx,     cy+1,   2,     1,     C.centerPink)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function CarnationStage1() {
  return (
    <>
      <Pot />
      {px(9, 18, 2, 1, C.stem)}
      {px(8, 17, 4, 1, C.stemLight)}
      {px(9, 17, 2, 1, C.stem)}
    </>
  );
}

export function CarnationStage2() {
  return (
    <>
      <Pot />
      {Stem(15)}
      {NarrowLeaf(7, 17, 3, -1)}
      {NarrowLeaf(10,16, 3,  1)}
    </>
  );
}

export function CarnationStage3() {
  return (
    <>
      <Pot />
      {Stem(11)}
      {NarrowLeaf(6, 16, 4, -1)}
      {NarrowLeaf(11,14, 4,  1)}
      {NarrowLeaf(7, 13, 3, -1)}
      {/* capullo apenas cerrado */}
      {Calyx(8, 7)}
      {px(9,  5, 2, 2, C.petalRed)}
      {px(9,  4, 2, 1, C.petalRedLight)}
    </>
  );
}

export function CarnationStage4() {
  return (
    <>
      <Pot />
      {Stem(11)}
      {NarrowLeaf(6, 16, 4, -1)}
      {NarrowLeaf(11,14, 4,  1)}
      {NarrowLeaf(7, 13, 3, -1)}
      {Calyx(8, 6)}
      {/* flor semi-abierta */}
      {px(7,  1, 6, 5, C.petalRed)}
      {px(7,  1, 6, 1, C.petalFringe)}
      {px(8,  0, 4, 1, C.petalFringe)}
      {px(8,  2, 4, 2, C.petalRedLight)}
      {px(7,  1, 1, 4, C.petalRedDark)}
      {px(12, 1, 1, 4, C.petalRedDark)}
      {px(9,  3, 2, 1, C.centerPink)}
    </>
  );
}

export function CarnationStage5() {
  return (
    <>
      <Pot />
      {Stem(11)}
      {NarrowLeaf(6, 16, 4, -1)}
      {NarrowLeaf(11,14, 4,  1)}
      {NarrowLeaf(7, 13, 3, -1)}
      {Calyx(7, 7)}
      {CarnaFlower(8, 1, 3)}
    </>
  );
}

export function CarnationStage6() {
  // Flor completa exuberante con segundo nivel de pétalos
  return (
    <>
      <Pot />
      {Stem(11)}
      {NarrowLeaf(5, 17, 5, -1)}
      {NarrowLeaf(12,15, 5,  1)}
      {NarrowLeaf(7, 13, 3, -1)}
      {Calyx(7, 8)}
      {/* flor principal grande */}
      {CarnaFlower(8, 1, 4)}
      {/* capa exterior de pétalos */}
      {px(4,  3, 3, 2, C.petalRedLight)}
      {px(4,  3, 1, 2, C.petalRedDark)}
      {px(13, 3, 3, 2, C.petalRedLight)}
      {px(15, 3, 1, 2, C.petalRedDark)}
      {px(6,  0, 6, 1, C.petalFringe)}
      {px(5,  1, 1, 2, C.petalFringe)}
      {px(13, 1, 1, 2, C.petalFringe)}
    </>
  );
}