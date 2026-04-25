// ── Flor de Loto palette ──────────────────────────────────────────────────────
// The lotus grows in water — no standard pot. LotusBase() replaces Pot().
const C = {
  waterDeep: "#1a3a6a",
  waterMid: "#2a5090",
  waterShallow: "#3a68b0",
  waterLight: "#5a88d0",
  waterShine: "#80aae8",
  waterFoam: "#c0d8f8",
  mud: "#4a3828",
  mudDark: "#2e2218",
  mudLight: "#6a5038",
  stem: "#4a7a38",
  stemDark: "#2d5228",
  stemLight: "#68a050",
  stemUnder: "#3a6028",
  padDark: "#2a6020",
  padMid: "#3a7a2a",
  padLight: "#58a040",
  padShine: "#78c058",
  padEdge: "#205018",
  padVein: "#4a9030",
  petalWhite: "#fff8f5",
  petalPale: "#ffe0d8",
  petalPink: "#f8a0b0",
  petalPinkMid: "#f06888",
  petalPinkDark: "#d04060",
  petalRose: "#e83060",
  receptacle: "#f8d840",
  receptacleDark: "#c8a820",
  stamen: "#f8f0a0",
  stamens: "#e8c820",
  bud: "#f8c0c8",
  budDark: "#e080a0",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

// Base acuática — estanque con barro
function LotusBase() {
  return (
    <>
      {/* agua */}
      {px(0, 13, 24, 3, C.waterMid)}
      {px(0, 13, 24, 1, C.waterShallow)}
      {px(0, 14, 24, 1, C.waterDeep)}
      {px(0, 15, 24, 1, C.waterDeep)}
      {/* brillos de agua */}
      {px(2,  13, 3, 1, C.waterShine)}
      {px(8,  13, 2, 1, C.waterFoam)}
      {px(15, 13, 3, 1, C.waterShine)}
      {px(20, 13, 2, 1, C.waterFoam)}
      {px(5,  14, 2, 1, C.waterLight)}
      {px(17, 14, 2, 1, C.waterLight)}
      {/* barro */}
      {px(0, 16, 24, 2, C.mud)}
      {px(0, 16, 24, 1, C.mudLight)}
      {px(0, 17, 24, 1, C.mudDark)}
    </>
  );
}

// Hoja de loto — lilypad redondo y grande
function LilyPad(cx: number, y: number, r: number) {
  return (
    <>
      {px(cx-r,   y,   r*2,   2, C.padMid)}
      {px(cx-r+1, y-1, r*2-2, 1, C.padLight)}
      {px(cx-r+1, y+1, r*2-2, 1, C.padDark)}
      {px(cx-r,   y,   1,     2, C.padEdge)}
      {px(cx+r-1, y,   1,     2, C.padEdge)}
      {/* nervios */}
      {px(cx,     y,   1,     2, C.padVein)}
      {px(cx-r+2, y,   1,     1, C.padVein)}
      {px(cx+r-3, y,   1,     1, C.padVein)}
      {/* brillo */}
      {px(cx-r+2, y-1, 3,     1, C.padShine)}
    </>
  );
}

// Tallo emergente desde el barro
function LotusStalk(x: number, topY: number, baseY: number) {
  const rects = [];
  for (let y = topY; y <= baseY; y++) {
    const col = y < baseY - 1 ? C.stem : C.stemUnder;
    rects.push(px(x, y, 2, 1, col));
    if (y % 3 === 0) rects.push(px(x, y, 1, 1, C.stemDark));
  }
  return <>{rects}</>;
}

// Flor de loto completa
function LotusFlower(cx: number, cy: number, open: boolean) {
  if (!open) {
    return (
      <>
        {px(cx-1, cy-4, 4, 5, C.bud)}
        {px(cx,   cy-5, 2, 1, C.bud)}
        {px(cx-1, cy-4, 1, 5, C.budDark)}
        {px(cx+2, cy-4, 1, 5, C.budDark)}
        {px(cx,   cy-3, 2, 2, C.petalPale)}
      </>
    );
  }
  return (
    <>
      {/* pétalos exteriores */}
      {px(cx-4, cy,   3, 4, C.petalPink)}
      {px(cx-4, cy,   1, 4, C.petalPinkDark)}
      {px(cx+3, cy,   3, 4, C.petalPink)}
      {px(cx+5, cy,   1, 4, C.petalPinkDark)}
      {px(cx-2, cy-3, 6, 3, C.petalPink)}
      {px(cx-2, cy-3, 1, 3, C.petalPinkDark)}
      {px(cx+3, cy-3, 1, 3, C.petalPinkDark)}
      {px(cx-2, cy+3, 6, 3, C.petalPink)}
      {px(cx-2, cy+5, 6, 1, C.petalPinkDark)}
      {/* diagonales */}
      {px(cx-3, cy-2, 2, 3, C.petalPinkMid)}
      {px(cx-3, cy-2, 1, 3, C.petalPinkDark)}
      {px(cx+3, cy-2, 2, 3, C.petalPinkMid)}
      {px(cx+4, cy-2, 1, 3, C.petalPinkDark)}
      {px(cx-3, cy+2, 2, 3, C.petalPinkMid)}
      {px(cx+3, cy+2, 2, 3, C.petalPinkMid)}
      {/* pétalos interiores blancos */}
      {px(cx-2, cy-1, 6, 5, C.petalWhite)}
      {px(cx-1, cy-2, 4, 1, C.petalPale)}
      {px(cx-2, cy,   1, 3, C.petalPink)}
      {px(cx+3, cy,   1, 3, C.petalPink)}
      {/* receptáculo y estambres */}
      {px(cx-1, cy+1, 4, 3, C.receptacle)}
      {px(cx,   cy+1, 2, 1, C.receptacleDark)}
      {px(cx-1, cy+2, 4, 1, C.stamens)}
      {px(cx,   cy+3, 2, 1, C.stamen)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function LotusStage1() {
  // Primer brote saliendo del barro
  return (
    <>
      <LotusBase />
      {px(11, 10, 2, 3, C.stem)}
      {px(10, 9,  4, 1, C.stemLight)}
      {px(11, 9,  2, 1, C.stem)}
    </>
  );
}

export function LotusStage2() {
  // Primer lilypad pequeño
  return (
    <>
      <LotusBase />
      {LotusStalk(11, 9, 12)}
      {LilyPad(12, 9, 3)}
    </>
  );
}

export function LotusStage3() {
  // Dos lilypads, tallo más largo
  return (
    <>
      <LotusBase />
      {LotusStalk(11, 7, 12)}
      {LilyPad(7,  11, 4)}
      {LilyPad(16,  9, 3)}
    </>
  );
}

export function LotusStage4() {
  // Tres lilypads, capullo emergiendo
  return (
    <>
      <LotusBase />
      {LotusStalk(11, 5, 12)}
      {LilyPad(5,  11, 5)}
      {LilyPad(17, 10, 4)}
      {LilyPad(12,  9, 3)}
      {/* tallo del capullo */}
      {px(11, 5, 2, 4, C.stemLight)}
      {LotusFlower(11, 2, false)}
    </>
  );
}

export function LotusStage5() {
  // Capullo más grande, abriendo
  return (
    <>
      <LotusBase />
      {LotusStalk(11, 6, 12)}
      {LilyPad(4,  11, 5)}
      {LilyPad(18, 10, 4)}
      {LilyPad(11,  9, 3)}
      {px(11, 2, 2, 4, C.stemLight)}
      {px(10, 1, 4, 5, C.bud)}
      {px(10, 1, 1, 5, C.budDark)}
      {px(13, 1, 1, 5, C.budDark)}
      {px(11, 0, 2, 1, C.petalPale)}
      {px(11, 2, 2, 2, C.petalWhite)}
    </>
  );
}

export function LotusStage6() {
  return (
    <>
      <LotusBase />
      {LotusStalk(11, 6, 12)}
      {LilyPad(3,  11, 6)}
      {LilyPad(19, 10, 4)}
      {LilyPad(13,  9, 3)}
      {px(11, 2, 2, 4, C.stem)}
      {/* flor semi-abierta */}
      {px(8,  4, 8, 4, C.petalPink)}
      {px(8,  4, 1, 4, C.petalPinkDark)}
      {px(15, 4, 1, 4, C.petalPinkDark)}
      {px(9,  2, 6, 2, C.petalPink)}
      {px(9,  2, 1, 2, C.petalPinkDark)}
      {px(14, 2, 1, 2, C.petalPinkDark)}
      {px(10, 0, 4, 2, C.petalPale)}
      {px(9,  5, 6, 2, C.petalWhite)}
      {px(10, 6, 4, 1, C.receptacle)}
    </>
  );
}

export function LotusStage7() {
  return (
    <>
      <LotusBase />
      {LotusStalk(11, 6, 12)}
      {LilyPad(3,  10, 6)}
      {LilyPad(19, 10, 5)}
      {LilyPad(12,  8, 4)}
      {px(11, 3, 2, 3, C.stem)}
      {LotusFlower(11, 6, true)}
    </>
  );
}

export function LotusStage8() {
  return (
    <>
      <LotusBase />
      {LotusStalk(11, 5, 12)}
      {LilyPad(2,  10, 6)}
      {LilyPad(19,  9, 6)}
      {LilyPad(11,  8, 4)}
      {LilyPad(7,   8, 3)}
      {px(11, 2, 2, 3, C.stem)}
      {LotusFlower(11, 5, true)}
    </>
  );
}

export function LotusStage9() {
  // Flor completamente abierta, múltiples lilypads, esplendor acuático
  return (
    <>
      <LotusBase />
      {LotusStalk(11, 4, 12)}
      {LilyPad(2,   9, 7)}
      {LilyPad(20,  9, 3)}
      {LilyPad(18, 10, 5)}
      {LilyPad(11,  8, 4)}
      {LilyPad(6,   8, 3)}
      {px(11, 1, 2, 3, C.stemLight)}
      {/* flor grande centrada */}
      {LotusFlower(11, 4, true)}
      {/* segunda flor pequeña al costado */}
      {LotusStalk(5, 7, 12)}
      {LotusFlower(5, 5, false)}
    </>
  );
}